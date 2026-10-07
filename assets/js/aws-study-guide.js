/* Interactive Markdown-backed study deck. Keeps docs/aws-data-eng-associate.md as the source of truth. */
(function () {
  "use strict";

  const sourcePath = "/docs/aws-data-eng-associate.md";
  const state = { slides: [], index: 0 };
  const elements = {
    slide: document.getElementById("slide"), previous: document.getElementById("previous"),
    next: document.getElementById("next"), count: document.getElementById("slide-count"),
    section: document.getElementById("section-name"), progress: document.getElementById("progress-bar"),
    overview: document.getElementById("topic-overview"), overviewToggle: document.getElementById("overview-toggle"),
    overviewClose: document.getElementById("overview-close"), topicList: document.getElementById("topic-list")
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

  function renderSlide() {
    const current = state.slides[state.index];
    const isTitle = current.isTitle;
    const section = current.section;
    const titleTag = isTitle ? "h1" : "h2";
    const notes = current.listItems.length ? renderList(current.listItems) : "";
    const code = current.code.map(function (snippet) { return "<pre class=\"code-block\"><code>" + escapeHtml(snippet) + "</code></pre>"; }).join("");
    const empty = !isTitle && !notes && !current.paragraphs.length && !code
      ? "<p class=\"empty-note\">This topic is marked in the source notes but has not been expanded yet. Use it as a prompt for deeper study.</p>" : "";
    const titleStats = isTitle ? "<div class=\"title-stats\"><span>" + current.topicCount + " note topics</span><span>" + current.sectionCount + " study sections</span><span>Keyboard ready</span></div>" : "";

    elements.slide.classList.remove("entering");
    void elements.slide.offsetWidth;
    elements.slide.innerHTML = "<div class=\"" + (isTitle ? "title-slide" : "") + "\">"
      + "<p class=\"slide-index\">" + (isTitle ? "Interactive study deck" : "Topic " + String(state.index).padStart(2, "0")) + "</p>"
      + "<p class=\"slide-section\">" + escapeHtml(section) + "</p>"
      + "<" + titleTag + ">" + (isTitle ? "AWS Data Engineer <span class=\"accent\">Associate</span>" : escapeHtml(current.title)) + "</" + titleTag + ">"
      + "<p class=\"slide-lede\">" + formatText(current.paragraphs[0] || (isTitle ? current.paragraphs[0] : "Key notes from your source document.")) + "</p>"
      + notes
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
    elements.slide.focus({ preventScroll: true });
  }

  function renderOverview() {
    elements.topicList.innerHTML = state.slides.map(function (slide, index) {
      return "<button class=\"topic-button\" type=\"button\" data-slide-index=\"" + index + "\"><small>" + escapeHtml(slide.section) + "</small><span>" + escapeHtml(slide.title) + "</span></button>";
    }).join("");
    elements.topicList.querySelectorAll("[data-slide-index]").forEach(function (button) {
      button.addEventListener("click", function () { goTo(Number(button.dataset.slideIndex)); toggleOverview(false); });
    });
  }

  function updateOverviewSelection() {
    elements.topicList.querySelectorAll("[data-slide-index]").forEach(function (button) {
      button.setAttribute("aria-current", String(Number(button.dataset.slideIndex) === state.index));
    });
  }

  function goTo(index) { state.index = Math.max(0, Math.min(index, state.slides.length - 1)); renderSlide(); }

  function toggleOverview(shouldOpen) {
    elements.overview.hidden = !shouldOpen;
    elements.overviewToggle.setAttribute("aria-expanded", String(shouldOpen));
    if (shouldOpen) elements.overviewClose.focus(); else elements.overviewToggle.focus();
  }

  function trapOverviewFocus(event) {
    if (event.key !== "Tab" || elements.overview.hidden) return;
    const focusable = Array.from(elements.overview.querySelectorAll("button:not([disabled])"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function bindEvents() {
    elements.previous.addEventListener("click", function () { goTo(state.index - 1); });
    elements.next.addEventListener("click", function () { if (state.index < state.slides.length - 1) goTo(state.index + 1); });
    elements.overviewToggle.addEventListener("click", function () { toggleOverview(elements.overview.hidden); });
    elements.overviewClose.addEventListener("click", function () { toggleOverview(false); });
    document.addEventListener("keydown", function (event) {
      trapOverviewFocus(event);
      if (event.key === "Escape" && !elements.overview.hidden) { toggleOverview(false); return; }
      if (event.target.closest("button") && (event.key === "ArrowLeft" || event.key === "ArrowRight")) return;
      if (!elements.overview.hidden) return;
      if (event.key === "ArrowRight") goTo(state.index + 1);
      if (event.key === "ArrowLeft") goTo(state.index - 1);
      if (event.key.toLowerCase() === "o") toggleOverview(true);
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
