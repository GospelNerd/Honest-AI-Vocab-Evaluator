(function () {
  const KEY = "have-theme";
  const app = document.getElementById("app");
  if (!app) return;

  function prefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function readStored() {
    try {
      return localStorage.getItem(KEY);
    } catch (err) {
      return null;
    }
  }

  function writeStored(dark) {
    try {
      localStorage.setItem(KEY, dark ? "dark" : "light");
    } catch (err) {
      // Storage may be unavailable.
    }
  }

  function apply(dark) {
    const on = dark ? "1" : "0";
    document.documentElement.dataset.dark = on;
    if (app) app.dataset.dark = on;
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    const glyph = document.getElementById("theme-glyph");
    const label = document.getElementById("theme-label");
    if (glyph) glyph.textContent = dark ? "☀" : "☾";
    if (label) label.textContent = dark ? "Light" : "Dark";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? "#141110" : "#201c19";
  }

  const stored = readStored();
  const initialDark = stored === "dark" ? true : stored === "light" ? false : prefersDark();
  apply(initialDark);

  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.dark !== "1";
      apply(next);
      writeStored(next);
    });
  }

  window.HAVE_THEME = { apply: apply };
})();
