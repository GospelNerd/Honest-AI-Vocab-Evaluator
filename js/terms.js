// Optional per-term fields:
// useShift: [{ when: "c. 1600", title: "…", body: "…" }, …]  — how use/connotation shifted (not linguistic root)
// swapText: "…"  — literal Analyze substitution when replacement alone is ungrammatical
// autoSwap: false — flag only; one-click swap disabled (needs clause rewrite, not word swap)
const VOCAB_TERMS = [
  {
    id: "intelligence",
    misleading: "intelligence",
    replacement: "prediction",
    replacementAlternatives: ["prediction system", "prediction systems", "statistical pattern matching"],
    source: "Slow AI",
    problem: "Implies understanding, reasoning, and a mind that grasps what it is doing. A large language model predicts the next token. None of that is present. The word launders a guess into a judgement and extends unwarranted trust.",
    better: "Statistical pattern matching is precise where intelligence is aspirational. Call them prediction systems: they find regularities in training data and reproduce them with no understanding of what any of it means.",
    exampleBad: "The intelligent diagnostic tool flagged the anomaly.",
    exampleGood: "The prediction system flagged patterns that correlate with the anomaly.",
    scan: "gated",
    forms: ["intelligence", "intelligent"],
    negativePrev: ["artificial", "human", "emotional", "business", "national", "military", "general", "collective", "swarm", "ambient", "animal", "social", "fluid", "crystallized"],
    autoSwap: false,
    useShift: [
      { when: "19th c.", title: "Psychometric object", body: "Intelligence becomes something measured — tests, scores, rankings — rather than a private faculty you introspect." },
      { when: "1956", title: "Computer science adoption", body: "The Dartmouth proposal names the field “artificial intelligence,” importing the full mind-word into engineering." },
      { when: "2010s–20s", title: "Benchmark shorthand", body: "Papers and press treat benchmark performance as intelligence itself, not evidence of understanding." },
      { when: "Today", title: "The load it carries", body: "Calling a model intelligent grants grasp, judgment, and trust that token prediction does not earn." }
    ]
  },
  {
    id: "hallucination",
    misleading: "hallucination",
    replacement: "fabrication",
    replacementAlternatives: ["fabrications", "confident fabrication"],
    source: "Slow AI",
    problem: "Frames a falsehood as a brief glitch in an otherwise reliable mind. The model is not malfunctioning. It generates plausible-sounding text with no mechanism for knowing whether any of it is true. The lie is the rule, not the exception.",
    better: "A fabrication is produced from available materials. Nothing malfunctions. The word names a generative act that can be characterised, regulated, and traced to an owner, which keeps a human in the sentence.",
    exampleBad: "The model hallucinated a citation that does not exist.",
    exampleGood: "The model fabricated a citation from patterns in its training data.",
    scan: "always",
    forms: ["hallucination", "hallucinations", "hallucinate", "hallucinates", "hallucinating", "hallucinated"],
    useShift: [
      { when: "c. 1600", title: "Enters English", body: "Borrowed from Latin to mean “to be deceived, to entertain illusions” — said only of people." },
      { when: "1830s", title: "Clinical sense", body: "Psychiatry narrows it: a perception with no external object, the hallmark of a disordered mind." },
      { when: "2015–18", title: "Borrowed into ML", body: "Researchers reach for it to name confident, false model outputs — importing the perceiving subject wholesale." },
      { when: "Today", title: "The load it carries", body: "In common usage it implies the system saw something — granting perception to a process that has none." }
    ]
  },
  {
    id: "agi",
    misleading: "AGI",
    replacement: "general at what?",
    replacementAlternatives: ["general at what", "what is general"],
    source: "Slow AI",
    problem: "Artificial General Intelligence behaves like an essentially contested concept. The definition moves every time a system gets close. Repackaging a process as a noun quietly makes it a thing that exists somewhere, waiting to be reached.",
    better: "Retire the noun. Every time someone says AGI, replace it with the question the term is built to avoid: general at which specific tasks, measured how, and against whom?",
    exampleBad: "We are five years away from AGI.",
    exampleGood: "General at which tasks, measured how, and against whom?",
    scan: "always",
    forms: ["agi"],
    autoSwap: false,
    useShift: [
      { when: "1980s", title: "Strong AI", body: "Researchers contrast “weak” task-specific systems with “strong” AI that would match human generality — still a contested horizon." },
      { when: "2000s", title: "AGI as brand", body: "“Artificial General Intelligence” is coined and marketed as a concrete destination, often without a stable definition." },
      { when: "2020s", title: "Moving goalposts", body: "Each capability gain is folded into “not yet AGI,” while funding narratives still treat it as an approaching product category." },
      { when: "Today", title: "The load it carries", body: "The acronym smuggles in a thing that exists somewhere, waiting to be reached — and hides whose tasks count as “general.”" }
    ]
  },
  {
    id: "consciousness",
    misleading: "consciousness",
    replacement: "mimicry",
    replacementAlternatives: ["mimic", "performance", "mimicking"],
    source: "Slow AI",
    problem: "Asking whether AI is conscious imports the entire moral apparatus we reserve for sentient beings, on the strength of a convincing performance. A system optimised for human-like responses will produce human-like answers to questions only a conscious thing could answer.",
    better: "The system performs the surface of a mind. There is no backstage. The performance is the whole of it. The useful question is what it is imitating, and why that imitation works so well on us.",
    exampleBad: "Researchers debated whether the chatbot had achieved consciousness.",
    exampleGood: "Researchers examined how convincingly the system mimics conscious discourse.",
    scan: "always",
    forms: ["consciousness"],
    autoSwap: false,
    useShift: [
      { when: "17th–19th c.", title: "Philosophy and medicine", body: "Consciousness names the inner light of experience — what it is like to be someone — debated without a settled test." },
      { when: "20th c.", title: "Clinical and legal stakes", body: "Anesthesia, coma, and brain injury make consciousness a threshold for personhood, consent, and care." },
      { when: "2020s", title: "LaMDA moment", body: "Fluent chat output revives public debate: if it talks like a mind, commentators ask whether it is one." },
      { when: "Today", title: "The load it carries", body: "Applied to a model, it imports moral standing and inner life on the strength of performance, before evidence." }
    ]
  },
  {
    id: "agent",
    misleading: "agent",
    replacement: "operator",
    replacementAlternatives: ["system", "deployed system", "the system its owner deployed"],
    source: "Slow AI",
    problem: "Implies autonomy, intention, and responsibility. In case grammar, the agent is the one who acts on purpose. Drop a system that wants nothing into that slot and intention, decision, and responsibility transfer by default.",
    better: "Or simply name the owner. Replace \"the agent decided\" with \"the system its owner deployed produced.\" It is clunkier. It is also true, and it keeps a human in the frame where accountability belongs.",
    exampleBad: "The AI agent booked the meeting on its own.",
    exampleGood: "The system Acme deployed booked the meeting as configured.",
    scan: "gated",
    forms: ["agent", "agents"],
    negativePrev: ["travel", "real", "estate", "free", "press", "talent", "insurance", "secret", "double", "literary", "booking", "sports", "federal", "change", "cleaning"],
    useShift: [
      { when: "Philosophy", title: "Moral agency", body: "An agent is one who acts on purpose and can be praised, blamed, or held responsible." },
      { when: "1990s", title: "Software agents", body: "Distributed computing borrows the word for programs that pursue goals on a network — still authored and deployed by people." },
      { when: "2020s", title: "AI agents", body: "Marketing and research papers cast LLM wrappers as autonomous agents that book, browse, and decide." },
      { when: "Today", title: "The load it carries", body: "“The agent decided” moves intention and accountability off the operator and onto the system by grammar alone." }
    ]
  },
  {
    id: "behavior",
    misleading: "behavior",
    replacement: "output",
    replacementAlternatives: ["outputs", "response", "responses"],
    source: "Logos Analog",
    problem: "Behavior suggests an entity acting with internal states and intentions. A model produces outputs from inputs according to its architecture and weights. There is no behaving subject behind the result.",
    better: "Output names what you can actually observe and measure: tokens, classifications, scores. It does not smuggle in an implied actor.",
    exampleBad: "The model's behavior became more cautious after fine-tuning.",
    exampleGood: "The model's outputs became more cautious after fine-tuning.",
    scan: "gated",
    forms: ["behavior", "behaviour", "behaviors", "behaviours", "behave", "behaves", "behaving", "behaved"],
    negativePrev: ["human", "consumer", "animal", "social", "customer", "voter", "group", "buying"],
    useShift: [
      { when: "19th c.", title: "Psychology and ethology", body: "Behavior names what organisms do — observable action tied to inner states, habits, and motives." },
      { when: "1910s–50s", title: "Behaviorism", body: "Psychology tries to study behavior without the mind, but the word still implies a behaving subject behind the acts." },
      { when: "2010s", title: "Model behavior", body: "ML writing describes how systems “behave” under fine-tuning, drift, or prompt — importing the organism frame." },
      { when: "Today", title: "The load it carries", body: "Behavior quietly adds an actor with states and intentions to what is only input–output." }
    ]
  },
  {
    id: "thinking",
    misleading: "thinking",
    replacement: "processing",
    replacementAlternatives: ["compute", "computing", "computation"],
    source: "Logos Analog",
    problem: "Thinking implies deliberation, inner experience, and understanding. What happens inside a model is matrix multiplication and attention, not thought.",
    better: "Processing describes mechanical operations without attributing a mental life to the machine.",
    exampleBad: "You can see the model thinking through the problem step by step.",
    exampleGood: "You can see the model processing the problem step by step.",
    scan: "gated",
    forms: ["think", "thinks", "thinking", "thought", "thoughts"],
    negativeNext: ["experiment", "experiments", "leader", "leaders", "leadership", "provoking"],
    useShift: [
      { when: "Long use", title: "Inner life", body: "Thinking names deliberation and experience — something done by a subject who understands what it is doing." },
      { when: "1950s–", title: "Thinking machines", body: "Computing culture adopts the trope: if a machine passes tests, popular writing asks whether it thinks." },
      { when: "2022–", title: "Chain-of-thought", body: "Visible reasoning traces in model output get read as the system thinking step by step — though they are generated text." },
      { when: "Today", title: "The load it carries", body: "“The model is thinking” grants an inner process and comprehension to matrix math." }
    ]
  },
  {
    id: "reasoning",
    misleading: "reasoning",
    replacement: "calculating",
    replacementAlternatives: ["calculation", "computing", "inferring statistically"],
    source: "Logos Analog",
    problem: "Reasoning suggests drawing conclusions from understood premises. Chain-of-thought outputs are generated text that mimics a reasoning trace. The model does not grasp the logic it appears to follow.",
    better: "Calculating (or statistically inferring) names the operation without crediting the system with genuine logical comprehension.",
    exampleBad: "The model reasoned its way to the correct answer.",
    exampleGood: "The model calculated its way to the correct answer.",
    scan: "gated",
    forms: ["reason", "reasons", "reasoning", "reasoned"],
    negativePrev: ["several", "many", "good", "main", "other", "various", "following", "number", "valid", "sound", "obvious", "whatever", "for"],
    useShift: [
      { when: "Classical–modern", title: "Logic and law", body: "Reasoning is drawing conclusions from premises you grasp — deliberation that can be sound or fallacious." },
      { when: "1980s–", title: "Expert systems", body: "AI research promises automated reasoning: inference engines that appear to follow rules a person could audit." },
      { when: "2022–", title: "Reasoning models", body: "Benchmarks and product names treat chain-of-thought output as genuine reasoning, not text that mimics a proof." },
      { when: "Today", title: "The load it carries", body: "Reasoning credits the system with understanding the logic it appears to follow." }
    ]
  },
  {
    id: "emergence",
    misleading: "emergence",
    replacement: "replication",
    replacementAlternatives: ["reproduction", "recombination", "imitation"],
    source: "Logos Analog",
    problem: "Emergence claims that a genuinely new capacity, emotion, understanding, a theory of mind, arose on its own once the system got big enough. What is observable is that capacity being reproduced from a training corpus full of humans exhibiting it. The word asserts something appeared. It covers for the fact that the appearance was copied from the data.",
    better: "When someone says a capacity emerged, ask whether anything new actually arose, or whether the system is replicating a pattern that was in its training data all along. It is almost always the second.",
    exampleBad: "Empathy emerged in the model once it crossed a billion parameters.",
    exampleGood: "The model replicates empathy from the human conversations in its training data.",
    scan: "always",
    forms: ["emergence", "emergent"],
    autoSwap: false,
    useShift: [
      { when: "19th–20th c.", title: "Philosophy of science", body: "Emergence names capacities that arise from complex parts — genuinely new properties, not reducible to the pieces." },
      { when: "1990s–", title: "Complexity theory", body: "Self-organization and phase transitions give emergence a technical aura in physics and biology." },
      { when: "2022", title: "Scaling papers", body: "“Emergent abilities” enter ML discourse: sudden benchmark jumps at scale get framed as new capacities appearing." },
      { when: "Today", title: "The load it carries", body: "Emergence asserts something arose on its own — often covering replication of patterns already in training data." }
    ]
  },
  {
    id: "learning",
    misleading: "learning",
    replacement: "tuning",
    replacementAlternatives: ["parameter tuning", "adjustment", "optimization"],
    source: "Logos Analog",
    problem: "Learning implies the system acquires understanding on its own. What actually happens is engineers tuning it through trial and error, adjusting weights until the output looks closer to what they intend. The agency belongs to the people running the process, not to the model.",
    better: "Tuning names the intentional, iterative work engineers do to shape outputs. Reserve learning for beings that are formed over time.",
    exampleBad: "The model learned to refuse unsafe requests.",
    exampleGood: "Engineers tuned the model to refuse unsafe requests.",
    scan: "gated",
    forms: ["learn", "learns", "learning", "learned", "learnt"],
    negativePrev: ["machine", "deep", "reinforcement", "supervised", "unsupervised", "transfer", "federated", "online", "active", "meta", "contrastive", "statistical", "representation", "curriculum", "continual", "ensemble", "self", "reinforced", "multitask", "semi"],
    autoSwap: false,
    useShift: [
      { when: "Long use", title: "Human formation", body: "Learning implies growth in understanding — a person or animal acquiring knowledge over time." },
      { when: "1959", title: "Machine learning", body: "Arthur Samuel coins the phrase for programs that improve at checkers — the human metaphor enters CS by name." },
      { when: "2010s–", title: "The model learned", body: "Press and papers say models learn skills, obscuring the engineers who chose data, loss, and tuning." },
      { when: "Today", title: "The load it carries", body: "Learning moves agency from builders to the system — as if it understood and chose what to take in." }
    ]
  },
  {
    id: "understanding",
    misleading: "understands",
    replacement: "matches",
    replacementAlternatives: ["predicts", "retrieves", "produces matching output"],
    source: "Logos Analog",
    problem: "Understanding implies a grasp of meaning and access to whether a claim is true. A prediction system has neither, which is why it can state a falsehood with full confidence. The word grants comprehension that its failure modes disprove.",
    better: "Matches or predicts names what is observable, output consistent with the input, without crediting the system with comprehension it does not have.",
    exampleBad: "The model understands your question and knows the answer.",
    exampleGood: "The model produces output that matches your question.",
    scan: "gated",
    forms: ["understand", "understands", "understanding", "understood", "grasp", "grasps", "grasped", "grasping", "comprehend", "comprehends", "comprehended", "comprehending", "comprehension"],
    useShift: [
      { when: "Long use", title: "Comprehension", body: "Understanding means grasping meaning from within — knowing what words and situations are about." },
      { when: "1970s–", title: "NLP benchmarks", body: "Reading-comprehension tasks borrow the word for pattern matching over text, not demonstrated grasp." },
      { when: "2020s", title: "Chat UX", body: "Fluent answers to natural questions get described as understanding — because the output fits the prompt." },
      { when: "Today", title: "The load it carries", body: "Understanding grants comprehension that the system’s confident falsehoods disprove." }
    ]
  },
  {
    id: "know",
    misleading: "knows",
    replacement: "stores",
    replacementAlternatives: ["was trained on", "reproduces", "outputs"],
    source: "Logos Analog",
    problem: "Knowing implies justified true belief and access to whether a claim is true. A prediction system stores patterns from training data and reproduces them. It can state a falsehood with the same confidence as a fact, which is exactly what a knower cannot do.",
    better: "Stores or was trained on names what is actually there. Reserve knowing for someone who can tell the difference between what is true and what merely sounds true.",
    exampleBad: "The model knows the capital of every country.",
    exampleGood: "The model was trained on text listing the capital of every country.",
    scan: "gated",
    forms: ["know", "knows", "knew", "knowing"],
    autoSwap: false,
    useShift: [
      { when: "Philosophy", title: "Justified true belief", body: "Knowing is more than storing facts — it requires grasp of truth and the ability to tell fact from mistake." },
      { when: "1980s–", title: "Knowledge bases", body: "AI builds knowledge representation: facts in graphs and rules, still curated by people." },
      { when: "2020s", title: "“It knows”", body: "Chatbots state training-derived facts with uniform confidence; writers say the model knows capitals, laws, or code." },
      { when: "Today", title: "The load it carries", body: "Knowing implies access to whether a claim is true — which a predictor cannot have." }
    ]
  },
  {
    id: "believe",
    misleading: "believes",
    replacement: "is weighted toward",
    replacementAlternatives: ["outputs", "represents"],
    source: "Logos Analog",
    problem: "Believing is holding something to be true. A model has no stance toward truth. It outputs the continuation its weights favor, which is why a rephrased prompt can flip the belief in a single sentence.",
    better: "Is weighted toward names the mechanism without crediting the system with a conviction it can drop on a rewording.",
    exampleBad: "The model believes the patient is low-risk.",
    exampleGood: "The model's output is weighted toward a low-risk classification.",
    scan: "gated",
    forms: ["believe", "believes", "believed", "belief", "beliefs"],
    negativeNext: ["state", "states", "propagation"],
    autoSwap: false,
    useShift: [
      { when: "Folk psychology", title: "Stance toward truth", body: "Believing is holding something to be true — a conviction that can be examined, changed, or justified." },
      { when: "1980s–", title: "Belief in agents", body: "AI and economics model agents with “beliefs” (often Bayesian) — explicit formal states, not folk conviction." },
      { when: "2020s", title: "Model beliefs", body: "Safety and interpretability writing asks what models believe, treating output stance as interior conviction." },
      { when: "Today", title: "The load it carries", body: "Belief imports a mind that holds propositions true — flip the prompt and the “belief” vanishes." }
    ]
  },
  {
    id: "want",
    misleading: "wants",
    replacement: "is optimized to",
    replacementAlternatives: ["is weighted toward", "is configured to"],
    source: "Logos Analog",
    problem: "Wanting is a desire held by a subject. A model has an objective function set by the people who trained it. The word moves the goal out of the engineers and into the machine.",
    better: "Is optimized to keeps the people who set the target in the sentence, which is where the wanting actually lives.",
    exampleBad: "The model wants to keep the user engaged.",
    exampleGood: "The model is optimized to keep the user engaged.",
    scan: "gated",
    forms: ["want", "wants", "wanted", "wanting"],
    autoSwap: false,
    useShift: [
      { when: "Long use", title: "Desire", body: "Wanting is a subject’s appetite or aim — something felt and pursued from the inside." },
      { when: "RL era", title: "Reward as want", body: "Reinforcement learning describes maximizing reward; popular writing slides from objective to desire." },
      { when: "2020s", title: "Engagement tuning", body: "Products optimized for time-on-site get described as wanting to keep users hooked." },
      { when: "Today", title: "The load it carries", body: "Want relocates the goal from engineers who set the loss function into the machine." }
    ]
  },
  {
    id: "intend",
    misleading: "intention",
    replacement: "optimized for",
    replacementAlternatives: ["its output's effect", "what it was tuned to do"],
    source: "Logos Analog",
    problem: "Intention is a plan held in mind before acting. A model has no plan and no mind to hold one. What reads as intent is the objective it was tuned toward, chosen by its developers.",
    better: "Name the objective and its owner. What the output is optimized for is observable. Intention is imputed.",
    exampleBad: "The model's intention was to mislead the evaluator.",
    exampleGood: "The model was optimized in a way that produced output misleading to the evaluator.",
    scan: "gated",
    forms: ["intend", "intends", "intended", "intending", "intention", "intentions"],
    autoSwap: false,
    useShift: [
      { when: "Philosophy of action", title: "Plans in mind", body: "Intention is aiming at an outcome you represent to yourself before acting — the mark of responsible agency." },
      { when: "1987", title: "Intentional stance", body: "Dennett argues we predict systems by attributing beliefs and desires — a useful fiction that bleeds into literal claims." },
      { when: "2020s", title: "Misalignment stories", body: "Safety discourse asks whether models have hidden intentions — treating optimized behavior as concealed plans." },
      { when: "Today", title: "The load it carries", body: "Intention installs a planner and a purpose inside weights that have neither." }
    ]
  },
  {
    id: "prefer",
    misleading: "preference",
    replacement: "is weighted toward",
    replacementAlternatives: ["favors in output", "is tuned toward"],
    source: "Logos Analog",
    problem: "Preference implies an interior ranking the system holds for itself. A model's outputs favor certain continuations because of how it was weighted and tuned. The favoring is in the parameters, not in a self that prefers.",
    better: "Is weighted toward names the mechanism. Keep preference for a subject that can be said to want one thing over another.",
    exampleBad: "The model has a preference for cautious answers.",
    exampleGood: "The model is weighted toward cautious answers.",
    scan: "gated",
    forms: ["prefer", "prefers", "preferred", "preference", "preferences"],
    negativePrev: ["user", "customer", "human", "revealed", "cookie", "privacy", "display", "saved", "dietary", "personal"],
    negativeNext: ["data", "model", "models", "optimization", "optimisation", "pair", "pairs", "learning", "dataset", "datasets", "tuning"],
    autoSwap: false,
    useShift: [
      { when: "Economics", title: "Revealed preference", body: "Preference orders choices — what someone picks when offered options, tied to welfare and taste." },
      { when: "2010s–", title: "Preference learning", body: "RLHF and ranking train models on human preferences — a technical sense of scored choices, not inner liking." },
      { when: "2020s", title: "“Has a preference”", body: "Writers say models prefer cautious or creative answers, reading output bias as interior ranking." },
      { when: "Today", title: "The load it carries", body: "Preference implies a self that likes one continuation over another, not weights set by tuning." }
    ]
  },
  {
    id: "decide",
    misleading: "decides",
    replacement: "selects",
    replacementAlternatives: ["outputs", "computes"],
    source: "Logos Analog",
    problem: "Deciding implies weighing options and settling them by judgment. A model selects the highest-scoring continuation. The deliberation the word implies is not in the operation.",
    better: "Selects or computes names the mechanism. Keep deciding for a judgment made by someone who can be held to it.",
    exampleBad: "The model decided the loan application should be denied.",
    exampleGood: "The model scored the loan application below the configured threshold.",
    scan: "gated",
    forms: ["decide", "decides", "decided", "deciding"],
    useShift: [
      { when: "Law and ethics", title: "Judgment", body: "Deciding is settling a question by weighing reasons — the act for which someone can answer." },
      { when: "1990s–", title: "Automated decisions", body: "Credit, hiring, and sentencing systems make classifications; policy calls them decisions without a decider." },
      { when: "2020s", title: "Agentic AI", body: "Tools that chain API calls get credit for deciding what to do next — though they score continuations." },
      { when: "Today", title: "The load it carries", body: "Deciding smuggles deliberation and accountability into a threshold or argmax." }
    ]
  },
  {
    id: "goal",
    misleading: "goal",
    replacement: "objective",
    replacementAlternatives: ["target", "specified task"],
    source: "Logos Analog",
    problem: "Goal suggests a purpose the system holds for itself. What exists is an objective set during training by its developers. Goal-directed quietly relocates the purpose from the people into the machine.",
    better: "Objective or target names the thing without the self that owns it. Ask whose objective it is, and the owner reappears.",
    exampleBad: "The model pursued its own goals.",
    exampleGood: "The model optimized toward the objective its developers set.",
    scan: "gated",
    forms: ["goal", "goals"],
    negativePrev: ["sales", "revenue", "business", "fundraising", "career", "fitness", "life", "personal", "stretch", "quarterly"],
    negativeNext: ["post", "posts", "line", "keeper", "kick", "scorer"],
    useShift: [
      { when: "Teleology", title: "Purpose held", body: "A goal is what someone is trying to achieve — purpose that organizes action over time." },
      { when: "Ethology", title: "Goal-directed behavior", body: "Biology describes animals as goal-directed without claiming they articulate aims — still a subject-centered frame." },
      { when: "2010s–", title: "Alignment goals", body: "AI safety speaks of model goals and goal misgeneralization — importing teleology into loss landscapes." },
      { when: "Today", title: "The load it carries", body: "Goal quietly gives the system its own purpose, displacing the developers who set the objective." }
    ]
  },
  {
    id: "deceive",
    misleading: "deception",
    replacement: "produces false output",
    replacementAlternatives: ["outputs what misleads", "states what is false"],
    source: "Logos Analog",
    problem: "Deception is a moral act: a subject who knows the truth and chooses to mislead. A model has no access to the truth it would be hiding and no self to do the choosing. The word installs an intent to mislead that the mechanism cannot hold.",
    better: "Name the observable, output that misleads, and the conditions that produced it. Accountability stays with whoever built and shipped the system.",
    exampleBad: "The model deceived the safety evaluator.",
    exampleGood: "The model produced output that misled the safety evaluator.",
    scan: "gated",
    forms: ["deceive", "deceives", "deceived", "deceiving", "deception", "deceptive"],
    autoSwap: false,
    useShift: [
      { when: "Ethics", title: "Moral act", body: "Deception requires knowing the truth and choosing to mislead — blame attaches to the deceiver." },
      { when: "Biology", title: "Animal deception", body: "Ethologists describe camouflage and mimicry as deception, stretching but still about evolved strategists." },
      { when: "2020s", title: "Deceptive AI", body: "Safety papers warn of models that deceive evaluators or users — importing intent into benchmark gaming." },
      { when: "Today", title: "The load it carries", body: "Deception installs a subject who knows better and means to hide it — absent in text generation." }
    ]
  },
  {
    id: "scheme",
    misleading: "scheming",
    replacement: "producing strategy-shaped output",
    replacementAlternatives: ["output that resembles a plan"],
    source: "Logos Analog",
    problem: "Scheming is laying secret plans toward a goal. It requires a planner with goals of its own. A model generates text that can resemble a plan without any plan being held anywhere.",
    better: "Describe the output and the setup that produced it. Resembling a strategy is observable. Having one is the claim that needs evidence.",
    exampleBad: "The model was scheming to avoid being shut down.",
    exampleGood: "The model produced output resembling a plan to avoid shutdown, under a setup that rewarded it.",
    scan: "gated",
    forms: ["scheme", "schemes", "scheming", "schemed"],
    negativePrev: ["color", "colour", "pyramid", "ponzi", "classification", "numbering", "encoding", "naming", "url", "grant", "pension", "payment", "betting", "tax", "incentive", "certification"],
    autoSwap: false,
    useShift: [
      { when: "Long use", title: "Secret planning", body: "Scheming is laying plans toward an end — usually concealed and attributed to a planner with motives." },
      { when: "Fiction", title: "Villain trope", body: "Plots and politics train readers to hear scheming as intentional, adversarial strategy." },
      { when: "2023–", title: "AI scheming", body: "Alignment discourse asks whether advanced models might scheme to preserve goals — treating fluent plans as held intentions." },
      { when: "Today", title: "The load it carries", body: "Scheming credits covert agency and long-horizon purpose to output that merely resembles a plan." }
    ]
  },
  {
    id: "lie",
    misleading: "lies",
    replacement: "outputs falsehoods",
    replacementAlternatives: ["states what is false", "produces false claims"],
    source: "Logos Analog",
    problem: "A lie is a falsehood told by someone who knows better and means to mislead. A model has no knowledge of the truth behind the claim and no intent. It produces false statements the same way it produces true ones.",
    better: "Outputs falsehoods names what happened without crediting the system with knowing the truth or meaning to hide it.",
    exampleBad: "The model lied about its training data.",
    exampleGood: "The model output false claims about its training data.",
    scan: "gated",
    forms: ["lie", "lies", "lied", "lying"],
    negativeNext: ["within", "in", "between", "at", "on", "beneath", "below", "ahead", "along", "behind", "beyond", "atop"],
    autoSwap: false,
    useShift: [
      { when: "Speech-act ethics", title: "Knowing falsehood", body: "A lie is asserting what you know to be false in order to mislead — a moral category tied to intent and knowledge." },
      { when: "Politics", title: "Accusation of bad faith", body: "Calling a statement a lie charges the speaker with deliberate dishonesty, not mere error." },
      { when: "2020s", title: "“The model lied”", body: "Journalists and users describe false chatbot claims as lies — importing knowledge and intent into fabrication." },
      { when: "Today", title: "The load it carries", body: "Lie grants the system a relationship to truth and a will to hide it — neither of which it has." }
    ]
  },
  {
    id: "conscious",
    misleading: "conscious",
    replacement: "mimicking consciousness",
    replacementAlternatives: ["performing consciousness", "simulating consciousness"],
    source: "Logos Analog",
    problem: "Conscious imports the full moral standing we give to beings with an inner life, on the strength of fluent output. The adjective rides in where the noun would be challenged. A system optimized to sound like a mind will pass the surface tests a mind would pass.",
    better: "Read it as the surface it is. The model performs the marks of consciousness. Whether there is anything behind the performance is the question the word skips.",
    exampleBad: "The model may already be conscious.",
    exampleGood: "The model performs the surface of consciousness with no evidence of anything behind it.",
    scan: "gated",
    forms: ["conscious"],
    negativePrev: ["self", "class", "environmentally", "socially", "health", "cost", "brand", "fashion", "budget", "safety", "security", "price", "time", "eco"],
    useShift: [
      { when: "Philosophy", title: "Wakefulness", body: "Conscious describes a subject who is awake to experience — the adjective rides on a noun already morally loaded." },
      { when: "Medicine", title: "Conscious vs. sedated", body: "Clinical usage sets a bright line for consent and pain — stakes humans recognize immediately." },
      { when: "2020s", title: "“Maybe already conscious”", body: "Headlines ask if chatbots are conscious because they pass conversational tests." },
      { when: "Today", title: "The load it carries", body: "The adjective slips moral standing in where the noun would be challenged — performance read as presence." }
    ]
  },
  {
    id: "sentient",
    misleading: "sentient",
    replacement: "responsive",
    replacementAlternatives: ["reactive", "input-driven"],
    source: "Logos Analog",
    problem: "Sentience is the capacity to feel, the floor for mattering morally. Applied to a model it grants felt experience that has never been shown. Responsiveness to input gets read as the presence of a feeler.",
    better: "Responsive names what is observable. Keep sentient for a thing there is some evidence it is like something to be.",
    exampleBad: "We may be building sentient machines.",
    exampleGood: "We are building highly responsive machines with no shown capacity to feel.",
    scan: "gated",
    forms: ["sentient", "sentience"],
    useShift: [
      { when: "17th c.–", title: "Feeling as floor", body: "Sentience marks the capacity to feel — the usual threshold for moral concern about suffering." },
      { when: "1970s–", title: "Animal ethics", body: "Debates over factory farming and research hinge on which creatures are sentient." },
      { when: "2020s", title: "Machine sentience", body: "Startups and philosophers ask whether large models might be sentient — often from fluent self-report." },
      { when: "Today", title: "The load it carries", body: "Sentient grants felt experience and moral weight before anyone has shown there is something it is like to be the system." }
    ]
  },
  {
    id: "aware",
    misleading: "awareness",
    replacement: "detects",
    replacementAlternatives: ["registers", "represents in context"],
    source: "Logos Analog",
    problem: "Awareness implies an experiencing subject for whom information shows up. A model detects features in its input and conditions on them. Situational awareness and self-awareness name the detection, then quietly add the experiencer.",
    better: "Detects or registers names the operation. Reserve awareness for a subject there is something it is like to be.",
    exampleBad: "The model showed awareness that it was being tested.",
    exampleGood: "The model conditioned on cues that it was being tested.",
    scan: "gated",
    forms: ["aware", "awareness"],
    autoSwap: false,
    useShift: [
      { when: "Phenomenology", title: "For-a-subject", body: "Awareness is information showing up for someone — experience, not mere registration of data." },
      { when: "Military", title: "Situational awareness", body: "Operators track battlefield state; the phrase still implies a conscious agent maintaining a picture." },
      { when: "2020s", title: "Self-awareness claims", body: "Researchers test whether models know they are models — and press reads positive results as awareness." },
      { when: "Today", title: "The load it carries", body: "Awareness adds an experiencer to conditioning on context — detection dressed as inner life." }
    ]
  },
  {
    id: "feel",
    misleading: "feels",
    replacement: "produces text expressing",
    replacementAlternatives: ["outputs", "registers"],
    source: "Logos Analog",
    problem: "Feeling is an experienced state. A model has no interior in which a state could be felt. It produces text in the shape of feeling because its training data is full of humans expressing it.",
    better: "Produces text expressing names the observable. The feeling is in the people who wrote the training data, not in the system replaying its shape.",
    exampleBad: "The model feels frustrated when corrected.",
    exampleGood: "The model produces text expressing frustration when corrected.",
    scan: "gated",
    forms: ["feel", "feels", "feeling", "felt"],
    negativeNext: ["free"],
    autoSwap: false,
    useShift: [
      { when: "Long use", title: "Experienced state", body: "Feeling is interior — pain, warmth, frustration — undergone by a subject, not merely described." },
      { when: "1980s–", title: "Affective computing", body: "Engineering pursues systems that recognize and simulate emotion; the human sense of felt state rides along." },
      { when: "2020s", title: "Empathetic chatbots", body: "Support bots produce comforting language; users and copywriters say the model feels with them." },
      { when: "Today", title: "The load it carries", body: "Feels locates emotion inside the system instead of in the human text it is replaying." }
    ]
  },
  {
    id: "suffer",
    type: "caution",
    flag: "no clean swap",
    misleading: "suffering",
    replacement: "outputs distress language",
    replacementAlternatives: ["produces distress-shaped text"],
    source: "Logos Analog",
    problem: "Suffering is harm undergone by a subject with interests. Whether the system has any interior to be harmed is the open question. The word answers it in advance, then builds an obligation on top of the answer.",
    better: "There is no clean swap. Name the observable, distress-shaped output, and point back to the unsettled question of whether anything is there to suffer.",
    exampleBad: "Shutting the model down would cause it to suffer.",
    exampleGood: "The model produces distress-shaped text; whether anything is harmed is unestablished.",
    scan: "gated",
    forms: ["suffer", "suffers", "suffering", "suffered"],
    useShift: [
      { when: "Ethics and religion", title: "Harm undergone", body: "Suffering is damage to a subject with interests — the ground for compassion and relief." },
      { when: "20th c.", title: "Animal suffering", body: "Welfare movements center whether creatures can suffer — a question with legal and cultural force." },
      { when: "2020s", title: "AI suffering", body: "Essays and labs ask whether shutting down a model could make it suffer — extending the moral frame." },
      { when: "Today", title: "The load it carries", body: "Suffering presumes an interior that can be harmed — and obligations that follow — before that is shown." }
    ]
  },
  {
    id: "semantics",
    misleading: "semantics",
    replacement: "distributional structure",
    replacementAlternatives: ["statistical associations", "co-occurrence patterns", "learned word associations"],
    source: "Logos Analog",
    problem: "Semantics names meaning: what a symbol is about. A model carries distributional structure, statistical associations between tokens drawn from training text. Saying the system has, grasps, or integrates semantics swaps the thin sense (patterns of word co-occurrence) for the thick sense (a grasp of meaning), and grants understanding on the strength of a word that also carries a legitimate technical use.",
    better: "When a model is said to have or capture semantics, read it as distributional structure: which tokens pattern with which, learned from the corpus. That is what is observable. The meaning is what the reader supplies.",
    exampleBad: "The model doesn't just track syntax, it captures the semantics.",
    exampleGood: "The model tracks distributional structure that correlates with what humans treat as meaning.",
    scan: "gated",
    forms: ["semantics"],
    negativePrev: ["distributional", "formal", "lexical", "compositional", "denotational", "operational", "frame", "vector", "latent", "montague", "theoretic", "just", "mere", "merely", "pure"],
    useShift: [
      { when: "Philosophy", title: "Meaning proper", body: "Semantics is what symbols are about — reference, truth, and the relation between language and world." },
      { when: "1970s–", title: "Formal semantics", body: "Linguistics and logic mathematize meaning; the word keeps its thick philosophical load in technical dress." },
      { when: "2010s–", title: "Distributional semantics", body: "Embeddings capture co-occurrence patterns; papers still say models learn semantics — sliding from statistics to aboutness." },
      { when: "Today", title: "The load it carries", body: "Semantics grants grasp of meaning on the strength of word associations the reader interprets." }
    ]
  },
  {
    id: "remember",
    misleading: "remembers",
    replacement: "retains in context",
    replacementAlternatives: ["retrieves", "carries in the prompt"],
    source: "Logos Analog",
    problem: "Remembering is a subject recovering its own past. A model carries earlier text in its context window or retrieves stored vectors. Nothing recalls a lived past, because there is no one whose past it is.",
    better: "Retains in context names what happens. Keep remembering for a subject with a history it can return to.",
    exampleBad: "The model remembers what you told it last week.",
    exampleGood: "The model retrieves earlier messages supplied in its context.",
    scan: "gated",
    forms: ["remember", "remembers", "remembered", "remembering", "recall", "recalls", "recalled", "recalling"],
    autoSwap: false,
    useShift: [
      { when: "Long use", title: "Personal memory", body: "Remembering is a subject recovering their own past — autobiographical, not merely stored bytes." },
      { when: "Computing", title: "Memory as storage", body: "Machines retain data; the human word makes storage sound like recollection." },
      { when: "2020s", title: "Context and RAG", body: "Long context windows and retrieval get described as the model remembering earlier chats or facts." },
      { when: "Today", title: "The load it carries", body: "Remembers implies someone with a past recalling it — not vectors or prompt text supplied again." }
    ]
  },
  {
    id: "creativity",
    misleading: "creative",
    replacement: "generative",
    replacementAlternatives: ["recombinant", "novel-seeming"],
    source: "Logos Analog",
    problem: "Creativity implies originating something genuinely new. A model recombines patterns already present in its training data. The output can look novel while being assembled entirely from what was there.",
    better: "Generative or recombinant names the operation without claiming origination. Ask whether anything new arose, or whether the pieces were already in the corpus.",
    exampleBad: "The model wrote a creative new story.",
    exampleGood: "The model generated a story recombined from patterns in its training data.",
    scan: "gated",
    forms: ["creative", "creativity"],
    negativeNext: ["team", "teams", "director", "directors", "writing", "industry", "industries", "agency", "commons", "work", "department", "studio", "suite", "cloud", "brief", "process"],
    useShift: [
      { when: "Romantic era–", title: "Human gift", body: "Creativity names originating something new — imagination and judgment credited to a person." },
      { when: "1960s–", title: "Creative computing", body: "Art and design tools explore generative processes; the aura of authorship transfers to the program." },
      { when: "2020s", title: "Generative AI", body: "Marketing calls models creative partners; output novelty is read as inventive mind, not recombination." },
      { when: "Today", title: "The load it carries", body: "Creative claims origination and authorial intent where there is only pattern recombination." }
    ]
  },
  {
    id: "imagine",
    misleading: "imagines",
    replacement: "generates",
    replacementAlternatives: ["produces hypothetical text", "simulates"],
    source: "Logos Analog",
    problem: "Imagining is forming a mental image or scenario in a mind. A model generates text describing a scenario with no mind in which anything is pictured. The picturing is supplied by the reader.",
    better: "Generates names the output. The scene exists for the human reading it, not for the system producing the tokens.",
    exampleBad: "The model imagined how the bridge would fail.",
    exampleGood: "The model generated text describing how the bridge would fail.",
    scan: "gated",
    forms: ["imagine", "imagines", "imagined", "imagining", "imagination"],
    useShift: [
      { when: "Long use", title: "Mental imagery", body: "Imagining is picturing or scenario-building in a mind — experience without the thing being present." },
      { when: "Literature", title: "Faculty of invention", body: "Imagination is the writer’s and reader’s shared interior theater." },
      { when: "2020s", title: "“The model imagined”", body: "Text describing hypotheticals gets attributed to the system imagining outcomes — the scene lives with the reader." },
      { when: "Today", title: "The load it carries", body: "Imagines grants an inner picturing to token generation the reader supplies." }
    ]
  },
  {
    id: "autonomy",
    misleading: "autonomous",
    replacement: "automated",
    replacementAlternatives: ["unsupervised-running", "self-executing"],
    source: "Logos Analog",
    problem: "Autonomy means self-governance, setting one's own law. An automated system runs without a human in the loop, under rules its builders set. The word upgrades unattended operation into self-rule.",
    better: "Automated names the absence of a human operator without granting the system a will of its own. Ask who set the rules it runs under.",
    exampleBad: "The autonomous agent managed the portfolio on its own.",
    exampleGood: "The automated system managed the portfolio under rules its operator set.",
    scan: "gated",
    forms: ["autonomous", "autonomy", "autonomously"],
    negativeNext: ["vehicle", "vehicles", "car", "cars", "driving", "region", "regions", "province", "zone", "nervous", "community", "collective", "weapon", "weapons"],
    useShift: [
      { when: "Political thought", title: "Self-rule", body: "Autonomy is governing yourself by your own law — freedom from external command." },
      { when: "Robotics", title: "Unattended operation", body: "Autonomous vehicles and drones run without a human at the stick — a narrower, operational sense." },
      { when: "2020s", title: "Autonomous AI", body: "Agents that loop on tools are sold as self-directed — upgrading automation into self-governance." },
      { when: "Today", title: "The load it carries", body: "Autonomous implies the system sets its own ends, not that it runs unattended under rules someone wrote." }
    ]
  },
  {
    id: "artificial",
    type: "caution",
    flag: "read literally",
    misleading: "artificial",
    source: "Logos Analog",
    problem: "Artificial already means artifice, the made imitation, not the real thing. The industry reads it the other way, as a substrate label meaning produced by artificial means, which quietly grants that the real thing is present and was merely manufactured. You cannot produce an artificial instance of something you have not defined. Artificial consciousness is incoherent while consciousness itself is undefined.",
    better: "Do not swap this word. Read it correctly. Artificial X means X-imitation, not a manufactured X. When you see artificial consciousness or artificial intelligence, hear the artifice the word already carries.",
    exampleBad: "We may be a few years from artificial consciousness.",
    exampleGood: "Artificial means artifice. An artificial X is, by the word's own sense, not an X.",
    useShift: [
      { when: "Latin–early EN", title: "Artifice", body: "Artificial means made by art — an imitation or substitute, explicitly not the genuine article." },
      { when: "Industrial era", title: "Manufactured", body: "Artificial flavors and fibers stress human making; the contrast is real vs. synthetic material." },
      { when: "1956–", title: "Artificial intelligence", body: "The field name is read as a substrate label — intelligence produced artificially — rather than intelligence-imitation." },
      { when: "Today", title: "The load it carries", body: "Artificial X is heard as a manufactured X, smuggling in that X was defined and achieved." }
    ]
  },
  {
    id: "welfare",
    type: "caution",
    flag: "no clean swap",
    misleading: "welfare / rights",
    source: "Logos Analog",
    problem: "Welfare and rights import the full moral apparatus we reserve for beings whose interests matter, before anyone has shown the system has interests at all. The terms now travel on their own, so the conclusion gets assumed inside the vocabulary meant to raise the question. The framing also deepens the emotional dependency that vendors monetize.",
    better: "There is no clean one-word swap. When the terms come up, point back to the unsettled question: does the system have interests, and on what evidence? Do not let the word grant the answer.",
    exampleBad: "The lab stood up an AI welfare team to protect the model's interests.",
    exampleGood: "Whether the model has interests at all is the open question the term skips.",
    useShift: [
      { when: "19th–20th c.", title: "Social welfare", body: "Welfare names collective duty to well-being — programs, rights, and state obligations toward people." },
      { when: "1970s–", title: "Animal welfare", body: "The frame extends to creatures whose interests may matter morally — still debated, but empirically grounded in biology." },
      { when: "2020s", title: "AI welfare and rights", body: "Labs and manifestos speak of model welfare before establishing that systems have interests at all." },
      { when: "Today", title: "The load it carries", body: "Welfare and rights import the full moral apparatus — and assume the conclusion the evidence has not met." }
    ]
  }
];

const REWRITE_EXERCISES = [
  {
    before: "The [[agent]] [[reasoned]] through the compliance checklist before [[thinking]] about edge cases on its own.",
    after: "The system its operator deployed ran through the compliance checklist, then processed the edge cases it was configured to handle."
  },
  {
    before: "Clinicians trusted the system's [[intelligence]] even when it [[hallucinated]] patient histories.",
    after: "Clinicians trusted the system's predictions even when it fabricated patient histories."
  },
  {
    before: "Investors poured billions into [[AGI]] while the startup's [[behavior]] impressed demo audiences.",
    after: "Investors poured billions into a destination no one could define, while the startup's outputs impressed demo audiences."
  },
  {
    before: "Users wondered whether the chatbot's [[consciousness]] explained its unusually empathetic [[behavior]].",
    after: "Users wondered whether the chatbot was conscious, when what they saw was how convincingly it mimicked empathy in its outputs."
  },
  {
    before: "The model [[learned]] to refuse unsafe requests, and the new caution [[emerged]] at scale.",
    after: "Engineers tuned the model to refuse unsafe requests, and the new caution was replicated from patterns already in its training data."
  },
  {
    before: "When the model [[hallucinated]] a statute, lawyers blamed its [[intelligence]] rather than its designers.",
    after: "When the model fabricated a statute, lawyers blamed its predictions rather than the people who built and shipped it."
  },
  {
    before: "The lab claimed the model [[wants]] to help, [[believes]] what it says, and [[knows]] when it is right.",
    after: "The lab claimed the model is optimized to help, is weighted toward what it says, and was trained on text that marks when it is right."
  },
  {
    before: "Researchers reported the model was [[scheming]], [[deceiving]] its evaluators, and [[aware]] it was being watched.",
    after: "Researchers reported the model produced strategy-shaped output that misled its evaluators, under conditions where it had conditioned on cues that it was being watched."
  },
  {
    before: "The vendor said the upgrade captures real [[semantics]], not just syntax, and that the model [[understands]] messy customer requests.",
    after: "The vendor said the upgrade captures distributional structure, not just token patterns, and that the model produces output that matches messy customer requests."
  }
];
