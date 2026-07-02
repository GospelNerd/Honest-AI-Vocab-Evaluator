(function () {
  const TAB_IDS = ["glossary", "casestudy", "etymology", "analyze"];
  const LEGACY_TAB_MAP = { rewrite: "casestudy" };

  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  // --- Shared helpers ---
  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function hasCleanSwap(t) {
    return t.type !== "caution";
  }

  function sourceShort(src) {
    if (src === "Illingworth & Wicker") return "I&W";
    if (src === "Logos Analog") return "LA";
    return src;
  }

  function termByForm(word) {
    const q = word.toLowerCase();
    return VOCAB_TERMS.find((t) => {
      if (t.id === q || t.misleading.toLowerCase() === q) return true;
      return (t.forms || []).some((f) => f.toLowerCase() === q);
    });
  }

  function etymologyLookupSlug(term) {
    return term.id;
  }

  // --- Navigation ---
  function setActiveTab(panelId) {
    const mapped = LEGACY_TAB_MAP[panelId] || panelId;
    const target = TAB_IDS.includes(mapped) ? mapped : "glossary";
    tabs.forEach((t) => {
      const active = t.dataset.panel === target;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((p) => {
      const active = p.id === `panel-${target}`;
      p.classList.toggle("active", active);
      p.hidden = !active;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      navigateTo({ tab: tab.dataset.panel }, true);
    });
  });

  function stateToHash(state) {
    const tab = state && state.tab ? state.tab : "glossary";
    if (tab === "etymology" && state && state.word) {
      return `#etymology/${encodeURIComponent(state.word)}`;
    }
    if (tab === "glossary" && state && state.term) {
      return `#glossary/${encodeURIComponent(state.term)}`;
    }
    return `#${tab}`;
  }

  function hashToState() {
    const raw = location.hash.replace(/^#/, "");
    if (!raw) return { tab: "glossary" };
    const parts = raw.split("/");
    let tab = LEGACY_TAB_MAP[parts[0]] || parts[0];
    if (!TAB_IDS.includes(tab)) return { tab: "glossary" };
    if (tab === "etymology" && parts.length > 1) {
      return { tab: "etymology", word: decodeURIComponent(parts.slice(1).join("/")) };
    }
    if (tab === "glossary" && parts.length > 1) {
      return { tab: "glossary", term: decodeURIComponent(parts.slice(1).join("/")) };
    }
    return { tab: tab };
  }

  function applyState(state) {
    const tab = state && state.tab ? state.tab : "glossary";
    setActiveTab(tab);
    if (tab === "etymology" && state && state.word) {
      etymologyWord.value = state.word;
      analyzeEtymology({ navigate: false });
    }
    if (tab === "glossary" && state && state.term) {
      const idx = VOCAB_TERMS.findIndex((t) => t.id === state.term);
      if (idx >= 0) {
        specimenIndex = idx;
        renderSpecimen();
      }
    }
  }

  function navigateTo(state, push) {
    const hash = stateToHash(state);
    if (push) history.pushState(state, "", hash);
    else history.replaceState(state, "", hash);
    applyState(state);
  }

  window.addEventListener("popstate", (e) => {
    applyState(e.state || hashToState());
  });

  window.HAVE_NAV = { navigateTo: navigateTo, setActiveTab: setActiveTab };

  // --- Glossary ---
  const glossaryList = document.getElementById("glossary-list");
  const searchInput = document.getElementById("glossary-search");
  const filterContainer = document.getElementById("source-filters");
  const specimenHero = document.getElementById("specimen-hero");
  const specimenLabel = document.getElementById("specimen-label");
  const glossaryCount = document.getElementById("glossary-count");

  const sources = [...new Set(VOCAB_TERMS.map((t) => t.source))];
  let activeSource = "all";
  let activeFilter = "all";
  let specimenIndex = 0;
  let filteredTerms = [...VOCAB_TERMS];

  function matchScore(t, q) {
    const m = t.misleading.toLowerCase();
    const r = (t.replacement || "").toLowerCase();
    const alts = (t.replacementAlternatives || []).join(" ").toLowerCase();
    const body = [t.problem, t.better].filter(Boolean).join(" ").toLowerCase();
    if (m === q) return 100;
    if (m.startsWith(q)) return 80;
    if (m.includes(q)) return 60;
    if (r === q) return 50;
    if (r.includes(q)) return 40;
    if (alts.includes(q)) return 30;
    if (body.includes(q)) return 10;
    return 0;
  }

  function applyGlossaryFilters() {
    const q = searchInput.value.trim().toLowerCase();
    filteredTerms = VOCAB_TERMS.filter((t) => {
      if (activeSource !== "all" && t.source !== activeSource) return false;
      if (activeFilter === "swap" && !hasCleanSwap(t)) return false;
      if (activeFilter === "noswap" && hasCleanSwap(t)) return false;
      return true;
    });
    if (q) {
      filteredTerms = filteredTerms
        .map((t) => ({ t: t, s: matchScore(t, q) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.t);
    }
    glossaryCount.textContent = `${filteredTerms.length} term${filteredTerms.length === 1 ? "" : "s"}`;
  }

  function renderSpecimen() {
    const t = VOCAB_TERMS[specimenIndex];
    if (!t || !specimenHero) return;
    const num = String(specimenIndex + 1).padStart(2, "0");
    const total = String(VOCAB_TERMS.length).padStart(2, "0");
    specimenLabel.textContent = `Specimen — entry ${num} / ${total}`;

    const careless = esc(capitalize(t.misleading));
    const carefulBlock = hasCleanSwap(t)
      ? `<p class="mono-eyebrow specimen-swap-label">use instead</p>
         <div class="specimen-careful">${esc(capitalize(t.replacement))}</div>`
      : `<span class="specimen-flag">${esc(t.flag || "no clean swap")}</span>`;

    specimenHero.innerHTML = `
      <p class="mono-eyebrow specimen-category">${esc(t.source)}</p>
      <div class="specimen-careless">${careless}</div>
      ${carefulBlock}
      <p class="specimen-why">${esc(t.problem)}</p>
      <div class="specimen-examples">
        <div class="specimen-example bad">
          <div class="specimen-example-label">careless</div>
          <div class="specimen-example-text">${esc(t.exampleBad)}</div>
        </div>
        <div class="specimen-example good">
          <div class="specimen-example-label">careful</div>
          <div class="specimen-example-text">${esc(t.exampleGood)}</div>
        </div>
      </div>
      <p style="margin-top:1.25rem">
        <button type="button" class="link-btn" data-etymology-word="${esc(etymologyLookupSlug(t))}">Etymology ↗</button>
      </p>`;

    const link = specimenHero.querySelector("[data-etymology-word]");
    if (link) {
      link.addEventListener("click", () => openEtymology(etymologyLookupSlug(t)));
    }
  }

  function capitalize(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function renderGlossaryList() {
    applyGlossaryFilters();
    glossaryList.innerHTML = "";
    if (!filteredTerms.length) {
      glossaryList.innerHTML = '<p class="empty-state">No terms match your search.</p>';
      return;
    }

    filteredTerms.forEach((t) => {
      const globalIdx = VOCAB_TERMS.indexOf(t);
      const num = String(globalIdx + 1).padStart(2, "0");
      const row = document.createElement("div");
      row.className = "glossary-row";
      row.tabIndex = 0;
      const swapHtml = hasCleanSwap(t)
        ? `<span class="glossary-row-arrow">→</span>
           <span class="glossary-row-careful">${esc(capitalize(t.replacement))}</span>`
        : `<span class="badge-no-swap">no clean swap</span>`;
      row.innerHTML = `
        <span class="glossary-row-num">${num}</span>
        <div class="glossary-row-words">
          <span class="glossary-row-careless">${esc(capitalize(t.misleading))}</span>
          ${swapHtml}
        </div>
        <span class="glossary-row-why">${esc(t.problem)}</span>
        <span class="glossary-row-source">${esc(sourceShort(t.source))}</span>`;
      row.addEventListener("click", () => {
        specimenIndex = globalIdx;
        renderSpecimen();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          row.click();
        }
      });
      glossaryList.appendChild(row);
    });
  }

  function setFilterActive(value) {
    activeFilter = value;
    if (value === "all" || value === "swap" || value === "noswap") activeSource = "all";
    else if (value.startsWith("src:")) activeSource = value.slice(4);
    filterContainer.querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.filter === value);
    });
    renderGlossaryList();
  }

  function makeFilterBtn(value, label) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn";
    btn.textContent = label;
    btn.dataset.filter = value;
    btn.addEventListener("click", () => setFilterActive(value));
    return btn;
  }

  function renderFilters() {
    filterContainer.innerHTML = "";
    const allBtn = makeFilterBtn("all", `All ${VOCAB_TERMS.length}`);
    allBtn.classList.add("active");
    filterContainer.appendChild(allBtn);
    filterContainer.appendChild(makeFilterBtn("swap", "Has clean swap"));
    filterContainer.appendChild(makeFilterBtn("noswap", "No clean swap"));
    sources.forEach((src) => filterContainer.appendChild(makeFilterBtn(`src:${src}`, src)));
  }

  document.getElementById("specimen-prev").addEventListener("click", () => {
    specimenIndex = (specimenIndex - 1 + VOCAB_TERMS.length) % VOCAB_TERMS.length;
    renderSpecimen();
  });
  document.getElementById("specimen-next").addEventListener("click", () => {
    specimenIndex = (specimenIndex + 1) % VOCAB_TERMS.length;
    renderSpecimen();
  });
  document.getElementById("specimen-shuffle").addEventListener("click", () => {
    specimenIndex = Math.floor(Math.random() * VOCAB_TERMS.length);
    renderSpecimen();
  });

  searchInput.addEventListener("input", renderGlossaryList);
  renderFilters();
  renderSpecimen();
  renderGlossaryList();

  // --- Case Study ---
  const caseBefore = document.getElementById("case-before-text");
  const caseAfter = document.getElementById("case-after-text");
  const caseMoves = document.getElementById("case-moves");
  const caseLabel = document.getElementById("case-label");
  const caseIndexEl = document.getElementById("case-index");
  const caseMoreCount = document.getElementById("case-more-count");

  let caseIndex = 0;

  function parseFlags(text) {
    const flags = [];
    const re = /\[\[(.+?)\]\]/g;
    let m;
    while ((m = re.exec(text))) flags.push(m[1]);
    return flags;
  }

  function highlightCaseFlags(text, className) {
    return esc(text).replace(/\[\[(.+?)\]\]/g, `<mark class="${className}">$1</mark>`);
  }

  function buildMoves(before) {
    const flags = parseFlags(before);
    const seen = new Set();
    const moves = [];
    flags.forEach((flag) => {
      const key = flag.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      const term = termByForm(flag);
      moves.push({
        from: flag,
        to: term && hasCleanSwap(term) ? term.replacement : "—",
        why: term ? term.problem : "Flagged in this exercise."
      });
    });
    return moves;
  }

  function caseTeaser(before) {
    const plain = before.replace(/\[\[(.+?)\]\]/g, "$1");
    return plain.length > 72 ? plain.slice(0, 69) + "…" : plain;
  }

  function renderCaseStudy() {
    const ex = REWRITE_EXERCISES[caseIndex];
    if (!ex) return;
    const num = String(caseIndex + 1).padStart(2, "0");
    const total = String(REWRITE_EXERCISES.length).padStart(2, "0");
    const moves = buildMoves(ex.before);
    caseLabel.textContent = `Case ${num} / ${total} · ${moves.length} careful move${moves.length === 1 ? "" : "s"}`;
    caseBefore.innerHTML = highlightCaseFlags(ex.before, "case-mark-ox");
    caseAfter.textContent = ex.after;

    caseMoves.innerHTML = "";
    moves.forEach((m, i) => {
      const row = document.createElement("div");
      row.className = "case-move";
      row.innerHTML = `
        <span class="case-move-num">${i + 1}</span>
        <div class="case-move-words">
          <span class="case-move-from">${esc(m.from)}</span>
          <span class="glossary-row-arrow">→</span>
          <span class="case-move-to">${esc(m.to)}</span>
        </div>
        <span class="case-move-why">${esc(m.why)}</span>`;
      caseMoves.appendChild(row);
    });

    caseMoreCount.textContent = `${REWRITE_EXERCISES.length - 1} more`;
    caseIndexEl.innerHTML = "";
    REWRITE_EXERCISES.forEach((item, i) => {
      if (i === caseIndex) return;
      const row = document.createElement("div");
      row.className = "case-index-row";
      row.innerHTML = `
        <span class="case-index-num">${String(i + 1).padStart(2, "0")}</span>
        <span class="case-index-title">Case ${i + 1}</span>
        <span class="case-index-teaser">${esc(caseTeaser(item.before))}</span>
        <span class="mono-muted">${buildMoves(item.before).length} moves</span>`;
      row.addEventListener("click", () => {
        caseIndex = i;
        renderCaseStudy();
        document.getElementById("panel-casestudy").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      caseIndexEl.appendChild(row);
    });
  }

  document.getElementById("case-prev").addEventListener("click", () => {
    caseIndex = (caseIndex - 1 + REWRITE_EXERCISES.length) % REWRITE_EXERCISES.length;
    renderCaseStudy();
  });
  document.getElementById("case-next").addEventListener("click", () => {
    caseIndex = (caseIndex + 1) % REWRITE_EXERCISES.length;
    renderCaseStudy();
  });
  renderCaseStudy();

  // --- Etymology ---
  const ETYMOLOGY_SUGGESTIONS = ["intelligence", "agent", "artificial", "consciousness", "hallucination"];
  const ETYMOLOGY_SESSION_PREFIX = "etymology:v1:";
  const etymologyWord = document.getElementById("etymology-word");
  const etymologyFeedback = document.getElementById("etymology-feedback");
  const etymologyFeatured = document.getElementById("etymology-featured");
  const etymologySuggestions = document.getElementById("etymology-suggestions");
  const etymologyAnalyzeBtn = document.getElementById("etymology-analyze");
  const etymologyIndexList = document.getElementById("etymology-index-list");
  const etymologyIndexCount = document.getElementById("etymology-index-count");
  let etymologyBusy = false;

  function renderEtymologyIndex() {
    etymologyIndexCount.textContent = `${VOCAB_TERMS.length} terms`;
    etymologyIndexList.innerHTML = "";
    VOCAB_TERMS.forEach((t) => {
      const row = document.createElement("div");
      row.className = "etymology-index-row";
      row.innerHTML = `
        <span class="etymology-index-word">${esc(capitalize(t.misleading))}</span>
        <span class="etymology-index-root">${esc(t.source)}</span>
        <span class="etymology-index-import">${esc(t.problem)}</span>`;
      row.addEventListener("click", () => openEtymology(etymologyLookupSlug(t)));
      etymologyIndexList.appendChild(row);
    });
  }

  function renderEtymologySuggestions() {
    etymologySuggestions.innerHTML = "";
    ETYMOLOGY_SUGGESTIONS.forEach((word) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "suggestion-btn";
      btn.textContent = word;
      btn.addEventListener("click", () => {
        etymologyWord.value = word;
        analyzeEtymology();
      });
      etymologySuggestions.appendChild(btn);
    });
  }

  function etymologySessionKey(word) {
    return `${ETYMOLOGY_SESSION_PREFIX}${word.toLowerCase()}`;
  }

  function readEtymologySession(word) {
    try {
      const raw = sessionStorage.getItem(etymologySessionKey(word));
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function writeEtymologySession(word, payload) {
    try {
      sessionStorage.setItem(etymologySessionKey(word), JSON.stringify(payload));
    } catch (err) {
      // Session storage may be full or unavailable.
    }
  }

  function firstEtymologyLine(data) {
    for (const entry of data.entries || []) {
      if (entry.etymologies && entry.etymologies.length) return entry.etymologies[0];
    }
    return null;
  }

  function lexicalLabel(data) {
    for (const entry of data.entries || []) {
      if (entry.lexicalCategory) return entry.lexicalCategory;
    }
    return null;
  }

  function etymologyReplacementLookup(term) {
    if (!term || !hasCleanSwap(term)) return null;
    const candidate = (term.replacement || "").trim().split(/\s+/)[0].replace(/\?+$/, "");
    if (!candidate || !/^[a-zA-Z][a-zA-Z0-9'-]*$/.test(candidate)) return null;
    return candidate.toLowerCase();
  }

  async function fetchEtymologyData(word) {
    const normalized = word.toLowerCase();
    const sessionHit = readEtymologySession(normalized);
    if (sessionHit) return sessionHit;
    const res = await fetch(`api/etymology.php?word=${encodeURIComponent(word)}`);
    const data = await res.json();
    writeEtymologySession(normalized, data);
    return data;
  }

  function buildWiktHtml(data) {
    let wiktHtml = "";
    (data.entries || []).forEach((entry) => {
      wiktHtml += `<div class="etymology-wikt-block">`;
      if (entry.lexicalCategory) {
        wiktHtml += `<p class="mono-eyebrow">${esc(entry.lexicalCategory)}</p>`;
      }
      if (entry.etymologies.length) {
        wiktHtml += `<ul class="etymology-list">${entry.etymologies.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>`;
      }
      if (entry.definitions.length) {
        wiktHtml += `<p class="mono-eyebrow" style="margin-top:0.75rem">Definitions</p>
          <ol class="definition-list">${entry.definitions.map((d) => `<li>${esc(d)}</li>`).join("")}</ol>`;
      }
      wiktHtml += `</div>`;
    });
    return wiktHtml;
  }

  function renderCarefulBlock(glossaryTerm, replacementData) {
    if (!glossaryTerm || !hasCleanSwap(glossaryTerm)) return "";

    const replacementRoot = replacementData && replacementData.entries && replacementData.entries.length
      ? firstEtymologyLine(replacementData)
      : null;
    const explanation = glossaryTerm.better || "";

    let detailHtml = "";
    if (replacementRoot) {
      detailHtml += `<div class="etymology-card-block etymology-careful-detail">
           <div class="etymology-card-label">Root</div>
           <p class="etymology-card-text">${esc(replacementRoot)}</p>
         </div>`;
    }
    if (explanation) {
      detailHtml += `<p class="etymology-careful-text">${esc(explanation)}</p>`;
    }

    return `<div class="etymology-careful-block">
         <div class="etymology-careful-link">
           <span class="mono-muted">careful term →</span>
           <a href="#glossary/${encodeURIComponent(glossaryTerm.id)}">${esc(capitalize(glossaryTerm.replacement))}</a>
         </div>
         ${detailHtml}
       </div>`;
  }

  function renderShiftTimeline(term) {
    if (!term || !term.useShift || !term.useShift.length) {
      return `<p class="etymology-shift-placeholder">“How its use shifted” timelines are being researched term by term. For now, the root and import notes above are what we can support with confidence.</p>`;
    }
    return term.useShift.map((e, i, arr) => `
      <div class="etymology-timeline-item">
        <div class="etymology-timeline-when">${esc(e.when)}</div>
        <div class="etymology-timeline-rail">
          <span class="etymology-timeline-dot"></span>
          ${i < arr.length - 1 ? '<span class="etymology-timeline-line"></span>' : ""}
        </div>
        <div class="etymology-timeline-body">
          <div class="etymology-timeline-title">${esc(e.title)}</div>
          <p class="etymology-timeline-text">${esc(e.body)}</p>
        </div>
      </div>`).join("");
  }

  function renderEtymologyFeatured(data, replacementData) {
    const glossaryTerm = termByForm(data.word);
    const root = firstEtymologyLine(data) || "Look up the Wiktionary entry below for the full lineage.";
    const pos = lexicalLabel(data);
    const careful = renderCarefulBlock(glossaryTerm, replacementData);
    const wiktHtml = buildWiktHtml(data);

    const importNote = glossaryTerm
      ? `<div class="etymology-import">
           <div class="etymology-import-label">What it imports</div>
           <p class="etymology-card-text">${esc(glossaryTerm.problem)}</p>
         </div>`
      : "";

    const etymonlineUrl = `https://www.etymonline.com/word/${encodeURIComponent(data.word)}`;
    const sourceLink = data.sourceUrl
      ? `<a href="${esc(data.sourceUrl)}" rel="noopener noreferrer">Wiktionary</a>`
      : "";
    const links = [sourceLink, `<a href="${esc(etymonlineUrl)}" rel="noopener noreferrer">Etymonline</a>`].filter(Boolean).join(" · ");

    etymologyFeatured.innerHTML = `
      <div class="etymology-featured-inner">
        <div class="etymology-word-col">
          <h2 class="etymology-headword">${esc(capitalize(data.word))}</h2>
          ${pos ? `<div class="etymology-meta"><span>${esc(pos)}</span></div>` : ""}
          <div class="etymology-card-block">
            <div class="etymology-card-label">Root</div>
            <p class="etymology-card-text">${esc(root)}</p>
          </div>
          ${importNote}
          ${wiktHtml}
          ${careful}
          <p class="etymology-attribution">${esc(data.attribution || "")}${links ? ` · ${links}` : ""}</p>
        </div>
        <div class="etymology-shift-col">
          <p class="mono-eyebrow etymology-shift-title">How its use shifted</p>
          ${renderShiftTimeline(glossaryTerm)}
        </div>
      </div>`;
    etymologyFeatured.hidden = false;

    const glossaryLink = etymologyFeatured.querySelector(`a[href^="#glossary/"]`);
    if (glossaryLink) {
      glossaryLink.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo({ tab: "glossary", term: glossaryTerm.id }, true);
      });
    }
  }

  function openEtymology(word) {
    navigateTo({ tab: "etymology", word: word }, true);
    const panel = document.getElementById("panel-etymology");
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function analyzeEtymology(opts) {
    const navigate = !opts || opts.navigate !== false;
    if (etymologyBusy) return;
    const word = etymologyWord.value.trim();
    if (!word) {
      etymologyFeedback.textContent = "Enter a word to look up.";
      etymologyFeedback.className = "etymology-feedback error";
      etymologyFeatured.hidden = true;
      return;
    }

    if (navigate) {
      setActiveTab("etymology");
      const state = { tab: "etymology", word: word };
      if (!history.state || history.state.tab !== "etymology" || history.state.word !== word) {
        history.pushState(state, "", stateToHash(state));
      }
    }

    etymologyBusy = true;
    etymologyAnalyzeBtn.disabled = true;
    etymologyFeedback.textContent = "Looking up etymology…";
    etymologyFeedback.className = "etymology-feedback loading";
    etymologyFeatured.hidden = true;

    try {
      const data = await fetchEtymologyData(word);
      if (data.error) {
        etymologyFeedback.textContent = data.error;
        etymologyFeedback.className = "etymology-feedback error";
        return;
      }
      if (!data.entries || !data.entries.length) {
        etymologyFeedback.textContent = "No etymology found for that word.";
        etymologyFeedback.className = "etymology-feedback error";
        return;
      }

      const glossaryTerm = termByForm(data.word);
      const replacementWord = etymologyReplacementLookup(glossaryTerm);
      let replacementData = null;
      if (replacementWord && replacementWord !== data.word.toLowerCase()) {
        const fetched = await fetchEtymologyData(replacementWord);
        if (fetched.entries && fetched.entries.length) {
          replacementData = fetched;
        }
      }

      etymologyFeedback.textContent = "";
      etymologyFeedback.className = "etymology-feedback";
      renderEtymologyFeatured(data, replacementData);
    } catch (err) {
      etymologyFeedback.textContent = "Could not reach the lookup service.";
      etymologyFeedback.className = "etymology-feedback error";
    } finally {
      etymologyBusy = false;
      etymologyAnalyzeBtn.disabled = false;
    }
  }

  etymologyAnalyzeBtn.addEventListener("click", () => analyzeEtymology());
  etymologyWord.addEventListener("keydown", (e) => {
    if (e.key === "Enter") analyzeEtymology();
  });
  renderEtymologySuggestions();
  renderEtymologyIndex();

  // --- Boot routing ---
  const initialState = hashToState();
  history.replaceState(initialState, "", stateToHash(initialState));
  applyState(initialState);
})();
