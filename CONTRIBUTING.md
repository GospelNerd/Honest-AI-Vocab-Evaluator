# Contributing

Thanks for wanting to make the glossary sharper. There are two ways in.

## Suggest a term (no code)

Use the [Suggest a term](https://github.com/Himalogic/Honest-AI-Vocab-Evaluator/issues/new?template=term-submission.yml) issue form. It walks you through the fields and captures the license agreement. You need a GitHub account. Good submissions propose a careful replacement and make one clean point about why the common word misleads. Venting about a word without a replacement is less useful than a precise swap.

## Open a pull request (code)

Glossary entries live in `js/terms.js` as objects in the `VOCAB_TERMS` array. To add or edit a term, edit that file and open a PR.

A standard entry looks like this:

```js
{
  id: "understand",                 // short unique slug, lowercase, used in URLs and etymology lookups
  misleading: "understands",         // the term as it is commonly used about AI
  replacement: "matches",            // the primary careful replacement
  replacementAlternatives: ["processes", "represents"], // other accepted answers (used by Practice)
  source: "logosanalog",             // provenance: "Illingworth & Wicker", "logosanalog", or a contributor name/handle
  problem: "Why the common term smuggles in unearned meaning. One clean point.",
  better: "What to use instead, and when.",
  exampleBad: "The model understands the user's intent.",
  exampleGood: "The model matches the prompt to patterns in its training data."
}
```

Some terms have no clean one-word swap (for example `artificial` and `welfare / rights`). Those are glossary-only and flagged for careful handling instead of drilled in Practice or Rewrite. They use a slightly different shape:

```js
{
  id: "welfare",
  misleading: "welfare / rights",
  type: "caution",                   // marks it glossary-only
  flag: "no clean swap",             // short label shown on the card
  source: "logosanalog",
  problem: "...",
  better: "...",
  exampleBad: "...",
  exampleGood: "..."
}
```

Keep the voice plain and observational. The tool surfaces words worth a second look and lets the writer decide. It does not scold, and it does not claim to detect misuse.

## License

Glossary content is licensed CC BY-SA 4.0 (see `LICENSE-CONTENT.md`). By submitting a term, through the issue form or a pull request, you agree your contribution may be published under that license. Code is licensed AGPL-3.0 (see `LICENSE`).
