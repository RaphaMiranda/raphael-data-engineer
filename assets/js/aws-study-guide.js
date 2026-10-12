/* Interactive Markdown-backed study deck. Keeps docs/aws-data-eng-associate.md as the source of truth. */
(function () {
  "use strict";

  const sourcePath = "/docs/aws-data-eng-associate.md";
  const state = { slides: [], topics: [], collection: "course", index: 0, diagram: null, diagramObserver: null };
  const visualsByTitle = window.studyVisuals || {};
  const elements = {
    slide: document.getElementById("slide"), previous: document.getElementById("previous"),
    next: document.getElementById("next"), count: document.getElementById("slide-count"),
    section: document.getElementById("section-name"), progress: document.getElementById("progress-bar"),
    overview: document.getElementById("topic-overview"), overviewToggle: document.getElementById("overview-toggle"),
    topicList: document.getElementById("topic-list"),
    workspace: document.getElementById("study-workspace"), search: document.getElementById("topic-search"),
    collection: document.getElementById("study-collection"), results: document.getElementById("topic-results")
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
    let collection = "course";
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

      const heading = line.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        const rawTitle = heading[2].trim();
        const title = cleanTitle(rawTitle);
        if (/^Section\s+/i.test(rawTitle)) currentSection = title;
        current = { level: heading[1].length, title: title, section: currentSection, collection: collection, listItems: [], paragraphs: [], code: [], tables: [] };
        table = null;
        slides.push(current);
        return;
      }
      if (!current) return;
      if (!line.trim()) { flushParagraph(); table = null; return; }
      const sourcePage = line.match(/^<!-- pdf-page: (\d+) -->$/);
      if (sourcePage) { current.sourcePage = Number(sourcePage[1]); return; }
      const sourceCollection = line.match(/^<!-- collection: (course|personal) -->$/);
      if (sourceCollection) { collection = sourceCollection[1]; current.collection = collection; return; }
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

  function buildTitleSlide(topicCount, sectionCount) {
    return {
      title: "AWS Data Engineer Associate", isTitle: true, section: "Start here", level: 0,
      listItems: [], code: [], tables: [], topicCount: topicCount, sectionCount: sectionCount,
      paragraphs: [state.collection === "personal"
        ? "Your preserved working notes, including unfinished study prompts. Use Course notes for the page-linked PDF sequence and dated corrections."
        : "Study the takeaway, explain the diagram, then test the tradeoff. Search by topic or physical PDF page; expand the detailed notes for examples and references."]
    };
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
    // A complete outline in the disclosure keeps nested explanations with their
    // parent; the presentation itself shows at most four top-level points.
    return { main: main, rest: items.length > main.length ? items : [] };
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

  function renderSlide() {
    const current = state.slides[state.index];
    const isTitle = current.isTitle;
    const section = current.section;
    const titleTag = isTitle ? "h1" : "h2";
    const points = splitPoints(current.listItems, 4);
    const notes = renderList(points.main);
    const visual = renderVisual(current);
    const code = current.code.map(function (snippet) { return "<pre class=\"code-block\"><code>" + escapeHtml(snippet) + "</code></pre>"; }).join("");
    const references = current.paragraphs.filter(function (paragraph) { return paragraph.startsWith("**Current reference"); });
    const paragraphs = current.paragraphs.slice(1).filter(function (paragraph) { return !references.includes(paragraph); });
    const detail = renderList(points.rest) + paragraphs.map(function (paragraph) { return '<p class="detail-note">' + formatText(paragraph) + '</p>'; }).join("") + renderTables(current.tables) + code;
    const details = detail ? '<details class="notes-details"><summary>Detailed notes' + (current.code.length || current.tables.length ? ' and examples' : '') + '</summary>' + detail + '</details>' : '';
    const empty = !isTitle && !notes && !current.paragraphs.length && !code
      ? "<p class=\"empty-note\">This topic is marked in the source notes but has not been expanded yet. Use it as a prompt for deeper study.</p>" : "";
    const titleStats = isTitle ? "<div class=\"title-stats\"><span>" + current.topicCount + " note topics</span><span>" + current.sectionCount + " study sections</span><span>Keyboard ready</span></div>" : "";

    disposeDiagram();
    elements.slide.classList.remove("entering");
    void elements.slide.offsetWidth;
    elements.slide.innerHTML = "<div class=\"" + (isTitle ? "title-slide" : "") + "\">"
      + "<p class=\"slide-index\">" + (isTitle ? "Interactive study deck" : current.sourcePage ? "PDF page " + current.sourcePage + " · course snapshot" : "Topic " + String(state.index).padStart(2, "0")) + "</p>"
      + "<p class=\"slide-section\">" + escapeHtml(section) + "</p>"
      + "<" + titleTag + ">" + (isTitle ? "AWS Data Engineer <span class=\"accent\">Associate</span>" : escapeHtml(current.title)) + "</" + titleTag + ">"
      + "<p class=\"slide-lede\">" + formatText(current.paragraphs[0] || (isTitle ? current.paragraphs[0] : "Key notes from your source document.")) + "</p>"
      + notes + visual + details
      + references.map(function (reference) { return '<p class="source-reference">' + formatText(reference) + '</p>'; }).join("")
      + empty + titleStats + "</div>";
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
    elements.slide.focus({ preventScroll: true });
  }

  function renderOverview() {
    elements.topicList.innerHTML = state.slides.map(function (slide, index) {
      return "<button class=\"topic-button\" type=\"button\" data-slide-index=\"" + index + "\"><small>" + escapeHtml(slide.section + (slide.sourcePage ? " · p. " + slide.sourcePage : "")) + "</small><strong class=\"topic-title\">" + escapeHtml(slide.title) + "</strong></button>";
    }).join("");
    elements.topicList.querySelectorAll("[data-slide-index]").forEach(function (button) {
      button.addEventListener("click", function () { goTo(Number(button.dataset.slideIndex)); });
    });
    filterOverview();
  }

  function filterOverview() {
    const query = elements.search.value.trim().toLowerCase();
    let count = 0;
    elements.topicList.querySelectorAll("[data-slide-index]").forEach(function (button) {
      const slide = state.slides[Number(button.dataset.slideIndex)];
      const matches = /^\d+$/.test(query) ? slide.sourcePage === Number(query)
        : (slide.title + " " + slide.section).toLowerCase().includes(query);
      button.hidden = !matches;
      if (matches) count++;
    });
    elements.results.textContent = count ? count + " topics" : "No matching topics. Try a service name or PDF page.";
  }

  function selectCollection(collection, page, index) {
    state.collection = collection;
    const topics = state.topics.filter(function (topic) { return topic.collection === collection; });
    const sectionCount = new Set(topics.map(function (topic) { return topic.section; })).size;
    state.slides = [buildTitleSlide(topics.length, sectionCount)].concat(topics);
    elements.collection.value = collection;
    elements.search.value = "";
    const pageIndex = page ? state.slides.findIndex(function (slide) { return slide.sourcePage === page; }) : -1;
    state.index = pageIndex >= 0 ? pageIndex : Math.max(0, Math.min(index || 0, state.slides.length - 1));
    renderOverview();
    renderSlide();
  }

  function showLocation() {
    const page = location.hash.match(/^#page-(\d+)$/);
    const topic = location.hash.match(/^#(course|personal)-topic-(\d+)$/);
    if (page) selectCollection("course", Number(page[1]));
    else if (topic) selectCollection(topic[1], null, Number(topic[2]));
    else selectCollection("course");
  }

  function updateOverviewSelection() {
    elements.topicList.querySelectorAll("[data-slide-index]").forEach(function (button) {
      button.setAttribute("aria-current", String(Number(button.dataset.slideIndex) === state.index));
    });
  }

  function goTo(index) {
    state.index = Math.max(0, Math.min(index, state.slides.length - 1));
    const slide = state.slides[state.index];
    history.replaceState(null, "", slide.sourcePage ? "#page-" + slide.sourcePage : "#" + state.collection + "-topic-" + state.index);
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
    elements.collection.addEventListener("change", function () {
      selectCollection(elements.collection.value);
      history.replaceState(null, "", "#" + state.collection + "-topic-0");
    });
    window.addEventListener("hashchange", showLocation);
    document.addEventListener("keydown", function (event) {
      if (event.defaultPrevented || event.target.closest(".site-header, input, select, textarea, [contenteditable='true']")) return;
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
      state.topics = parseMarkdown(markdown);
      showLocation();
      bindEvents();
    })
    .catch(function (error) {
      elements.slide.innerHTML = "<p class=\"warning\">" + escapeHtml(error.message) + " Serve this folder through a local web server so the Markdown source can be read.</p>";
    });
}());
