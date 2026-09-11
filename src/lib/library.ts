/**
 * THE LIBRARY — one entry per ingredient, one study per entry.
 *
 * 10 September 2026. Every ingredient named on a product label on this site
 * gets a short reading: what it is, what it does in a formula, which products
 * in the house carry it, and one peer-reviewed study on the ingredient. The
 * study is cited as research on the INGREDIENT. It is never a test of the
 * product, and the copy never says otherwise — concentrations are the
 * supplier's, a rinse-off wash holds an active for seconds, and the house
 * standard is cosmetic benefits only.
 *
 * ── WHAT IS DELIBERATELY NOT HERE ───────────────────────────────────────────
 *
 * No ingredient that is not on a label. The peptide cream and eye cream in the
 * Selfnamed cart list Hexapeptide-11 and Dipalmitoyl Hydroxyproline in their
 * INCI; the site names only Hexapeptide-11 for Double Take, so only that one
 * has an entry. No drug language anywhere — treat, cure, heal, prevent, SPF,
 * sunscreen, UV protection. Vitamin E's study measured a UV-erythema model;
 * the entry says so as research and states plainly that nothing here is a
 * sunscreen (the same disclosure Smooth Talker already carries).
 *
 * ── VERIFICATION ────────────────────────────────────────────────────────────
 *
 * Every PMID below was checked against the PubMed record (title, first author,
 * journal, year) on 10 Sep 2026. The working reference with the full INCI
 * lists lives in the Claude project as claude/founder-ingredient-evidence.md.
 * Add an entry only with a PMID you have opened yourself.
 */

export type LibraryProductRef = {
  /** Product route. */
  href: string;
  /** Product name as sold. */
  name: string;
  /** How the label names the ingredient, when it differs from the entry. */
  as?: string;
};

export type LibraryEvidence =
  | "Randomised human trial"
  | "Human study"
  | "Laboratory study";

export type LibraryEntry = {
  slug: string;
  /** Reading name. */
  name: string;
  /** INCI or botanical name — the name on the carton. */
  inci: string;
  /** What kind of ingredient it is, in two or three words. The shelf label. */
  kind: string;
  /** One line under the name. Appearance and feel only. */
  standfirst: string;
  /** The reading. Three or four short paragraphs, British spelling. */
  body: string[];
  /** Products in the house that carry it. */
  products: LibraryProductRef[];
  study: {
    authors: string;
    title: string;
    journal: string;
    year: number;
    /** Volume(issue):pages, as printed. */
    ref: string;
    pmid: string;
    evidence: LibraryEvidence;
    /** What the study found, in one or two plain sentences with its numbers. */
    finding: string;
  };
};

const P = {
  thirstTrap: { href: "/products/thirst-trap", name: "Thirst Trap" },
  cMeGlow: { href: "/products/c-me-glow", name: "C Me Glow" },
  bounceBack: { href: "/products/bounce-back", name: "Bounce Back" },
  holdTheRoom: { href: "/products/hold-the-room", name: "Hold the Room" },
  openingLine: { href: "/products/opening-line", name: "Opening Line" },
  cleanBreak: { href: "/products/clean-break", name: "Clean Break" },
  smoothTalker: { href: "/products/smooth-talker", name: "Smooth Talker" },
  doubleTake: { href: "/products/double-take", name: "Double Take" },
} as const;

export const LIBRARY: LibraryEntry[] = [
  {
    slug: "hyaluronic-acid",
    name: "Hyaluronic acid",
    inci: "Sodium Hyaluronate",
    kind: "Humectant",
    standfirst: "The water-holder. Skin feels softer and looks plumper while it is on.",
    body: [
      "Hyaluronic acid is a sugar molecule your skin already makes, and it does one thing very well: it binds water. In a serum it sits in and on the upper layers of the skin and holds moisture there, which is why skin feels softer, smoother and more comfortable within minutes of applying it.",
      "The molecule comes in sizes. Larger weights stay at the surface and give an immediate feeling of softness; smaller weights sit a little deeper and keep the effect going. That is the thinking behind a serum built on several weights at once — different sizes doing different jobs, rather than one doing everything.",
      "It is not a wrinkle treatment and it does not add anything permanent. What it does is make well-hydrated skin look the way well-hydrated skin looks: smoother, more even, and better at holding makeup in place.",
    ],
    products: [{ ...P.thirstTrap, as: "eight-weight hyaluronic acid" }],
    study: {
      authors: "Pavicic T, Gauglitz GG, Lersch P, et al.",
      title:
        "Efficacy of cream-based novel formulations of hyaluronic acid of different molecular weights in anti-wrinkle treatment.",
      journal: "Journal of Drugs in Dermatology",
      year: 2011,
      ref: "10(9):990–1000",
      pmid: "22052267",
      evidence: "Randomised human trial",
      finding:
        "In 76 women over 60 days, 0.1% hyaluronic acid creams significantly improved skin hydration and elasticity against a vehicle control; the lower molecular weights also reduced measured wrinkle depth around the eyes.",
    },
  },
  {
    slug: "collagen",
    name: "Collagen",
    inci: "Hydrolyzed Collagen",
    kind: "Film-forming humectant",
    standfirst: "On the skin, not in it. A silk-like film that holds water and smooths the surface.",
    body: [
      "Collagen is the protein that gives skin its structure, and it is worth being clear about what a collagen serum does and does not do. Collagen molecules are far too large to pass through the surface of the skin, so a topical collagen product does not top up the collagen underneath. Anyone who tells you otherwise is selling something.",
      "What it does is useful in its own right. Hydrolysed collagen — collagen broken into small fragments — forms a fine, flexible film on the skin that binds water and gives an immediate feeling of smoothness and firmness. Skin looks more even and feels more supple while the product is on.",
      "Marine collagen is the same protein sourced from fish rather than cattle, chosen for how readily it hydrolyses. The evidence for topical collagen is thinner than for hyaluronic acid, and the entry below says so: a small pilot study, not a controlled trial.",
    ],
    products: [
      { ...P.thirstTrap, as: "marine collagen" },
      { ...P.bounceBack, as: "collagen" },
    ],
    study: {
      authors: "Lee YI, Lee SG, Jung I, et al.",
      title:
        "Effect of a topical collagen tripeptide on antiaging and inhibition of glycation of the skin: a pilot study.",
      journal: "International Journal of Molecular Sciences",
      year: 2022,
      ref: "23(3):1101",
      pmid: "35163025",
      evidence: "Human study",
      finding:
        "A four-week open-label pilot in 22 women using a topical fish-collagen tripeptide reported improvements in measured wrinkles, elasticity and skin density with no adverse events. Small and uncontrolled — read it as a signal, not a proof.",
    },
  },
  {
    slug: "panthenol",
    name: "Panthenol",
    inci: "Panthenol (pro-vitamin B5)",
    kind: "Humectant · skin conditioner",
    standfirst: "The quiet one. Draws water in, calms the feel of the surface, helps it hold together.",
    body: [
      "Panthenol is the form of vitamin B5 that skin absorbs and converts. It is one of the most studied ingredients in skincare and one of the least talked about, because it does nothing dramatic — it simply makes skin behave better.",
      "It works two ways. As a humectant it attracts water into the upper skin, so the surface feels softer and less tight. And it supports the skin's own barrier, the layer that decides how much water you keep, which is why formulators reach for it in anything meant to be gentle.",
      "In a hydrating serum it is the supporting act to hyaluronic acid: hyaluronic acid holds the water, panthenol helps the skin keep it.",
    ],
    products: [{ ...P.thirstTrap, as: "panthenol (B5)" }],
    study: {
      authors: "Gehring W, Gloor M.",
      title:
        "Effect of topically applied dexpanthenol on epidermal barrier function and stratum corneum hydration. Results of a human in vivo study.",
      journal: "Arzneimittelforschung",
      year: 2000,
      ref: "50(7):659–663",
      pmid: "10965426",
      evidence: "Randomised human trial",
      finding:
        "Seven days of topical dexpanthenol, tested double-blind against its own vehicle, significantly increased hydration of the outer skin and reduced water loss through it.",
    },
  },
  {
    slug: "vitamin-c",
    name: "Vitamin C",
    inci: "Ascorbic Acid · Ascorbyl Palmitate",
    kind: "Antioxidant",
    standfirst: "For tone that looks brighter and more even. The most studied antioxidant on any shelf.",
    body: [
      "Vitamin C is the antioxidant with the deepest evidence base in skincare. In the skin it neutralises the free radicals that daily life produces, and over weeks of use it is associated with tone that looks more even and a surface that looks smoother.",
      "It comes in several forms. Pure ascorbic acid is the form the largest trials used and the most potent, but it is unstable in water and can sting. Ascorbyl palmitate is an oil-soluble form that keeps better in a cream; it is gentler and the evidence for it specifically is lighter, which is why the study below is on ascorbic acid.",
      "Vitamin C is a morning ingredient by habit — it pairs with the antioxidant work the skin is doing during the day — but there is nothing wrong with using it at night.",
    ],
    products: [
      { ...P.cMeGlow, as: "vitamin C" },
      { ...P.doubleTake, as: "Vitamin C" },
    ],
    study: {
      authors: "Humbert PG, Haftek M, Creidi P, et al.",
      title:
        "Topical ascorbic acid on photoaged skin. Clinical, topographical and ultrastructural evaluation: double-blind study vs. placebo.",
      journal: "Experimental Dermatology",
      year: 2003,
      ref: "12(3):237–244",
      pmid: "12823436",
      evidence: "Randomised human trial",
      finding:
        "Six months of a 5% vitamin C cream, double-blind against placebo, significantly improved the overall appearance of sun-aged skin, with finer surface texture and fewer deep lines on measurement.",
    },
  },
  {
    slug: "chamomile",
    name: "Chamomile",
    inci: "Chamomilla Recutita (Matricaria) Flower Extract",
    kind: "Soothing botanical",
    standfirst: "The oldest calming ingredient in the book, and one of the few with a proper trial behind it.",
    body: [
      "Chamomile flower extract has been used on skin for as long as there has been skin to put it on. Its active constituents — bisabolol and the chamazulene that gives the oil its blue colour — are anti-inflammatory in the laboratory, and the feel on skin is exactly what you would expect: soothed, softened, less reactive.",
      "It suits skin that flushes, tightens or simply objects to things. In a cleanser it takes the edge off the wash; in a cream it is the reason the product feels kind.",
      "The study below is unusual for a botanical: a randomised comparison against a low-strength hydrocortisone cream in people with eczema, in which the chamomile cream held its own. That is a medical context, not a cosmetic one — we cite it because it is the best evidence on the ingredient, not because our products treat anything.",
    ],
    products: [
      { ...P.holdTheRoom, as: "chamomile extract" },
      { ...P.openingLine, as: "Camomile" },
    ],
    study: {
      authors: "Patzelt-Wenczler R, Ponce-Pöschl E.",
      title: "Proof of efficacy of Kamillosan® cream in atopic eczema.",
      journal: "European Journal of Medical Research",
      year: 2000,
      ref: "5(4):171–175",
      pmid: "10799352",
      evidence: "Randomised human trial",
      finding:
        "In a two-week randomised half-side comparison, a chamomile cream showed mild superiority to 0.5% hydrocortisone cream and a marginal difference from its vehicle on medium-grade eczema.",
    },
  },
  {
    slug: "witch-hazel",
    name: "Witch hazel",
    inci: "Hamamelis Virginiana Extract",
    kind: "Astringent botanical",
    standfirst: "Tightens the feel of the surface and calms visible redness. Best in a cream, where the alcohol stays out.",
    body: [
      "Witch hazel is a small North American tree whose bark and leaves are rich in tannins, and tannins are astringent: they draw the surface of the skin together, so it feels smoother and tighter and looks less flushed.",
      "It has a mixed reputation, and the reason is the bottle on the pharmacy shelf — a distillate in alcohol that can dry skin out. In a cream the extract arrives without the alcohol, which is where the benefit is and the drawback is not.",
      "The best evidence on it is a series of controlled tests on redness, in which a hamamelis lotion calmed the skin's response to an irritating light exposure better than the same lotion without it.",
    ],
    products: [{ ...P.holdTheRoom, as: "witch hazel" }],
    study: {
      authors: "Hughes-Formella BJ, Bohnsack K, Rippke F, et al.",
      title: "Anti-inflammatory effect of hamamelis lotion in a UVB erythema test.",
      journal: "Dermatology",
      year: 1998,
      ref: "196(3):316–322",
      pmid: "9621139",
      evidence: "Randomised human trial",
      finding:
        "In 30 volunteers, a lotion with 10% hamamelis distillate reduced induced redness by about 20% at seven hours and 27% at 48 hours, against 11–15% for the comparison lotions — a significant difference.",
    },
  },
  {
    slug: "sea-buckthorn",
    name: "Sea buckthorn",
    inci: "Hippophae Rhamnoides Fruit Extract",
    kind: "Nourishing botanical",
    standfirst: "An orange berry from cold coasts, unusually rich in the fatty acids skin uses to stay comfortable.",
    body: [
      "Sea buckthorn grows on windswept dunes and mountainsides across Europe and Asia, and its berries are the point: a rare source of omega-7 (palmitoleic acid) alongside omega-3, -6 and -9, carotenoids and vitamins C and E. The oil is a deep orange because of it.",
      "On skin those fatty acids do what fatty acids do — they sit within the surface layer and help it hold water, so skin feels softer and stays comfortable for longer. The carotenoids and tocopherols add antioxidant support.",
      "In a cleanser it is the reason the wash leaves skin feeling nourished rather than stripped, which is the whole argument for an oil-to-milk formula.",
    ],
    products: [{ ...P.openingLine, as: "Sea Buckthorn" }],
    study: {
      authors: "Khan BA, Akhtar N.",
      title:
        "Hippophae rhamnoides oil-in-water (O/W) emulsion improves barrier function in healthy human subjects.",
      journal: "Pakistan Journal of Pharmaceutical Sciences",
      year: 2014,
      ref: "27(6):1919–1922",
      pmid: "25362595",
      evidence: "Human study",
      finding:
        "Over 84 days in 13 healthy volunteers, a 5% sea buckthorn emulsion significantly improved skin hydration and reduced water loss compared with the same emulsion without it. A small study, single-blind.",
    },
  },
  {
    slug: "cloudberry",
    name: "Cloudberry",
    inci: "Rubus Chamaemorus Fruit Extract",
    kind: "Arctic botanical",
    standfirst: "An amber berry from the far north. Provenance first; the science is young.",
    body: [
      "Cloudberry is the golden raspberry of the Arctic — a low plant of Nordic bogs whose fruit ripens for a few weeks a year and is prized accordingly. It is rich in vitamin C and ellagitannins, and the seeds carry an oil high in omega-3 and -6.",
      "We will be straight about the evidence. The research on cloudberry and skin is early and mostly done in the laboratory; the strongest work is on the seed rather than the fruit, and a recent screen found the fruit extract itself did little in the dish. In a cleanser it is a small, fragrant, organically farmed part of the formula, and we like it for what it is.",
      "The study below is included because it is real and because it is the best there is — not because it makes a claim we would put on a carton.",
    ],
    products: [{ ...P.openingLine, as: "Cloudberry" }],
    study: {
      authors: "Aguilera-Correa JJ, Nohynek L, Alakomi HL, et al.",
      title:
        "Reduction of methicillin-resistant Staphylococcus aureus biofilm growth and development using arctic berry extracts.",
      journal: "Frontiers in Cellular and Infection Microbiology",
      year: 2023,
      ref: "13:1176755",
      pmid: "37424779",
      evidence: "Laboratory study",
      finding:
        "Cloudberry seed-coat extracts prevented three strains of resistant Staphylococcus aureus from forming biofilm in a wound-like medium. Laboratory only; nothing was applied to skin.",
    },
  },
  {
    slug: "mate-leaf",
    name: "Mate leaf",
    inci: "Ilex Paraguariensis Leaf Extract",
    kind: "Antioxidant botanical",
    standfirst: "A South American holly — not a tea — carrying the same family of antioxidants as coffee.",
    body: [
      "Yerba mate is the leaf South Americans steep for the drink of the same name, and it is a holly, not a tea plant. What makes it interesting on skin is its chemistry: it is unusually rich in chlorogenic and caffeic acids, the antioxidant polyphenols better known from coffee, plus a little caffeine.",
      "In a face wash it brings that antioxidant character to a formula for skin that congests and looks dull. It is a rinse-off product, so the contact time is seconds — think of it as part of what makes the wash feel fresh and clarifying, not as a treatment left on the skin.",
      "The evidence is preclinical: an antioxidant extract that behaved well on cells and calmed the skin's response to light exposure in an animal model. No human trial yet.",
    ],
    products: [{ ...P.cleanBreak, as: "Mate Leaf" }],
    study: {
      authors: "Cuelho CHF, Alves GAD, Lovatto MO, et al.",
      title:
        "Topical formulation containing Ilex paraguariensis extract increases metalloproteinases and myeloperoxidase activities in mice exposed to UVB radiation.",
      journal: "Journal of Photochemistry and Photobiology B",
      year: 2018,
      ref: "189:95–103",
      pmid: "30317053",
      evidence: "Laboratory study",
      finding:
        "A mate extract standardised to chlorogenic and caffeic acids showed strong antioxidant activity without harming skin cells, and in mice the topical formulation reduced two markers of light-induced inflammation.",
    },
  },
  {
    slug: "iceland-moss",
    name: "Iceland moss",
    inci: "Cetraria Islandica Extract",
    kind: "Soothing botanical",
    standfirst: "A lichen of the far north, used for centuries to calm. The research is on its immune chemistry.",
    body: [
      "Iceland moss is not a moss at all but a lichen — a partnership of fungus and alga that grows on cold, open ground across Iceland, Scandinavia and the mountains of Europe. It has been gathered as a soothing remedy for as long as people have lived there.",
      "Its main constituent is lichenan, a polysaccharide, and this is where the modern science sits: in the laboratory, extracts of Iceland moss shift immune signalling towards the calming end, and separate work has shown activity against a range of microbes in the dish.",
      "In a blemish wash it is there to soften the wash's character — a clarifying formula that does not feel harsh. Cosmetic benefits only; the study below is not on skin.",
    ],
    products: [{ ...P.cleanBreak, as: "Iceland Moss" }],
    study: {
      authors: "Freysdottir J, Omarsdottir S, Ingólfsdóttir K, Vikingsson A, Olafsdottir ES.",
      title:
        "In vitro and in vivo immunomodulating effects of traditionally prepared extract and purified compounds from Cetraria islandica.",
      journal: "International Immunopharmacology",
      year: 2008,
      ref: "8(3):423–430",
      pmid: "18279796",
      evidence: "Laboratory study",
      finding:
        "A traditionally prepared Iceland moss extract steered human immune cells towards the anti-inflammatory signal IL-10, and reduced induced inflammation in an animal model. Not a skin study.",
    },
  },
  {
    slug: "juniper-callus",
    name: "Juniper callus",
    inci: "Juniperus Communis Callus Culture Extract",
    kind: "Plant-cell botanical",
    standfirst: "Juniper grown as plant cells in culture, so the extract is consistent and the tree is never cut.",
    body: [
      "A callus is plant tissue grown in culture from a few cells of the parent — in this case common juniper, the shrub whose berries flavour gin. Growing the cells rather than harvesting the plant gives an extract that is the same batch to batch, uses almost no land or water, and leaves wild juniper alone.",
      "Juniper has a long history as a clarifying, purifying botanical, and the cell-culture extract carries its antioxidant chemistry. In a wash for blemish-prone skin it sits alongside Iceland moss and mate leaf as the purifying note.",
      "The study below is from the laboratory that makes the ingredient, and it is honest about what it is: safety and activity testing on skin cells, not a trial on people.",
    ],
    products: [{ ...P.cleanBreak, as: "Juniper Callus" }],
    study: {
      authors: "Ramata-Stunda A, Boroduskis M, Pastare L, et al.",
      title:
        "In vitro safety and efficacy evaluation of a Juniperus communis callus culture extract and Matricaria recutita processing waste extract combination as a cosmetic ingredient.",
      journal: "Plants",
      year: 2024,
      ref: "13(2):287",
      pmid: "38256840",
      evidence: "Laboratory study",
      finding:
        "On human skin cells, the juniper callus extract showed strong antioxidant activity, encouraged surface-cell growth and supported the balance of collagen production against its breakdown. Laboratory only.",
    },
  },
  {
    slug: "ceramides",
    name: "Ceramides",
    inci: "Glycosphingolipids",
    kind: "Barrier lipid",
    standfirst: "The mortar between the bricks. Skin's own barrier fat, replaced from the outside.",
    body: [
      "If the outer skin is a wall of cells, ceramides are the mortar. They are waxy lipids that make up around half of the material between those cells, and they are what stops water leaving and irritants getting in. Skin that is short on them feels tight, looks dull and reacts to things it should ignore.",
      "Putting ceramides back from the outside works, and the evidence for it is unusually good: creams built around ceramides measurably increase hydration and reduce water loss through the skin, and in people whose barriers are genuinely compromised the effect is clinically visible.",
      "In a tinted stick they are the skincare half of the hybrid — the reason the finish feels comfortable through the day rather than drying down.",
    ],
    products: [{ ...P.smoothTalker, as: "Ceramides" }],
    study: {
      authors: "Spada F, Barnes TM, Greive KA.",
      title:
        "Skin hydration is significantly increased by a cream formulated to mimic the skin's own natural moisturizing systems.",
      journal: "Clinical, Cosmetic and Investigational Dermatology",
      year: 2018,
      ref: "11:491–497",
      pmid: "30410378",
      evidence: "Human study",
      finding:
        "A ceramide-based cream significantly increased skin hydration against a placebo (p < 0.001), outperformed three reference moisturisers at 24 hours and reduced water loss through the skin over the same period.",
    },
  },
  {
    slug: "cocoa-butter",
    name: "Cocoa butter",
    inci: "Theobroma Cacao Seed Butter",
    kind: "Emollient",
    standfirst: "The fat of the cacao bean. Melts at skin temperature, which is the whole point.",
    body: [
      "Cocoa butter is the pale, solid fat pressed from cacao beans, and its defining property is that it melts at almost exactly the temperature of your skin. Solid in the stick, it turns to a smooth, cushioned layer the moment it touches your face — which is why it appears in balms and sticks and almost nothing else.",
      "It is an emollient: it fills the gaps between surface cells, softens them and slows water loss. It is also mildly occlusive, so the comfort lasts. What it is not is an active with a clinical record, and we would rather say that plainly than borrow one.",
      "The research on cocoa and skin is on cocoa polyphenols, mostly in the laboratory, and the one large trial on cocoa butter itself — for stretch marks in pregnancy — found no difference from placebo. In Smooth Talker it is texture and comfort, and it is very good at both.",
    ],
    products: [{ ...P.smoothTalker, as: "Cocoa Butter" }],
    study: {
      authors: "Gasser P, Lati E, Peno-Mazzarino L, Bouzoud D, Allegaert L, Bernaert H.",
      title: "Cocoa polyphenols and their influence on parameters involved in ex vivo skin restructuring.",
      journal: "International Journal of Cosmetic Science",
      year: 2008,
      ref: "30(5):339–345",
      pmid: "18822039",
      evidence: "Laboratory study",
      finding:
        "On samples of human skin kept alive in the laboratory, cocoa polyphenols improved markers of the skin's supporting structure — collagen and the water-binding molecules around it. Polyphenols, not butter; laboratory, not people.",
    },
  },
  {
    slug: "vitamin-e",
    name: "Vitamin E",
    inci: "Tocopherol",
    kind: "Antioxidant",
    standfirst: "Skin's own fat-soluble antioxidant. Nourishing on its own; better in company with vitamin C.",
    body: [
      "Tocopherol is the form of vitamin E your skin stores in its surface oils, where it does the antioxidant work of stopping those oils going rancid under light and air. Applied topically it does the same job: it protects the fats in the outer skin, softens the feel of the surface, and keeps the product itself stable.",
      "It and vitamin C are a pair. Vitamin C works in the watery parts of the skin and vitamin E in the oily parts, and vitamin C regenerates vitamin E once it has done its work — which is why the two so often share a formula.",
      "The best-known research on topical vitamin E measures how skin responds to a controlled UV exposure, because that is a clean way to test an antioxidant. That is research on the ingredient. None of our products is a sunscreen, and nothing in this library should be read as one.",
    ],
    products: [
      { ...P.smoothTalker, as: "Vitamin E" },
      { ...P.doubleTake, as: "Vitamin E" },
    ],
    study: {
      authors: "Lin JY, Selim MA, Shea CR, et al.",
      title: "UV photoprotection by combination topical antioxidants vitamin C and vitamin E.",
      journal: "Journal of the American Academy of Dermatology",
      year: 2003,
      ref: "48(6):866–874",
      pmid: "12789176",
      evidence: "Laboratory study",
      finding:
        "In a controlled skin model, 1% vitamin E alone reduced the redness and cell damage that follow UV exposure, and combined with 15% vitamin C the antioxidant protection was four times greater. A model study, not a trial on people.",
    },
  },
  {
    slug: "hexapeptide-11",
    name: "Hexapeptide-11",
    inci: "Hexapeptide-11",
    kind: "Signal peptide",
    standfirst: "Six amino acids from yeast. Interesting cell biology; the human trials are not written yet.",
    body: [
      "A peptide is a short chain of amino acids — the building blocks of proteins — and a signal peptide is one whose shape happens to tell skin cells to do something. Hexapeptide-11 is six amino acids long and was first isolated from yeast.",
      "In the laboratory it does something genuinely interesting: it switches on the cell's own housekeeping systems, the ones that clear damaged proteins and protect against oxidative stress, and in doing so it kept skin cells from ageing early under stress. That is the mechanism behind every peptide cream that mentions elasticity.",
      "What does not exist yet is a controlled trial of the peptide on people. We use it in Double Take for what the cell biology supports — skin that looks smoother and better rested — and we describe it that way.",
    ],
    products: [{ ...P.doubleTake, as: "Hexapeptide-11" }],
    study: {
      authors: "Sklirou AD, Ralli M, Dominguez M, Papassideri I, Skaltsounis AL, Trougakos IP.",
      title: "Hexapeptide-11 is a novel modulator of the proteostasis network in human diploid fibroblasts.",
      journal: "Redox Biology",
      year: 2015,
      ref: "5:205–215",
      pmid: "25974626",
      evidence: "Laboratory study",
      finding:
        "In human skin fibroblasts, Hexapeptide-11 activated the proteasome, autophagy and the Nrf2 antioxidant pathway, and protected the cells from stress-induced premature senescence. Cells in a dish; no controlled trial on people.",
    },
  },
];

/** The library's own frame — Shelby's render of the reading room. The wide
 *  plate is 2x (3344 px) for retina; the phone crop is a 3:4 portrait of the
 *  centre shelves and the desk. */
export const LIBRARY_HERO = {
  src: "/editorial/rooms/library-shelves.webp",
  mobileSrc: "/editorial/rooms/library-shelves-m.webp",
  alt: "The FOUNDER library: floor-to-ceiling Founder Green shelves of cloth-bound books — FOUND HER, THE FOUNDER COLLECTION, BEAUTY FOR WHAT YOU'RE BUILDING, THE ROOM IS YOURS on their spines — a brass reading lamp, and on the black marble desk a cream journal with a gold F, a FOUNDER pen, a brass key and the three serums on a marble tray; a desert-pink room through the open door.",
};

/** The day the library opened. Real date, not a build timestamp. */
export const LIBRARY_PUBLISHED = "2026-09-10";

export function getLibraryEntry(slug: string): LibraryEntry | undefined {
  return LIBRARY.find((e) => e.slug === slug);
}

/** Every product that appears in the library, with the entries it carries —
 *  in the order the house sells them. */
export function libraryByProduct(): { href: string; name: string; entries: LibraryEntry[] }[] {
  const order = Object.values(P);
  return order
    .map((p) => ({
      href: p.href,
      name: p.name,
      entries: LIBRARY.filter((e) => e.products.some((x) => x.href === p.href)),
    }))
    .filter((p) => p.entries.length > 0);
}

export const pubmedUrl = (pmid: string) => `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
