/* Interactive Markdown-backed study deck. Keeps docs/aws-data-eng-associate.md as the source of truth. */
(function () {
  "use strict";

  const sourcePath = "/docs/aws-data-eng-associate.md";
  const state = { slides: [], index: 0, expandedSections: new Set(), diagram: null, diagramObserver: null };
  const visualsByTitle = window.studyVisuals || {};
  const elements = {
    slide: document.getElementById("slide"), previous: document.getElementById("previous"),
    next: document.getElementById("next"), count: document.getElementById("slide-count"),
    section: document.getElementById("section-name"), progress: document.getElementById("progress-bar"),
    overview: document.getElementById("topic-overview"), overviewToggle: document.getElementById("overview-toggle"),
    topicList: document.getElementById("topic-list"),
    workspace: document.getElementById("study-workspace"), search: document.getElementById("topic-search"),
    results: document.getElementById("topic-results")
  };

  function escapeHtml(value) {
    return value.replace(/[&<>"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character];
    });
  }

  function formatText(value) {
    return escapeHtml(value)
      .replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+|\/(?!\/)[^\s)]*)\)/g, '<a href="$2">$1</a>')
      .replace(/`([^`]+)`/g, "<em>$1</em>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  function cleanTitle(value) { return value.replace(/^Section\s+/i, "").replace(/\s+/g, " ").trim(); }

  function parseMarkdown(markdown) {
    const slides = [];
    let current = null;
    let currentSection = "Study guide";
    let table = null;
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

      const heading = line.match(/^ {0,3}(#{1,4})(?:[ \t]+(.*))?$/);
      if (heading) {
        flushParagraph();
        const rawTitle = (heading[2] || "").trim();
        const title = cleanTitle(rawTitle) || "Unexpanded topic";
        const isSection = /^Section\s+/i.test(rawTitle);
        if (isSection) currentSection = title;
        current = { level: heading[1].length, title: title, section: currentSection, isSection: isSection, unexpanded: !rawTitle, listItems: [], paragraphs: [], code: [], tables: [] };
        table = null;
        slides.push(current);
        return;
      }
      if (!current) return;
      if (!line.trim()) { flushParagraph(); table = null; return; }
      const sourcePage = line.match(/^<!-- pdf-page: (\d+) -->$/);
      if (sourcePage) { current.sourcePage = Number(sourcePage[1]); return; }
      const displayTitle = line.match(/^<!-- title: (.+) -->$/);
      if (displayTitle) { current.title = displayTitle[1]; return; }
      const originalNote = line.match(/^<!-- original-note: (\d+) -->$/);
      if (originalNote) { current.originalNote = Number(originalNote[1]); return; }
      if (line === "<!-- section -->") { current.isSection = true; currentSection = current.title; current.section = currentSection; return; }
      if (line === "<!-- unexpanded -->") { current.unexpanded = true; return; }
      if (/^\|.*\|$/.test(line.trim())) {
        flushParagraph();
        const cells = line.trim().slice(1, -1).split("|").map(function (cell) { return cell.trim(); });
        if (cells.every(function (cell) { return /^:?-{3,}:?$/.test(cell); })) return;
        if (!table) { table = []; current.tables.push(table); }
        table.push(cells);
        return;
      }

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

  function renderVisual(slide) {
    const visual = getVisual(slide);
    if (!visual) return "";
    if (visual.type === "image") {
      return "<figure class=\"slide-visual\"><img src=\"" + escapeHtml(visual.src) + "\" alt=\"" + escapeHtml(visual.alt) + "\" width=\"1200\" height=\"675\" loading=\"lazy\"><figcaption>" + escapeHtml(visual.caption) + "</figcaption></figure>";
    }
    if (visual.type === "diagram") {
      const relationships = visual.links.map(function (link) {
        const from = visual.nodes.find(function (node) { return node.key === link.from; });
        const to = visual.nodes.find(function (node) { return node.key === link.to; });
        return "<li>" + escapeHtml((from ? from.text : link.from) + " — " + link.label + (link.relation ? " — " : " → ") + (to ? to.text : link.to)) + "</li>";
      }).join("");
      const nodes = visual.nodes.map(function (node) { return "<li>" + escapeHtml(node.text + (node.detail ? ": " + node.detail : "")) + "</li>"; }).join("");
      return "<figure class=\"slide-visual\"><div class=\"visual-toolbar\"><p class=\"visual-label\">" + (visual.kind === "structure" ? "Structure" : "Flow") + " diagram</p><div class=\"diagram-controls\"><button class=\"diagram-button\" type=\"button\" data-diagram-zoom=\"out\" aria-label=\"Zoom diagram out\">−</button><button class=\"diagram-button\" type=\"button\" data-diagram-fit=\"" + escapeHtml(visual.id) + "\">Fit diagram</button><button class=\"diagram-button\" type=\"button\" data-diagram-zoom=\"in\" aria-label=\"Zoom diagram in\">+</button></div></div><div class=\"study-diagram\" id=\"" + escapeHtml(visual.id) + "\" aria-hidden=\"true\"></div><p class=\"diagram-fallback\" data-diagram-fallback hidden>Canvas unavailable. The complete diagram is described below.</p><figcaption>" + escapeHtml(visual.caption) + "</figcaption><details class=\"diagram-text\"><summary>Read diagram as text</summary><p>Components</p><ul>" + nodes + "</ul><p>Relationships</p><ul>" + relationships + "</ul></details></figure>";
    }
    return "";
  }

  function getVisual(slide) {
    return slide.sourcePage ? visualsByTitle["pdf:" + slide.sourcePage] : visualsByTitle[slide.title];
  }

  function renderTables(tables) {
    return tables.map(function (rows) {
      function cells(row, tag) { return row.map(function (cell) { return "<" + tag + ">" + formatText(cell) + "</" + tag + ">"; }).join(""); }
      return '<div class="study-table" role="region" aria-label="Study comparison" tabindex="0"><table><thead><tr>' + cells(rows[0], "th")
        + "</tr></thead><tbody>" + rows.slice(1).map(function (row) { return "<tr>" + cells(row, "td") + "</tr>"; }).join("") + "</tbody></table></div>";
    }).join("");
  }

  function splitPoints(items, limit) {
    if (!items.length) return { main: [], rest: [] };
    const root = Math.min.apply(null, items.map(function (item) { return item.indent; }));
    const main = items.filter(function (item) { return item.indent === root; }).slice(0, limit).map(function (item) {
      if (!/:$/.test(item.text)) return item;
      const start = items.indexOf(item) + 1;
      const children = [];
      for (let i = start; i < items.length && items[i].indent > root; i++) children.push(items[i]);
      if (!children.length) return item;
      const childIndent = Math.min.apply(null, children.map(function (child) { return child.indent; }));
      const summary = children.filter(function (child) { return child.indent === childIndent; }).slice(0, 2)
        .map(function (child) { return child.text; }).join("; ");
      return Object.assign({}, item, { text: item.text + " " + summary });
    });
    // Nested explanations need their parent outline; flat lists only need the
    // additional points that were not already presented on the card.
    const nested = items.some(function (item) { return item.indent > root; });
    return { main: main, rest: nested ? items : items.slice(limit) };
  }

  function disposeDiagram() {
    if (state.diagramObserver) { state.diagramObserver.disconnect(); state.diagramObserver = null; }
    if (state.diagram) { state.diagram.div = null; state.diagram = null; }
  }

  function initializeDiagram(slide) {
    const visual = getVisual(slide);
    if (!visual || visual.type !== "diagram") return;
    const host = document.getElementById(visual.id);
    const fallback = elements.slide.querySelector("[data-diagram-fallback]");
    if (!host) return;
    if (!window.go) {
      host.hidden = true;
      if (fallback) fallback.hidden = false;
      elements.slide.querySelector(".diagram-text").open = true;
      elements.slide.querySelectorAll(".diagram-controls button").forEach(function (button) { button.disabled = true; });
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
      $(go.Shape, { toArrow: "Standard", fill: "#5de6ff", stroke: null, scale: .8 }, new go.Binding("toArrow", "relation", function (relation) { return relation ? "" : "Standard"; })),
      $(go.TextBlock, { segmentOffset: new go.Point(0, -12), font: "10px 'JetBrains Mono', monospace", stroke: "#c7c4d7" }, new go.Binding("text", "label"))
    );
    diagram.addDiagramListener("InitialLayoutCompleted", function () { diagram.commandHandler.zoomToFit(); });
    diagram.model = new go.GraphLinksModel(visual.nodes.map(function (node) { return Object.assign({}, node); }), visual.links.map(function (link) { return Object.assign({}, link); }));
    host.tabIndex = -1;
    host.querySelectorAll("canvas").forEach(function (canvas) { canvas.tabIndex = -1; });
    state.diagram = diagram;

    const fitButton = elements.slide.querySelector("[data-diagram-fit]");
    if (fitButton) fitButton.addEventListener("click", function () { diagram.commandHandler.zoomToFit(); });
    elements.slide.querySelectorAll("[data-diagram-zoom]").forEach(function (button) {
      button.addEventListener("click", function () { diagram.scale *= button.dataset.diagramZoom === "in" ? 1.2 : 1 / 1.2; });
    });
    if (window.ResizeObserver) {
      state.diagramObserver = new ResizeObserver(function () { diagram.requestUpdate(); });
      state.diagramObserver.observe(host);
    }
  }

  function renderSlide(shouldFocus) {
    const current = state.slides[state.index];
    const section = current.section;
    const points = splitPoints(current.listItems, 4);
    const notes = renderList(points.main);
    const visual = renderVisual(current);
    const visualData = getVisual(current);
    const wideDiagram = visualData && visualData.type === "diagram" && visualData.nodes.length > 3;
    const compactDiagram = visualData && visualData.type === "diagram" && !wideDiagram;
    const introduction = current.paragraphs[0] ? "<p class=\"slide-lede\">" + formatText(current.paragraphs[0]) + "</p>" : "";
    const code = current.code.map(function (snippet) { return "<pre class=\"code-block\"><code>" + escapeHtml(snippet) + "</code></pre>"; }).join("");
    const references = current.paragraphs.filter(function (paragraph) { return paragraph.startsWith("**Current reference"); });
    const paragraphs = current.paragraphs.slice(1).filter(function (paragraph) { return !references.includes(paragraph); });
    const detail = renderList(points.rest) + paragraphs.map(function (paragraph) { return '<p class="detail-note">' + formatText(paragraph) + '</p>'; }).join("") + renderTables(current.tables) + code;
    const details = detail ? '<details class="notes-details"><summary>Detailed notes' + (current.code.length || current.tables.length ? ' and examples' : '') + '</summary>' + detail + '</details>' : '';
    const empty = current.unexpanded || !notes && !current.paragraphs.length && !code
      ? "<p class=\"empty-note\">This topic is marked in the source notes but has not been expanded yet. Use it as a prompt for deeper study.</p>" : "";

    disposeDiagram();
    elements.slide.classList.remove("entering");
    elements.slide.classList.toggle("slide--split", Boolean(compactDiagram));
    void elements.slide.offsetWidth;
    elements.slide.innerHTML = "<div>"
      + "<p class=\"slide-index\">" + (current.sourcePage ? "PDF page " + current.sourcePage : "Study notes") + "</p>"
      + "<p class=\"slide-section\">" + escapeHtml(section) + "</p>"
      + "<h2>" + escapeHtml(current.title) + "</h2>"
      + (compactDiagram ? '<div class="slide-copy">' + introduction + notes + '</div>' + visual : introduction + (wideDiagram ? visual + notes : notes + visual)) + details
      + references.map(function (reference) { return '<p class="source-reference">' + formatText(reference) + '</p>'; }).join("")
      + empty + "</div>";
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
    elements.slide.scrollTop = 0;
    if (window.matchMedia("(max-width: 860px)").matches) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (shouldFocus !== false) elements.slide.focus({ preventScroll: true });
  }

  function groupTopics(slides) {
    const groups = new Map();
    slides.forEach(function (slide, index) {
      if (!groups.has(slide.section)) groups.set(slide.section, { section: slide.section, topics: [] });
      groups.get(slide.section).topics.push({ slide: slide, index: index });
    });
    return Array.from(groups.values());
  }

  function matchesTopic(slide, query) {
    return /^\d+$/.test(query) ? slide.sourcePage === Number(query)
      : (slide.title + " " + slide.section).toLowerCase().includes(query.toLowerCase());
  }

  function renderOverview() {
    elements.topicList.innerHTML = groupTopics(state.slides).map(function (group) {
      return '<details class="topic-section" data-section="' + escapeHtml(group.section) + '"><summary><span class="topic-section-title">'
        + escapeHtml(group.section) + '</span><span class="topic-section-count"></span></summary><ul class="section-topics">'
        + group.topics.map(function (topic) {
          return '<li><button class="topic-button" type="button" data-slide-index="' + topic.index + '"><strong class="topic-title">'
            + escapeHtml(topic.slide.title) + '</strong></button></li>';
        }).join("") + '</ul></details>';
    }).join("");
    elements.topicList.querySelectorAll(".topic-section").forEach(function (group) {
      group.addEventListener("toggle", function () {
        if (elements.search.value.trim()) return;
        if (group.open) state.expandedSections.add(group.dataset.section);
        else state.expandedSections.delete(group.dataset.section);
      });
    });
    elements.topicList.querySelectorAll("[data-slide-index]").forEach(function (button) {
      button.addEventListener("click", function () { goTo(Number(button.dataset.slideIndex)); });
    });
    filterOverview();
  }

  function filterOverview() {
    const query = elements.search.value.trim().toLowerCase();
    let count = 0;
    let sections = 0;
    elements.topicList.querySelectorAll(".topic-section").forEach(function (group) {
      let matches = 0;
      group.querySelectorAll("[data-slide-index]").forEach(function (button) {
        const show = matchesTopic(state.slides[Number(button.dataset.slideIndex)], query);
        button.hidden = !show;
        button.parentElement.hidden = !show;
        if (show) matches++;
      });
      group.hidden = !matches;
      group.open = query ? matches > 0 : state.expandedSections.has(group.dataset.section);
      const badge = group.querySelector(".topic-section-count");
      badge.textContent = String(matches);
      badge.setAttribute("aria-label", matches + " topics");
      if (matches) sections++;
      count += matches;
    });
    elements.results.textContent = count ? count + " topics in " + sections + " sections" : "No matching topics. Try a service name or PDF page.";
  }

  function showLocation(shouldFocus) {
    const page = location.hash.match(/^#page-(\d+)$/);
    const topic = location.hash.match(/^#(?:course-)?topic-(\d+)$/);
    const original = location.hash.match(/^#note-(\d+)$/);
    const target = page ? state.slides.findIndex(function (slide) { return slide.sourcePage === Number(page[1]); })
      : original ? state.slides.findIndex(function (slide) { return slide.originalNote === Number(original[1]); })
        : topic ? Number(topic[1]) : 0;
    state.index = Math.max(0, Math.min(target, state.slides.length - 1));
    elements.search.value = "";
    filterOverview();
    renderSlide(shouldFocus !== false);
  }

  function updateOverviewSelection() {
    elements.topicList.querySelectorAll("[data-slide-index]").forEach(function (button) {
      button.setAttribute("aria-current", String(Number(button.dataset.slideIndex) === state.index));
    });
    const current = state.slides[state.index];
    state.expandedSections.add(current.section);
    elements.topicList.querySelectorAll(".topic-section").forEach(function (group) {
      group.dataset.current = String(group.dataset.section === current.section);
      if (group.dataset.section === current.section) group.open = true;
    });
    if (window.matchMedia("(min-width: 861px)").matches) {
      const active = elements.topicList.querySelector('[aria-current="true"]');
      const item = active.getBoundingClientRect(), list = elements.topicList.getBoundingClientRect();
      if (item.top < list.top) elements.topicList.scrollTop -= list.top - item.top;
      else if (item.bottom > list.bottom) elements.topicList.scrollTop += item.bottom - list.bottom;
    }
  }

  function goTo(index) {
    state.index = Math.max(0, Math.min(index, state.slides.length - 1));
    const slide = state.slides[state.index];
    if (!matchesTopic(slide, elements.search.value.trim())) { elements.search.value = ""; filterOverview(); }
    history.replaceState(null, "", slide.sourcePage ? "#page-" + slide.sourcePage : slide.originalNote !== undefined ? "#note-" + slide.originalNote : "#topic-" + state.index);
    renderSlide();
  }

  function toggleOverview(shouldOpen) {
    elements.workspace.classList.toggle("sidebar-hidden", !shouldOpen);
    elements.overview.setAttribute("aria-hidden", String(!shouldOpen));
    elements.overview.inert = !shouldOpen;
    elements.overviewToggle.setAttribute("aria-expanded", String(shouldOpen));
    elements.overviewToggle.textContent = shouldOpen ? ">" : "<";
    elements.overviewToggle.setAttribute("aria-label", shouldOpen ? "Hide topic list" : "Show topic list");
    if (!shouldOpen) elements.overviewToggle.focus();
  }

  function bindEvents() {
    elements.previous.addEventListener("click", function () { goTo(state.index - 1); });
    elements.next.addEventListener("click", function () { if (state.index < state.slides.length - 1) goTo(state.index + 1); });
    elements.overviewToggle.addEventListener("click", function () { toggleOverview(elements.workspace.classList.contains("sidebar-hidden")); });
    elements.search.addEventListener("input", filterOverview);
    window.addEventListener("hashchange", showLocation);
    document.addEventListener("keydown", function (event) {
      if (event.defaultPrevented || event.target.closest(".site-header, input, select, textarea, [contenteditable='true']")) return;
      if (event.key === "Escape" && !elements.workspace.classList.contains("sidebar-hidden")) { toggleOverview(false); return; }
      if (event.target.closest("button, summary, .study-diagram") && (event.key === "ArrowLeft" || event.key === "ArrowRight")) return;
      if (event.key === "ArrowRight") goTo(state.index + 1);
      if (event.key === "ArrowLeft") goTo(state.index - 1);
      if (event.key.toLowerCase() === "o") toggleOverview(elements.workspace.classList.contains("sidebar-hidden"));
    });
  }

  fetch(sourcePath)
    .then(function (response) { if (!response.ok) throw new Error("Study notes could not be loaded."); return response.text(); })
    .then(function (markdown) {
      state.slides = parseMarkdown(markdown).filter(function (topic) { return !topic.isSection; });
      renderOverview();
      showLocation(false);
      bindEvents();
    })
    .catch(function (error) {
      elements.slide.innerHTML = "<p class=\"warning\">" + escapeHtml(error.message) + " Serve this folder through a local web server so the Markdown source can be read.</p>";
    });
}());
