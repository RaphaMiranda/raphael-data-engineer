/* Interactive Markdown-backed study deck. Keeps docs/aws-data-eng-associate.md as the source of truth. */
(function () {
  "use strict";

  const sourcePath = "/docs/aws-data-eng-associate.md";
  const state = { slides: [], index: 0, diagram: null, diagramObserver: null };
  const visualsByTitle = window.studyVisuals || {};
  const elements = {
    slide: document.getElementById("slide"), previous: document.getElementById("previous"),
    next: document.getElementById("next"), count: document.getElementById("slide-count"),
    section: document.getElementById("section-name"), progress: document.getElementById("progress-bar"),
    overview: document.getElementById("topic-overview"), overviewToggle: document.getElementById("overview-toggle"),
    overviewClose: document.getElementById("overview-close"), topicList: document.getElementById("topic-list"),
    workspace: document.getElementById("study-workspace")
  };

  function escapeHtml(value) {
    return value.replace(/[&<>"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character];
    });
  }

  function formatText(value) {
    return escapeHtml(value).replace(/`([^`]+)`/g, "<em>$1</em>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  function cleanTitle(value) { return value.replace(/^Section\s+/i, "").replace(/\s+/g, " ").trim(); }

  function parseMarkdown(markdown) {
    const slides = [];
    let current = null;
    let currentSection = "Study guide";
    let inCodeBlock = false;
    let codeLines = [];
    let paragraphLines = [];

    function flushParagraph() {
      if (current && paragraphLines.length) current.paragraphs.push(paragraphLines.join(" "));
      paragraphLines = [];
    }

    markdown.replace(/\r/g, "").split("\n").forEach(function (line) {
      if (line.trim().startsWith("```")) {
        flushParagraph();
        inCodeBlock = !inCodeBlock;
        if (!inCodeBlock && current && codeLines.length) { current.code.push(codeLines.join("\n")); codeLines = []; }
        return;
      }
      if (inCodeBlock) { codeLines.push(line); return; }

      const heading = line.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        const rawTitle = heading[2].trim();
        const title = cleanTitle(rawTitle);
        if (/^Section\s+/i.test(rawTitle)) currentSection = title;
        current = { level: heading[1].length, title: title, section: currentSection, listItems: [], paragraphs: [], code: [] };
        slides.push(current);
        return;
      }
      if (!current) return;
      if (!line.trim()) { flushParagraph(); return; }

      const listItem = line.match(/^(\s*)(?:([-*])|(\d+)\.)\s+(.+)$/);
      if (listItem) {
        flushParagraph();
        current.listItems.push({ indent: listItem[1].replace(/\t/g, "  ").length, ordered: Boolean(listItem[3]), text: listItem[4].trim() });
      } else if (!line.trim().startsWith("<!--")) {
        paragraphLines.push(line.trim());
      }
    });
    flushParagraph();
    return slides;
  }

  function renderList(items) {
    function renderGroup(start, indent, ordered) {
      const tag = ordered ? "ol" : "ul";
      let html = "<" + tag + " class=\"note-list" + (ordered ? " ordered" : "") + "\">";
      let index = start;
      while (index < items.length) {
        const item = items[index];
        if (item.indent < indent || (item.indent === indent && item.ordered !== ordered)) break;
        if (item.indent > indent) {
          const nested = renderGroup(index, item.indent, item.ordered);
          html = html.slice(0, -5) + nested.html + "</li>";
          index = nested.index;
          continue;
        }
        html += "<li>" + formatText(item.text) + "</li>";
        index += 1;
      }
      html += "</" + tag + ">";
      return { html: html, index: index };
    }

    let html = "";
    let index = 0;
    while (index < items.length) {
      const group = renderGroup(index, items[index].indent, items[index].ordered);
      html += group.html;
      index = group.index;
    }
    return html;
  }

  function buildTitleSlide(topicCount, sectionCount) {
    return {
      title: "AWS Data Engineer Associate", isTitle: true, section: "Start here", level: 0,
      listItems: [], code: [], topicCount: topicCount, sectionCount: sectionCount,
      paragraphs: ["A focused, slide-by-slide reference built directly from your study notes. Use the topic map to jump around, or move through the deck in order."]
    };
  }

  function renderVisual(slide) {
    const visual = visualsByTitle[slide.title];
    if (!visual) return "";
    if (visual.type === "image") {
      return "<figure class=\"slide-visual\"><img src=\"" + escapeHtml(visual.src) + "\" alt=\"" + escapeHtml(visual.alt) + "\" width=\"1200\" height=\"675\" loading=\"lazy\"><figcaption>" + escapeHtml(visual.caption) + "</figcaption></figure>";
    }
    if (visual.type === "diagram") {
      const accessibleFlow = visual.nodes.map(function (node) { return node.text + ": " + node.detail; }).join(". ");
      const relationships = visual.links.map(function (link) {
        const from = visual.nodes.find(function (node) { return node.key === link.from; });
        const to = visual.nodes.find(function (node) { return node.key === link.to; });
        return (from ? from.text : link.from) + " sends " + link.label + " to " + (to ? to.text : link.to) + ".";
      }).join(" ");
      return "<figure class=\"slide-visual\"><div class=\"visual-toolbar\"><p class=\"visual-label\">Diagram · mouse pan / wheel zoom</p><button class=\"diagram-button\" type=\"button\" data-diagram-fit=\"" + escapeHtml(visual.id) + "\">Fit diagram</button></div><p class=\"sr-only\">" + escapeHtml(visual.label + ". " + visual.caption + " " + accessibleFlow + " " + relationships) + "</p><div class=\"study-diagram\" id=\"" + escapeHtml(visual.id) + "\" aria-hidden=\"true\"></div><p class=\"diagram-fallback\" data-diagram-fallback hidden>Diagram unavailable. Study the text flow in the slide notes and caption instead.</p><figcaption>" + escapeHtml(visual.caption) + " Drag the canvas to pan; use the mouse wheel over the diagram to zoom.</figcaption></figure>";
    }
    return "";
  }

  function disposeDiagram() {
    if (state.diagramObserver) { state.diagramObserver.disconnect(); state.diagramObserver = null; }
    if (state.diagram) { state.diagram.div = null; state.diagram = null; }
  }

  function initializeDiagram(slide) {
    const visual = visualsByTitle[slide.title];
    if (!visual || visual.type !== "diagram") return;
    const host = document.getElementById(visual.id);
    const fallback = elements.slide.querySelector("[data-diagram-fallback]");
    if (!host) return;
    if (!window.go) {
      host.hidden = true;
      if (fallback) fallback.hidden = false;
      return;
    }

    const $ = go.GraphObject.make;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const diagram = $(go.Diagram, host, {
      layout: $(go.LayeredDigraphLayout, { direction: 0, layerSpacing: 48, columnSpacing: 28 }),
      initialAutoScale: go.AutoScale.Uniform,
      contentAlignment: go.Spot.Center,
      isReadOnly: true,
      allowSelect: false,
      allowMove: false,
      allowCopy: false,
      allowDelete: false,
      allowInsert: false,
      allowLink: false,
      allowRelink: false,
      "animationManager.isEnabled": !reduceMotion,
      "toolManager.mouseWheelBehavior": go.WheelMode.Zoom
    });

    diagram.nodeTemplate = $(go.Node, "Auto", { selectable: false, cursor: "default" },
      $(go.Shape, "RoundedRectangle", { parameter1: 12, stroke: "#464554", strokeWidth: 1.3 }, new go.Binding("fill", "fill")),
      $(go.Panel, "Vertical", { margin: 12, defaultAlignment: go.Spot.Left },
        $(go.TextBlock, { font: "600 13px 'Space Grotesk', sans-serif", stroke: "#dae2fd", maxSize: new go.Size(150, NaN), wrap: go.Wrap.Fit }, new go.Binding("text", "text")),
        $(go.TextBlock, { margin: new go.Margin(5, 0, 0, 0), font: "10px 'JetBrains Mono', monospace", stroke: "#c7c4d7", maxSize: new go.Size(150, NaN), wrap: go.Wrap.Fit }, new go.Binding("text", "detail"))
      )
    );
    diagram.linkTemplate = $(go.Link, { routing: go.Routing.AvoidsNodes, corner: 10, selectable: false },
      $(go.Shape, { stroke: "#5de6ff", strokeWidth: 2 }),
      $(go.Shape, { toArrow: "Standard", fill: "#5de6ff", stroke: null, scale: .8 }),
      $(go.TextBlock, { segmentOffset: new go.Point(0, -12), font: "10px 'JetBrains Mono', monospace", stroke: "#c7c4d7" }, new go.Binding("text", "label"))
    );
    diagram.addDiagramListener("InitialLayoutCompleted", function () { diagram.commandHandler.zoomToFit(); });
    diagram.model = new go.GraphLinksModel(visual.nodes, visual.links);
    host.tabIndex = -1;
    state.diagram = diagram;

    const fitButton = elements.slide.querySelector("[data-diagram-fit]");
    if (fitButton) fitButton.addEventListener("click", function () { diagram.commandHandler.zoomToFit(); });
    if (window.ResizeObserver) {
      state.diagramObserver = new ResizeObserver(function () { diagram.requestUpdate(); });
      state.diagramObserver.observe(host);
    }
  }

  function renderSlide() {
    const current = state.slides[state.index];
    const isTitle = current.isTitle;
    const section = current.section;
    const titleTag = isTitle ? "h1" : "h2";
    const notes = current.listItems.length ? renderList(current.listItems) : "";
    const visual = renderVisual(current);
    const code = current.code.map(function (snippet) { return "<pre class=\"code-block\"><code>" + escapeHtml(snippet) + "</code></pre>"; }).join("");
    const empty = !isTitle && !notes && !current.paragraphs.length && !code
      ? "<p class=\"empty-note\">This topic is marked in the source notes but has not been expanded yet. Use it as a prompt for deeper study.</p>" : "";
    const titleStats = isTitle ? "<div class=\"title-stats\"><span>" + current.topicCount + " note topics</span><span>" + current.sectionCount + " study sections</span><span>Keyboard ready</span></div>" : "";

    disposeDiagram();
    elements.slide.classList.remove("entering");
    void elements.slide.offsetWidth;
    elements.slide.innerHTML = "<div class=\"" + (isTitle ? "title-slide" : "") + "\">"
      + "<p class=\"slide-index\">" + (isTitle ? "Interactive study deck" : "Topic " + String(state.index).padStart(2, "0")) + "</p>"
      + "<p class=\"slide-section\">" + escapeHtml(section) + "</p>"
      + "<" + titleTag + ">" + (isTitle ? "AWS Data Engineer <span class=\"accent\">Associate</span>" : escapeHtml(current.title)) + "</" + titleTag + ">"
      + "<p class=\"slide-lede\">" + formatText(current.paragraphs[0] || (isTitle ? current.paragraphs[0] : "Key notes from your source document.")) + "</p>"
      + visual + notes
      + (current.paragraphs.length > 1 ? "<p class=\"detail-note\">" + formatText(current.paragraphs.slice(1).join(" ")) + "</p>" : "")
      + code + empty + titleStats + "</div>";
    elements.slide.classList.add("entering");
    elements.count.textContent = (state.index + 1) + " / " + state.slides.length;
    elements.section.textContent = section;
    elements.progress.style.width = (((state.index + 1) / state.slides.length) * 100) + "%";
    elements.previous.disabled = state.index === 0;
    elements.next.disabled = state.index === state.slides.length - 1;
    elements.previous.setAttribute("aria-disabled", String(elements.previous.disabled));
    elements.next.setAttribute("aria-disabled", String(elements.next.disabled));
    elements.next.textContent = state.index === state.slides.length - 1 ? "Complete" : "Next";
    updateOverviewSelection();
    initializeDiagram(current);
    elements.slide.focus({ preventScroll: true });
  }

  function renderOverview() {
    elements.topicList.innerHTML = state.slides.map(function (slide, index) {
      const summary = (slide.paragraphs[0] || slide.listItems[0]?.text || "Open this slide for its study notes.").replace(/\s+/g, " ").trim();
      return "<button class=\"topic-button\" type=\"button\" data-slide-index=\"" + index + "\"><small>" + escapeHtml(slide.section) + "</small><strong class=\"topic-title\">" + escapeHtml(slide.title) + "</strong><span class=\"topic-summary\">" + escapeHtml(summary) + "</span></button>";
    }).join("");
    elements.topicList.querySelectorAll("[data-slide-index]").forEach(function (button) {
      button.addEventListener("click", function () { goTo(Number(button.dataset.slideIndex)); });
    });
  }

  function updateOverviewSelection() {
    elements.topicList.querySelectorAll("[data-slide-index]").forEach(function (button) {
      button.setAttribute("aria-current", String(Number(button.dataset.slideIndex) === state.index));
    });
  }

  function goTo(index) { state.index = Math.max(0, Math.min(index, state.slides.length - 1)); renderSlide(); }

  function toggleOverview(shouldOpen) {
    elements.workspace.classList.toggle("sidebar-hidden", !shouldOpen);
    elements.overview.setAttribute("aria-hidden", String(!shouldOpen));
    elements.overview.inert = !shouldOpen;
    elements.overviewToggle.setAttribute("aria-expanded", String(shouldOpen));
    elements.overviewToggle.textContent = shouldOpen ? "Hide topics" : "Show topics";
    if (!shouldOpen) elements.overviewToggle.focus();
  }

  function bindEvents() {
    elements.previous.addEventListener("click", function () { goTo(state.index - 1); });
    elements.next.addEventListener("click", function () { if (state.index < state.slides.length - 1) goTo(state.index + 1); });
    elements.overviewToggle.addEventListener("click", function () { toggleOverview(elements.workspace.classList.contains("sidebar-hidden")); });
    elements.overviewClose.addEventListener("click", function () { toggleOverview(false); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !elements.workspace.classList.contains("sidebar-hidden")) { toggleOverview(false); return; }
      if (event.target.closest("button, .study-diagram") && (event.key === "ArrowLeft" || event.key === "ArrowRight")) return;
      if (event.key === "ArrowRight") goTo(state.index + 1);
      if (event.key === "ArrowLeft") goTo(state.index - 1);
      if (event.key.toLowerCase() === "o") toggleOverview(elements.workspace.classList.contains("sidebar-hidden"));
    });
  }

  fetch(sourcePath)
    .then(function (response) { if (!response.ok) throw new Error("Study notes could not be loaded."); return response.text(); })
    .then(function (markdown) {
      const topics = parseMarkdown(markdown);
      const sectionCount = new Set(topics.filter(function (topic) { return topic.title === topic.section; }).map(function (topic) { return topic.section; })).size;
      state.slides = [buildTitleSlide(topics.length, sectionCount)].concat(topics);
      renderOverview();
      renderSlide();
      bindEvents();
    })
    .catch(function (error) {
      elements.slide.innerHTML = "<p class=\"warning\">" + escapeHtml(error.message) + " Serve this folder through a local web server so the Markdown source can be read.</p>";
    });
}());
