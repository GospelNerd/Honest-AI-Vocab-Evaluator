(function () {
  const input = document.getElementById("analyze-input");
  const runBtn = document.getElementById("analyze-run");
  const clearBtn = document.getElementById("analyze-clear");
  const pasteBtn = document.getElementById("analyze-paste");
  const applyAllBtn = document.getElementById("analyze-apply-all");
  const output = document.getElementById("analyze-output");
  const outputWrap = document.getElementById("analyze-output-wrap");
  const summary = document.getElementById("analyze-summary");
  const findings = document.getElementById("analyze-findings");
  const detail = document.getElementById("analyze-detail");
  const marginTitle = document.getElementById("margin-title");
  const stats = document.getElementById("analyze-stats");
  const statTerms = document.getElementById("stat-terms");
  const statWords = document.getElementById("stat-words");
  const statCarefulLabel = document.getElementById("stat-careful-label");
  const statCarefulBar = document.getElementById("stat-careful-bar");
  if (!input || !runBtn || !output || !summary || !findings) return;

  const TERMS = typeof VOCAB_TERMS !== "undefined" ? VOCAB_TERMS : [];

  const CUES = new Set([
    "model", "models", "system", "systems", "ai", "llm", "llms",
    "chatbot", "chatbots", "bot", "bots", "gpt", "chatgpt", "claude",
    "gemini", "grok", "llama", "copilot", "bard", "algorithm", "algorithms",
    "network", "networks", "machine", "machines", "assistant", "assistants",
    "transformer", "it", "its"
  ]);

  const BOUNDARY = /[.!?;]/;

  const FORM_MAP = new Map();
  const TERM_BY_ID = new Map();
  TERMS.forEach((t) => {
    TERM_BY_ID.set(t.id, t);
    if (!t.scan || !Array.isArray(t.forms)) return;
    const neg = new Set((t.negativePrev || []).map((s) => s.toLowerCase()));
    const negNext = new Set((t.negativeNext || []).map((s) => s.toLowerCase()));
    t.forms.forEach((f) => FORM_MAP.set(f.toLowerCase(), { id: t.id, scan: t.scan, neg: neg, negNext: negNext }));
  });

  let lastHits = [];
  let hitNumbers = new Map();
  let selectedHitIndex = -1;
  let ignoredIds = new Set();
  let resolvedIds = new Set();

  function tokenize(text) {
    const tokens = [];
    const re = /[A-Za-z]+/g;
    let m;
    while ((m = re.exec(text))) {
      tokens.push({ lower: m[0].toLowerCase(), start: m.index, end: m.index + m[0].length, raw: m[0] });
    }
    return tokens;
  }

  function cuePrecedes(text, tokens, i) {
    for (let j = i - 1; j >= 0; j--) {
      if (BOUNDARY.test(text.slice(tokens[j].end, tokens[j + 1] ? tokens[j + 1].start : tokens[j].end))) break;
      if (CUES.has(tokens[j].lower)) return true;
    }
    return false;
  }

  function analyze(text) {
    const tokens = tokenize(text);
    const hits = [];
    const counts = new Map();
    for (let i = 0; i < tokens.length; i++) {
      const info = FORM_MAP.get(tokens[i].lower);
      if (!info) continue;
      if (i > 0 && info.neg.has(tokens[i - 1].lower)) continue;
      if (i < tokens.length - 1 && info.negNext.has(tokens[i + 1].lower)) continue;
      if (info.scan === "gated" && !cuePrecedes(text, tokens, i)) continue;
      hits.push({ start: tokens[i].start, end: tokens[i].end, id: info.id, word: text.slice(tokens[i].start, tokens[i].end) });
      counts.set(info.id, (counts.get(info.id) || 0) + 1);
    }
    return { hits: hits, counts: counts };
  }

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function wordCount(text) {
    const t = text.trim();
    if (!t) return 0;
    return t.split(/\s+/).length;
  }

  function hasCleanSwap(t) {
    return t && t.type !== "caution";
  }

  function canAutoSwap(t) {
    return hasCleanSwap(t) && t.autoSwap !== false;
  }

  function swapTextFor(t) {
    return (t && (t.swapText || t.replacement)) || "";
  }

  function assignNumbers(hits) {
    const map = new Map();
    let n = 0;
    const byIndex = [];
    hits.forEach((h, idx) => {
      if (ignoredIds.has(h.id)) {
        byIndex[idx] = null;
        return;
      }
      if (!map.has(h.id)) {
        n += 1;
        map.set(h.id, n);
      }
      byIndex[idx] = map.get(h.id);
    });
    hitNumbers = map;
    return byIndex;
  }

  function renderHighlighted(text, hits, numbers) {
    let html = "";
    let pos = 0;
    hits.forEach((h, i) => {
      html += esc(text.slice(pos, h.start));
      const num = numbers[i];
      if (num == null) {
        html += esc(text.slice(h.start, h.end));
      } else {
        const selected = i === selectedHitIndex ? " selected" : "";
        html += `<mark class="analyze-hit${selected}" data-hit-index="${i}" data-term-id="${esc(h.id)}">${esc(text.slice(h.start, h.end))}<sup>${num}</sup></mark>`;
      }
      pos = h.end;
    });
    html += esc(text.slice(pos));
    return html;
  }

  function uniqueActiveTermIds(hits) {
    const ids = new Set();
    hits.forEach((h) => {
      if (!ignoredIds.has(h.id)) ids.add(h.id);
    });
    return ids;
  }

  function hasSwappable(hits) {
    const ids = uniqueActiveTermIds(hits);
    for (const id of ids) {
      const t = TERM_BY_ID.get(id);
      if (t && canAutoSwap(t) && !resolvedIds.has(id)) return true;
    }
    return false;
  }

  function renderDetail(hit) {
    if (!hit || !detail) {
      if (detail) detail.hidden = true;
      return;
    }
    const t = TERM_BY_ID.get(hit.id);
    if (!t) {
      detail.hidden = true;
      return;
    }
    const num = hitNumbers.get(hit.id);
    const swap = swapTextFor(t);
    const canSwap = canAutoSwap(t);
    const careful = hasCleanSwap(t)
      ? `<p class="analyze-detail-swap-label">use instead</p>
         <div class="analyze-detail-careful">${esc(swap)}</div>
         <div class="analyze-detail-actions">
           ${canSwap ? `<button type="button" class="btn careful" data-action="use" data-term-id="${esc(t.id)}">Use “${esc(swap)}”</button>` : `<p class="analyze-swap-note mono-muted">Usually needs a clause rewrite — not a one-word swap.</p>`}
           <button type="button" class="btn" data-action="ignore" data-term-id="${esc(t.id)}">Ignore</button>
           <button type="button" class="btn" data-action="glossary" data-term-id="${esc(t.id)}">↗</button>
         </div>`
      : `<span class="badge-no-swap">no clean swap</span>
         <div class="analyze-detail-actions">
           <button type="button" class="btn" data-action="ignore" data-term-id="${esc(t.id)}">Ignore</button>
           <button type="button" class="btn" data-action="glossary" data-term-id="${esc(t.id)}">↗</button>
         </div>`;

    detail.innerHTML = `
      <div class="analyze-detail-head">
        <span class="analyze-detail-num">${num}</span>
        <span class="mono-muted">${esc(t.source)}</span>
      </div>
      <div class="analyze-detail-careless">${esc(hit.word)}</div>
      ${careful}
      <p class="analyze-detail-why">${esc(t.problem)}</p>`;
    detail.hidden = false;

    detail.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        const id = btn.dataset.termId;
        if (action === "use") applySwapForTerm(id);
        else if (action === "ignore") ignoreTerm(id);
        else if (action === "glossary" && window.HAVE_NAV) {
          window.HAVE_NAV.navigateTo({ tab: "glossary", term: id }, true);
        }
      });
    });
  }

  function renderFindings(hits) {
    const numbers = assignNumbers(hits);
    const seen = new Map();
    hits.forEach((h, i) => {
      if (ignoredIds.has(h.id)) return;
      if (!seen.has(h.id)) seen.set(h.id, { hit: h, index: i, num: numbers[i] });
    });

    const items = [...seen.values()].sort((a, b) => a.num - b.num);
    marginTitle.textContent = items.length ? `Editor's marks — ${items.length}` : "Editor's marks";

    findings.innerHTML = "";
    items.forEach(({ hit, index, num }) => {
      const t = TERM_BY_ID.get(hit.id);
      if (!t) return;
      const row = document.createElement("div");
      row.className = "analyze-finding" + (index === selectedHitIndex ? " active" : "");
      const swap = hasCleanSwap(t)
        ? `<span class="glossary-row-arrow">→</span>
           <span class="analyze-finding-careful">${esc(swapTextFor(t))}</span>`
        : `<span class="badge-no-swap">no clean swap</span>`;
      row.innerHTML = `
        <span class="analyze-finding-num">${num}</span>
        <div>
          <div class="analyze-finding-words">
            <span class="analyze-finding-careless">${esc(hit.word)}</span>
            ${swap}
          </div>
          <p class="analyze-finding-why">${esc(t.problem)}</p>
        </div>`;
      row.addEventListener("click", () => {
        selectedHitIndex = index;
        renderAll();
      });
      findings.appendChild(row);
    });

    if (selectedHitIndex >= 0 && hits[selectedHitIndex]) {
      renderDetail(hits[selectedHitIndex]);
    } else if (items.length) {
      selectedHitIndex = items[0].index;
      renderDetail(hits[selectedHitIndex]);
    } else {
      renderDetail(null);
    }
  }

  function renderAll() {
    const text = input.value;
    const numbers = assignNumbers(lastHits);
    if (lastHits.length) {
      output.innerHTML = renderHighlighted(text, lastHits, numbers);
      outputWrap.hidden = false;
      input.hidden = true;
    } else {
      outputWrap.hidden = true;
      output.innerHTML = "";
      input.hidden = false;
    }
    renderFindings(lastHits);
    updateStats(lastHits);
  }

  function updateStats(hits) {
    const activeIds = uniqueActiveTermIds(hits);
    const loaded = activeIds.size;
    const remaining = [...activeIds].filter((id) => !resolvedIds.has(id)).length;
    const words = wordCount(input.value);

    if (hits.length === 0) {
      stats.hidden = true;
      applyAllBtn.disabled = true;
      return;
    }

    stats.hidden = false;
    statTerms.textContent = String(loaded);
    statWords.textContent = String(words);

    const addressed = loaded - remaining;
    statCarefulLabel.textContent = remaining === 0
      ? "All loaded terms addressed"
      : `${remaining} of ${loaded} still carry unearned meaning`;

    statCarefulBar.innerHTML = `
      <span class="analyze-meter-careful" style="flex:${Math.max(addressed, 0.001)}"></span>
      <span class="analyze-meter-ox" style="flex:${Math.max(remaining, 0.001)}"></span>`;

    applyAllBtn.disabled = !hasSwappable(hits);
  }

  function replaceWordAt(text, start, end, replacement) {
    return text.slice(0, start) + replacement + text.slice(end);
  }

  function applySwapForTerm(termId) {
    const t = TERM_BY_ID.get(termId);
    if (!t || !canAutoSwap(t)) return;
    let text = input.value;
    let delta = 0;
    const hits = analyze(text).hits;
    hits.forEach((h) => {
      if (h.id !== termId || ignoredIds.has(h.id)) return;
      const start = h.start + delta;
      const end = h.end + delta;
      const rep = swapTextFor(t);
      text = replaceWordAt(text, start, end, rep);
      delta += rep.length - (end - start);
    });
    input.value = text;
    resolvedIds.add(termId);
    selectedHitIndex = -1;
    run();
  }

  function ignoreTerm(termId) {
    ignoredIds.add(termId);
    selectedHitIndex = -1;
    run();
  }

  function applyAllSwaps() {
    let text = input.value;
    const ids = [...uniqueActiveTermIds(analyze(text).hits)].filter((id) => {
      const t = TERM_BY_ID.get(id);
      return t && canAutoSwap(t) && !resolvedIds.has(id);
    });
    ids.forEach((id) => {
      const t = TERM_BY_ID.get(id);
      let delta = 0;
      const hits = analyze(text).hits;
      hits.forEach((h) => {
        if (h.id !== id) return;
        const start = h.start + delta;
        const end = h.end + delta;
        const rep = swapTextFor(t);
        text = replaceWordAt(text, start, end, rep);
        delta += rep.length - (end - start);
      });
      resolvedIds.add(id);
    });
    input.value = text;
    selectedHitIndex = -1;
    run();
  }

  function run() {
    const text = input.value;
    if (!text.trim()) {
      summary.textContent = "Paste some text to analyze.";
      outputWrap.hidden = true;
      output.innerHTML = "";
      findings.innerHTML = "";
      if (detail) detail.hidden = true;
      stats.hidden = true;
      lastHits = [];
      input.hidden = false;
      applyAllBtn.disabled = true;
      marginTitle.textContent = "Editor's marks";
      return;
    }

    const result = analyze(text);
    lastHits = result.hits;

    renderAll();

    const total = lastHits.filter((h) => !ignoredIds.has(h.id)).length;
    const nTerms = uniqueActiveTermIds(lastHits).size;
    if (total === 0) {
      summary.textContent = "No glossary terms flagged. That does not mean the text is clean, only that none of these terms showed up where they usually mislead.";
    } else {
      summary.textContent = `${total} ${total === 1 ? "word" : "words"} worth a second look, across ${nTerms} ${nTerms === 1 ? "term" : "terms"}. Surfaced for review, not flagged as errors.`;
    }
  }

  function clearAll() {
    input.value = "";
    ignoredIds = new Set();
    resolvedIds = new Set();
    selectedHitIndex = -1;
    lastHits = [];
    outputWrap.hidden = true;
    output.innerHTML = "";
    findings.innerHTML = "";
    if (detail) detail.hidden = true;
    summary.textContent = "";
    stats.hidden = true;
    input.hidden = false;
    applyAllBtn.disabled = true;
    marginTitle.textContent = "Editor's marks";
    input.focus();
  }

  output.addEventListener("click", (e) => {
    const mark = e.target.closest(".analyze-hit");
    if (!mark) return;
    selectedHitIndex = Number(mark.dataset.hitIndex);
    renderAll();
    const row = findings.querySelector(".analyze-finding.active");
    if (row) row.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  runBtn.addEventListener("click", run);
  if (clearBtn) clearBtn.addEventListener("click", clearAll);
  if (applyAllBtn) applyAllBtn.addEventListener("click", applyAllSwaps);
  if (pasteBtn) {
    pasteBtn.addEventListener("click", async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          input.value = text;
          if (window.HAVE_NAV) window.HAVE_NAV.setActiveTab("analyze");
          input.focus();
        }
      } catch (err) {
        input.focus();
      }
    });
  }

  input.addEventListener("input", () => {
    if (!input.hidden) {
      ignoredIds = new Set();
      resolvedIds = new Set();
      selectedHitIndex = -1;
    }
  });
})();
