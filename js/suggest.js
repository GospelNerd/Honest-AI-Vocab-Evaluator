(function () {
  const dialog = document.getElementById("suggest-dialog");
  const openBtn = document.getElementById("suggest-open");
  const cancelBtn = document.getElementById("suggest-cancel");
  const form = document.getElementById("suggest-form");
  const errorEl = document.getElementById("suggest-error");
  if (!dialog || !openBtn || !form) return;

  const REPO = "Himalogic/Honest-AI-Vocab-Evaluator";

  function openDialog() {
    if (errorEl) errorEl.hidden = true;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    const first = document.getElementById("sg-misleading");
    if (first) first.focus();
  }

  function closeDialog() {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function openInNewTab(url) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  openBtn.addEventListener("click", openDialog);
  if (cancelBtn) cancelBtn.addEventListener("click", closeDialog);

  // Click on the backdrop (the dialog element itself, outside the form) closes it.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) closeDialog();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : "";
    };

    const misleading = val("sg-misleading");
    const replacement = val("sg-replacement");
    const problem = val("sg-problem");
    const exampleBad = val("sg-example-bad");
    const exampleGood = val("sg-example-good");
    const source = val("sg-source");

    if (!misleading || !replacement || !problem) {
      if (errorEl) {
        errorEl.textContent = "Please fill in the term, a replacement, and why it misleads. The rest is optional.";
        errorEl.hidden = false;
      }
      return;
    }

    const params = new URLSearchParams({
      template: "term-submission.yml",
      title: `[Term]: ${misleading}`,
      misleading: misleading,
      replacement: replacement,
      problem: problem,
    });
    if (exampleBad) params.set("example_bad", exampleBad);
    if (exampleGood) params.set("example_good", exampleGood);
    if (source) params.set("source", source);

    openInNewTab(`https://github.com/${REPO}/issues/new?${params.toString()}`);
    closeDialog();
  });
})();
