# Honest AI Vocabulary Evaluator

A glossary and practice tool for choosing AI vocabulary that describes what these systems actually do, without borrowing the authority of a human mind.

Live at https://vocab.logosanalog.com

## What it is

Four modes:

- Glossary: misused AI terms, why each one misleads, and a more careful word to use instead.
- Practice: type the careful replacement for a given term.
- Rewrite: read a sentence built on careless vocabulary, try your own rewrite, then reveal a careful prose version to compare.
- Etymology: look up a word's origin via [Wiktionary](https://en.wiktionary.org/), licensed CC BY-SA.

## Etymology lookup

The Etymology tab uses a PHP proxy at `api/etymology.php` that queries [Wiktionary](https://en.wiktionary.org/) through the MediaWiki parse API and extracts the etymology section for a word. Wiktionary's text is licensed CC BY-SA, the same license as this project's glossary content, so the results can be displayed and reused with attribution.

Results are cached on disk (`api/cache/wiktionary/`) and in the browser session so repeat lookups do not re-fetch. Optional config lives in `api/config.local.php` (gitignored); copy from `api/config.local.php.example` if needed.

Be a good Wikimedia citizen: cache results, send a descriptive User-Agent, and link back to the source page.

Some terms have no clean one-word swap (for example "artificial" and "welfare / rights"). These appear in the Glossary flagged for careful handling, with guidance instead of a replacement.

## Credit

The first five terms (intelligence, hallucination, AGI, consciousness, agent) are drawn from "We Are Using the Wrong Words for AI" by Dr Sam Illingworth and The Strategic Linguist, published on Slow AI: https://theslowai.substack.com/p/wrong-words-for-ai . The remaining terms are additions from Logos Analog. Each entry carries a `source` field marking its provenance.

## Why this exists

The words we use for AI decide what we trust it with. When we say a model "understands," "reasons," or "wants" something, we hand it a standing it has not earned, and we quietly move responsibility off the people who built and deployed it. That confusion is not cosmetic. It shapes what gets believed, bought, and regulated.

This tool sits at a convergence. The careless-vocabulary problem is one of the threads I write about on Logos Analog, from the angle of what these terms smuggle in and who ends up holding the accountability. Sam Illingworth and The Strategic Linguist put a clean, usable frame on it with their five words and replacements, which is what turned a recurring theme into something you could build. And people like Randy Fernando at the Center for Humane Technology have been making related points about how the language around AI trains our expectations of it. When several people working from different starting points keep landing on the same problem, that is usually a sign the problem is real.

I built this to make the idea practical. A glossary you can search, a way to practice the swaps, and a rewrite drill that shows the careful version is real prose rather than a one-word substitution. The point is not to police anyone. It is to give writers, journalists, and practitioners a place to slow down and choose words that describe what these systems actually do.

## Contributions

The terms here are a starting point, not a closed list. If you have a word that misleads, a better replacement, or a sharper way to say why one misleads, contributions are welcome. Open an issue or a pull request. The glossary content is CC BY-SA, so anything you add stays open for the next person.

## Licensing

This repository is dual-licensed.

- Code (everything except the glossary content) is under the GNU Affero General Public License v3.0. See `LICENSE`.
- Glossary content (the entries in `js/terms.js`: the terms, problems, replacements, guidance, and examples, plus the rewrite exercises) is under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0). See `LICENSE-CONTENT.md`.

In short: use it, build on it, keep it open, and credit the sources. Nobody owns the words themselves. The work shared here is the selection, the framing, and the wording, offered under the same terms it was built from.
