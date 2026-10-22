/* Interactive Markdown-backed personal study deck. */
(function () {
  "use strict";

  const sourcePath = "/docs/aws-data-eng-associate.md";
  const state = { slides: [], index: 0, expandedSections: new Set(), diagramVersion: 0, diagramId: 0 };
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
    let detailOwner = null;
    let currentSection = "Study guide";
    let inDetailedNotes = false;
    let table = null;
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeLines = [];
    let paragraphLines = [];
    let lastVisual = null;

    function contentTarget() { return inDetailedNotes ? detailOwner.detailedNotes : current; }

    function flushParagraph() {
      const target = current && contentTarget();
      if (target && paragraphLines.length) {
        const text = paragraphLines.join(" ");
        target.paragraphs.push(text);
        target.blocks.push({ type: text.startsWith("**Current reference") ? "reference" : "paragraph", text: text });
      }
      paragraphLines = [];
    }

    markdown.replace(/\r/g, "").split("\n").forEach(function (line) {
      if (line.trim().startsWith("```")) {
        flushParagraph();
        if (!inCodeBlock) {
          table = null;
          lastVisual = null;
          inCodeBlock = true;
          codeLanguage = line.trim().slice(3).trim().toLowerCase();
        } else {
          inCodeBlock = false;
          if (current && codeLines.length) {
            const target = contentTarget();
            if (codeLanguage === "mermaid") {
              lastVisual = { type: "mermaid", source: codeLines.join("\n"), caption: "" };
              target.visuals.push(lastVisual);
              target.blocks.push({ type: "visual", visual: lastVisual });
            } else {
              const code = codeLines.join("\n");
              target.code.push(code);
              target.blocks.push({ type: "code", code: code });
            }
          }
          codeLanguage = "";
          codeLines = [];
        }
        return;
      }
      if (inCodeBlock) { codeLines.push(line); return; }

      const heading = line.match(/^ {0,3}(#{1,4})(?:[ \t]+(.*))?$/);
      if (heading) {
        flushParagraph();
        const rawTitle = (heading[2] || "").trim();
        const title = cleanTitle(rawTitle) || "Unexpanded topic";
        if (current && title.toLowerCase() === "detailed notes" && heading[1].length > current.level) {
          if (!current.detailedNotes) current.detailedNotes = { title: current.title, blocks: [], listItems: [], paragraphs: [], code: [], tables: [], visuals: [] };
          detailOwner = current;
          inDetailedNotes = true;
          table = null;
          lastVisual = null;
          return;
        }
        detailOwner = null;
        inDetailedNotes = false;
        const isSection = /^Section\s+/i.test(rawTitle);
        if (isSection) currentSection = title;
        current = { level: heading[1].length, title: title, section: currentSection, isSection: isSection, unexpanded: !rawTitle, blocks: [], listItems: [], paragraphs: [], code: [], tables: [], visuals: [] };
        table = null;
        lastVisual = null;
        slides.push(current);
        return;
      }
      if (!current) return;
      if (!line.trim()) { flushParagraph(); table = null; return; }
      const caption = line.match(/^>\s?(.*)$/);
      if (caption) {
        if (lastVisual) lastVisual.caption += (lastVisual.caption ? " " : "") + caption[1];
        else {
          flushParagraph();
          const target = contentTarget();
          target.paragraphs.push(caption[1]);
          target.blocks.push({ type: "paragraph", text: caption[1] });
        }
        table = null;
        return;
      }
      lastVisual = null;
      const image = line.trim().match(/^!\[([^\]]*)\]\((https:\/\/[^\s)]+|\/(?!\/)[^\s)]+)\)$/);
      if (image) {
        flushParagraph();
        table = null;
        lastVisual = { type: "image", src: image[2], alt: image[1], caption: "" };
        const target = contentTarget();
        target.visuals.push(lastVisual);
        target.blocks.push({ type: "visual", visual: lastVisual });
        return;
      }
      const displayTitle = line.match(/^<!-- title: (.+) -->$/);
      if (displayTitle) { current.title = displayTitle[1]; return; }
      const originalNote = line.match(/^<!-- original-note: (\d+) -->$/);
      if (originalNote) { current.originalNote = Number(originalNote[1]); return; }
      if (line === "<!-- section -->") { current.isSection = true; currentSection = current.title; current.section = currentSection; return; }
      if (line === "<!-- unexpanded -->") { current.unexpanded = true; return; }
      const target = contentTarget();
      if (/^\|.*\|$/.test(line.trim())) {
        flushParagraph();
        const cells = line.trim().slice(1, -1).split("|").map(function (cell) { return cell.trim(); });
        if (cells.every(function (cell) { return /^:?-{3,}:?$/.test(cell); })) return;
        if (!table) { table = []; target.tables.push(table); target.blocks.push({ type: "table", rows: table }); }
        table.push(cells);
        return;
      }

      table = null;
      const listItem = line.match(/^(\s*)(?:([-*])|(\d+)\.)\s+(.+)$/);
      if (listItem) {
        flushParagraph();
        const item = { indent: listItem[1].replace(/\t/g, "  ").length, ordered: Boolean(listItem[3]), text: listItem[4].trim() };
        target.listItems.push(item);
        const lastBlock = target.blocks[target.blocks.length - 1];
        if (lastBlock && lastBlock.type === "list") lastBlock.items.push(item);
        else target.blocks.push({ type: "list", items: [item] });
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
    return (slide.visuals || []).map(function (visual) {
      const caption = escapeHtml(visual.caption || visual.alt || slide.title + " diagram");
      if (visual.type === "image") {
        return '<figure class="slide-visual"><img src="' + escapeHtml(visual.src) + '" alt="' + escapeHtml(visual.alt) + '" width="1200" height="675" loading="lazy"><figcaption>' + caption + '</figcaption></figure>';
      }
      const label = /architecture-beta/.test(visual.source) ? "Architecture" : "Flow";
      return '<figure class="slide-visual"><div class="visual-toolbar"><p class="visual-label">' + label + ' diagram</p><div class="diagram-controls"><button class="diagram-button" type="button" data-diagram-zoom="out" aria-label="Zoom diagram out" disabled>&minus;</button><button class="diagram-button" type="button" data-diagram-fit disabled>Fit diagram</button><button class="diagram-button" type="button" data-diagram-zoom="in" aria-label="Zoom diagram in" disabled>+</button></div></div><div class="study-diagram" tabindex="0" role="region" aria-label="' + escapeHtml(slide.title + ' diagram') + '" aria-busy="true"><pre data-study-mermaid hidden>' + escapeHtml(visual.source) + '</pre><p class="diagram-status" role="status">Loading diagram…</p></div><figcaption>' + caption + '</figcaption></figure>';
    }).join("");
  }

  function renderTables(tables) {
    return tables.map(function (rows) {
      function cells(row, tag) { return row.map(function (cell) { return "<" + tag + ">" + formatText(cell) + "</" + tag + ">"; }).join(""); }
      return '<div class="study-table" role="region" aria-label="Study comparison" tabindex="0"><table><thead><tr>' + cells(rows[0], "th")
        + "</tr></thead><tbody>" + rows.slice(1).map(function (row) { return "<tr>" + cells(row, "td") + "</tr>"; }).join("") + "</tbody></table></div>";
    }).join("");
  }

  function renderCode(snippets) {
    return snippets.map(function (snippet) { return "<pre class=\"code-block\"><code>" + escapeHtml(snippet) + "</code></pre>"; }).join("");
  }

  function renderContent(blocks, title) {
    let paragraphCount = 0;
    return blocks.map(function (block) {
      if (block.type === "paragraph") {
        const className = paragraphCount++ === 0 ? "slide-lede" : "detail-note";
        return '<p class="' + className + '">' + formatText(block.text) + '</p>';
      }
      if (block.type === "reference") return '<p class="source-reference">' + formatText(block.text) + '</p>';
      if (block.type === "list") return renderList(block.items);
      if (block.type === "table") return renderTables([block.rows]);
      if (block.type === "code") return renderCode([block.code]);
      if (block.type === "visual") return renderVisual({ title: title, visuals: [block.visual] });
      return "";
    }).join("");
  }

  async function initializeDiagrams() {
    const version = ++state.diagramVersion;
    const sources = elements.slide.querySelectorAll("[data-study-mermaid]");
    for (const source of sources) {
      const host = source.parentElement;
      const figure = host.closest("figure");
      const status = host.querySelector(".diagram-status");
      if (!window.mermaid) {
        if (window.studyMermaidError) {
          status.textContent = "Diagram library could not be loaded. Reload the page to try again.";
          host.setAttribute("aria-busy", "false");
        }
        continue;
      }
      try {
        const result = await window.mermaid.render("study-mermaid-" + state.diagramId++, source.textContent);
        if (version !== state.diagramVersion || !host.isConnected) return;
        host.innerHTML = result.svg;
        host.setAttribute("aria-busy", "false");
        const svg = host.querySelector("svg");
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", host.getAttribute("aria-label") + ". " + figure.querySelector("figcaption").textContent);
        const bounds = svg.viewBox.baseVal;
        host.style.height = Math.min(480, Math.max(180, bounds.height)) + "px";
        const fitScale = function () { return Math.min((host.clientWidth || 600) / bounds.width, (host.clientHeight || 400) / bounds.height, 1); };
        let scale;
        function zoom(value) {
          scale = Math.min(4, Math.max(Math.min(.2, fitScale()), value));
          svg.style.maxWidth = "none";
          svg.style.width = bounds.width * scale + "px";
          svg.style.height = bounds.height * scale + "px";
        }
        // Keep labels readable; large diagrams can scroll inside their focused region.
        zoom(Math.max(fitScale(), .75));
        figure.querySelectorAll(".diagram-controls button").forEach(function (button) {
          button.disabled = false;
          button.addEventListener("click", function () {
            zoom(button.hasAttribute("data-diagram-fit") ? fitScale() : scale * (button.dataset.diagramZoom === "in" ? 1.2 : 1 / 1.2));
          });
        });
        if (result.bindFunctions) result.bindFunctions(host);
      } catch (error) {
        if (version !== state.diagramVersion || !host.isConnected) return;
        host.textContent = "Diagram could not be rendered.";
        host.setAttribute("aria-busy", "false");
        console.warn("Study diagram rendering failed:", error);
      }
    }
  }

  function renderSlide(shouldFocus) {
    const current = state.slides[state.index];
    const section = current.section;
    const content = renderContent(current.blocks, current.title);
    const detailed = current.detailedNotes;
    const detailContent = detailed ? renderContent(detailed.blocks, current.title) : "";
    const details = detailContent ? '<details class="notes-details"><summary>Detailed notes</summary>' + detailContent + '</details>' : '';
    const empty = current.unexpanded || !content && !detailContent
      ? "<p class=\"empty-note\">This topic is marked in the source notes but has not been expanded yet. Use it as a prompt for deeper study.</p>" : "";

    elements.slide.classList.remove("entering");
    void elements.slide.offsetWidth;
    elements.slide.innerHTML = "<div>"
      + "<p class=\"slide-index\">" + "Study notes" + "</p>"
      + "<p class=\"slide-section\">" + escapeHtml(section) + "</p>"
      + "<h2>" + escapeHtml(current.title) + "</h2>"
      + content + details + empty + "</div>";
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
    initializeDiagrams();
    elements.slide.scrollTop = 0;
    if (window.matchMedia("(max-width: 860px)").matches) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (shouldFocus !== false) elements.slide.focus({ preventScroll: true });
  }

  window.addEventListener("study-mermaid-ready", function () {
    initializeDiagrams();
  });

  window.addEventListener("study-mermaid-error", initializeDiagrams);

  function groupTopics(slides) {
    const groups = new Map();
    slides.forEach(function (slide, index) {
      if (!groups.has(slide.section)) groups.set(slide.section, { section: slide.section, topics: [] });
      groups.get(slide.section).topics.push({ slide: slide, index: index });
    });
    return Array.from(groups.values());
  }

  function matchesTopic(slide, query) {
    return (slide.title + " " + slide.section).toLowerCase().includes(query.toLowerCase());
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
    elements.results.textContent = count ? count + " topics in " + sections + " sections" : "No matching topics. Try another service or topic.";
  }

  function showLocation(shouldFocus) {
    const topic = location.hash.match(/^#(?:course-)?topic-(\d+)$/);
    const original = location.hash.match(/^#note-(\d+)$/);
    const target = original ? state.slides.findIndex(function (slide) { return slide.originalNote === Number(original[1]); })
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
    history.replaceState(null, "", slide.originalNote !== undefined ? "#note-" + slide.originalNote : "#topic-" + state.index);
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
      if (event.target.closest("button, summary, .study-diagram, .study-table") && (event.key === "ArrowLeft" || event.key === "ArrowRight")) return;
      if (event.key === "ArrowRight") goTo(state.index + 1);
      if (event.key === "ArrowLeft") goTo(state.index - 1);
      if (event.key.toLowerCase() === "o") toggleOverview(elements.workspace.classList.contains("sidebar-hidden"));
    });
  }

  fetch(sourcePath, { cache: "no-store" })
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
