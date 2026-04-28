// ============================================================
// questions.js — Question bank (fallback / local data)
// ============================================================
// Structure: QUESTIONS[domain][topic][difficulty] = [...questions]
// Each question: { q, options:[4], answer: 0-based index }

import { TOPIC_MAP } from "./topics.js";
import { db } from "./firebase-config.js";
import {
  collection, query, where, getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const QUESTIONS = {
  mathematics: {
    algebra: {
      easy: [
        { q: "Solve for x: 2x + 4 = 10", options: ["2", "3", "4", "5"], answer: 1 },
        { q: "What is the value of x in x + 7 = 12?", options: ["4", "5", "6", "7"], answer: 1 },
        { q: "Simplify: 3(x + 2)", options: ["3x + 2", "3x + 6", "x + 6", "6x"], answer: 1 },
        { q: "If y = 2x and x = 3, what is y?", options: ["5", "6", "7", "8"], answer: 1 },
        { q: "What is 5x when x = 4?", options: ["9", "16", "20", "25"], answer: 2 },
      ],
      medium: [
        { q: "Solve: 3x² - 12 = 0", options: ["x = ±1", "x = ±2", "x = ±3", "x = ±4"], answer: 1 },
        { q: "Factor: x² - 5x + 6", options: ["(x-2)(x-3)", "(x+2)(x+3)", "(x-1)(x-6)", "(x+1)(x-6)"], answer: 0 },
        { q: "Solve: 2x - 3y = 7, x + y = 4", options: ["x=3,y=1", "x=2,y=2", "x=4,y=0", "x=1,y=3"], answer: 0 },
        { q: "What is the discriminant of x² + 4x + 4?", options: ["0", "4", "8", "16"], answer: 0 },
        { q: "Expand: (x + 3)²", options: ["x² + 9", "x² + 3x + 9", "x² + 6x + 9", "x² + 6x + 3"], answer: 2 },
      ],
      hard: [
        { q: "Solve: x³ - 6x² + 11x - 6 = 0", options: ["x=1,2,3", "x=1,2,4", "x=2,3,4", "x=1,3,4"], answer: 0 },
        { q: "Find the sum of roots of 2x² - 5x + 3 = 0", options: ["3/2", "5/2", "2/3", "5/3"], answer: 1 },
        { q: "If α and β are roots of x²- 3x + 2 = 0, find α² + β²", options: ["5", "7", "9", "11"], answer: 0 },
        { q: "Solve: log₂(x) + log₂(x-2) = 3", options: ["x=4", "x=3", "x=2", "x=1"], answer: 0 },
        { q: "Find the range of f(x) = x² + 2x + 1", options: ["[0, ∞)", "(-∞, ∞)", "[-1, ∞)", "(0, ∞)"], answer: 0 },
      ],
    },
    geometry: {
      easy: [
        { q: "Area of a rectangle with length 5 and width 3?", options: ["8", "10", "15", "20"], answer: 2 },
        { q: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], answer: 1 },
        { q: "What is the sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], answer: 1 },
        { q: "Perimeter of a square with side 4?", options: ["8", "12", "16", "20"], answer: 2 },
        { q: "What is the circumference formula for a circle?", options: ["πr²", "2πr", "πd²", "4πr"], answer: 1 },
      ],
      medium: [
        { q: "Area of a circle with radius 7 (use π = 22/7)?", options: ["44", "88", "154", "176"], answer: 2 },
        { q: "In a right triangle, if legs are 3 and 4, hypotenuse is?", options: ["5", "6", "7", "8"], answer: 0 },
        { q: "Volume of cube with side 3?", options: ["9", "18", "27", "36"], answer: 2 },
        { q: "Diagonal of a rectangle 6×8?", options: ["8", "10", "12", "14"], answer: 1 },
        { q: "Area of equilateral triangle with side 6?", options: ["9√3", "12√3", "15√3", "18√3"], answer: 0 },
      ],
      hard: [
        { q: "Surface area of a sphere with radius 5?", options: ["100π", "200π", "300π", "400π"], answer: 0 },
        { q: "Volume of a cone with r=3, h=4?", options: ["12π", "16π", "20π", "24π"], answer: 0 },
        { q: "Angle in a semicircle subtended by diameter is?", options: ["45°", "60°", "90°", "120°"], answer: 2 },
        { q: "Two tangents from external point are always?", options: ["Parallel", "Equal", "Perpendicular", "Unequal"], answer: 1 },
        { q: "Area of a regular hexagon with side a?", options: ["3√3a²/2", "2√3a²", "√3a²", "4√3a²"], answer: 0 },
      ],
    },
    trigonometry: {
      easy: [
        { q: "sin(90°) = ?", options: ["0", "1", "√2/2", "√3/2"], answer: 1 },
        { q: "cos(0°) = ?", options: ["0", "-1", "1", "√3/2"], answer: 2 },
        { q: "tan(45°) = ?", options: ["0", "1", "√3", "1/√3"], answer: 1 },
        { q: "sin²θ + cos²θ = ?", options: ["0", "1", "2", "-1"], answer: 1 },
        { q: "cos(90°) = ?", options: ["1", "0", "-1", "√2"], answer: 1 },
      ],
      medium: [
        { q: "sin(30°) = ?", options: ["√3/2", "1/2", "√2/2", "1"], answer: 1 },
        { q: "If sinθ = 3/5, find cosθ", options: ["4/5", "3/4", "5/4", "5/3"], answer: 0 },
        { q: "tan(60°) = ?", options: ["1", "√2", "√3", "1/√3"], answer: 2 },
        { q: "1 + tan²θ = ?", options: ["sec²θ", "cosec²θ", "cot²θ", "cos²θ"], answer: 0 },
        { q: "cos(60°) = ?", options: ["1/2", "√3/2", "√2/2", "1"], answer: 0 },
      ],
      hard: [
        { q: "sin(A + B) = ?", options: ["sinA cosB - cosA sinB", "sinA cosB + cosA sinB", "cosA cosB - sinA sinB", "cosA cosB + sinA sinB"], answer: 1 },
        { q: "Principal value of sin⁻¹(1/2)?", options: ["π/6", "π/3", "π/4", "π/2"], answer: 0 },
        { q: "cos(2θ) = ?", options: ["2sin²θ - 1", "1 - 2sin²θ", "2cos²θ + 1", "sin²θ - cos²θ"], answer: 1 },
        { q: "sin(3θ) = ?", options: ["3sinθ - 4sin³θ", "4sin³θ - 3sinθ", "3cosθ - 4cos³θ", "3sinθ + 4sin³θ"], answer: 0 },
        { q: "Range of sin function?", options: ["[0,1]", "[-1,1]", "(-1,1)", "(0,1)"], answer: 1 },
      ],
    },
    calculus: {
      easy: [
        { q: "d/dx (x²) = ?", options: ["x", "2x", "2x²", "x/2"], answer: 1 },
        { q: "∫ 1 dx = ?", options: ["0", "x", "x + C", "1/x"], answer: 2 },
        { q: "d/dx (constant) = ?", options: ["1", "constant", "0", "-1"], answer: 2 },
        { q: "d/dx (sin x) = ?", options: ["-cos x", "cos x", "-sin x", "tan x"], answer: 1 },
        { q: "∫ x dx = ?", options: ["x² + C", "x²/2 + C", "2x + C", "x/2 + C"], answer: 1 },
      ],
      medium: [
        { q: "d/dx (eˣ) = ?", options: ["xeˣ", "eˣ", "eˣ⁻¹", "1/eˣ"], answer: 1 },
        { q: "Limit of sin(x)/x as x→0?", options: ["0", "∞", "1", "-1"], answer: 2 },
        { q: "d/dx (ln x) = ?", options: ["1/x", "x", "ln x", "1/ln x"], answer: 0 },
        { q: "∫ eˣ dx = ?", options: ["xeˣ + C", "eˣ + C", "eˣ⁻¹ + C", "eˣ/x + C"], answer: 1 },
        { q: "d/dx (cos x) = ?", options: ["sin x", "-sin x", "cos x", "-cos x"], answer: 1 },
      ],
      hard: [
        { q: "∫₀¹ x² dx = ?", options: ["1/4", "1/3", "1/2", "1"], answer: 1 },
        { q: "d/dx (xⁿ) = ?", options: ["nxⁿ", "nxⁿ⁻¹", "(n-1)xⁿ", "xⁿ⁻¹"], answer: 1 },
        { q: "What is the second derivative of sin(x)?", options: ["cos x", "-cos x", "sin x", "-sin x"], answer: 3 },
        { q: "∫ 1/x dx = ?", options: ["x + C", "-1/x² + C", "ln|x| + C", "1/x² + C"], answer: 2 },
        { q: "Taylor series of eˣ is?", options: ["Σ xⁿ/n!", "Σ (-1)ⁿxⁿ/n!", "Σ xⁿ", "Σ n!xⁿ"], answer: 0 },
      ],
    },
    statistics: {
      easy: [
        { q: "What is the median of 1, 3, 3, 6, 7, 8, 9?", options: ["3", "6", "7", "8"], answer: 1 },
        { q: "What is the mode of 2, 4, 4, 4, 5, 5, 7, 9?", options: ["4", "5", "7", "9"], answer: 0 },
        { q: "Sum of probabilities of all possible events is?", options: ["0", "0.5", "1", "100"], answer: 2 },
        { q: "Mean of 10, 20, 30?", options: ["10", "15", "20", "25"], answer: 2 },
        { q: "What is the range of 5, 10, 15, 20?", options: ["5", "10", "15", "20"], answer: 2 },
      ],
      medium: [
        { q: "Probability of getting a head in a coin toss?", options: ["1/4", "1/2", "3/4", "1"], answer: 1 },
        { q: "What is the standard deviation square called?", options: ["Mean", "Median", "Variance", "Range"], answer: 2 },
        { q: "In a normal distribution, most data is near?", options: ["The edges", "The mean", "Zero", "Infinity"], answer: 1 },
        { q: "Correlation coefficient range is?", options: ["0 to 1", "-1 to 1", "-∞ to ∞", "-10 to 10"], answer: 1 },
        { q: "Standard normal distribution has mean of?", options: ["0", "1", "-1", "100"], answer: 0 },
      ],
      hard: [
        { q: "Probability of getting two 6s when rolling two dice?", options: ["1/6", "1/12", "1/36", "1/18"], answer: 2 },
        { q: "Formula for Permutations nPr is?", options: ["n!/(n-r)!", "n!/r!(n-r)!", "n!/r!", "(n+r)!"], answer: 0 },
        { q: "Central Limit Theorem applies to?", options: ["Small samples", "Large samples", "Biased samples", "Only normal data"], answer: 1 },
        { q: "Z-score of a value at the mean is?", options: ["0", "1", "-1", "Depends on SD"], answer: 0 },
        { q: "Bayes' Theorem relates to?", options: ["Conditional probability", "Simple addition", "Subtraction", "Division"], answer: 0 },
      ],
    },
  },
  science: {
    physics: {
      easy: [
        { q: "SI unit of force is?", options: ["Joule", "Watt", "Newton", "Pascal"], answer: 2 },
        { q: "Speed of light is approximately?", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], answer: 1 },
        { q: "Newton's first law is also known as?", options: ["Law of gravitation", "Law of inertia", "Law of cooling", "Law of motion"], answer: 1 },
        { q: "Unit of electric current?", options: ["Volt", "Watt", "Ohm", "Ampere"], answer: 3 },
        { q: "What does E = mc² represent?", options: ["Gravitational energy", "Mass-energy equivalence", "Kinetic energy", "Thermal energy"], answer: 1 },
      ],
      medium: [
        { q: "A body is thrown upward with velocity 20m/s. Time to reach max height (g=10)?", options: ["1s", "2s", "3s", "4s"], answer: 1 },
        { q: "Ohm's law states V = ?", options: ["I/R", "IR", "I²R", "R/I"], answer: 1 },
        { q: "Work done = Force × ?", options: ["Speed", "Time", "Displacement", "Acceleration"], answer: 2 },
        { q: "The unit of power is?", options: ["Newton", "Joule", "Watt", "Pascal"], answer: 2 },
        { q: "Escape velocity on Earth is approx?", options: ["7.9 km/s", "11.2 km/s", "15 km/s", "5 km/s"], answer: 1 },
      ],
      hard: [
        { q: "Photoelectric effect proves light has?", options: ["Only wave nature", "Only particle nature", "Both wave and particle", "Neither"], answer: 1 },
        { q: "De Broglie wavelength λ = ?", options: ["h/mv", "mv/h", "hm/v", "hv/m"], answer: 0 },
        { q: "In Bohr's model, angular momentum = ?", options: ["nh/π", "nh/2π", "2nh/π", "h/2πn"], answer: 1 },
        { q: "Which law governs ideal gas PV = nRT?", options: ["Boyle's", "Charles'", "Combined gas", "Ideal gas"], answer: 3 },
        { q: "Heisenberg uncertainty principle: ΔxΔp ≥ ?", options: ["h", "h/2π", "h/4π", "2h/π"], answer: 2 },
      ],
    },
    chemistry: {
      easy: [
        { q: "Chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
        { q: "Atomic number of Carbon?", options: ["4", "6", "8", "12"], answer: 1 },
        { q: "Water molecule formula?", options: ["HO", "H₂O", "H₂O₂", "H₃O"], answer: 1 },
        { q: "pH of pure water?", options: ["0", "7", "10", "14"], answer: 1 },
        { q: "Which gas is released in photosynthesis?", options: ["CO₂", "H₂", "O₂", "N₂"], answer: 2 },
      ],
      medium: [
        { q: "Number of electrons in Sodium (Na)?", options: ["10", "11", "12", "13"], answer: 1 },
        { q: "Valency of Oxygen?", options: ["1", "2", "3", "4"], answer: 1 },
        { q: "What type of bond is in NaCl?", options: ["Covalent", "Ionic", "Metallic", "Hydrogen"], answer: 1 },
        { q: "Avogadro's number is?", options: ["6.022×10²³", "6.022×10²²", "6.022×10²⁴", "6.022×10²⁰"], answer: 0 },
        { q: "Which is a noble gas?", options: ["Nitrogen", "Oxygen", "Argon", "Chlorine"], answer: 2 },
      ],
      hard: [
        { q: "Hybridisation of carbon in methane (CH₄)?", options: ["sp", "sp²", "sp³", "sp³d"], answer: 2 },
        { q: "IUPAC name of CH₃-CH₂-OH?", options: ["Methanol", "Ethanol", "Propanol", "Butanol"], answer: 1 },
        { q: "Rate constant unit for first-order reaction?", options: ["mol/L·s", "L/mol·s", "s⁻¹", "L²/mol²·s"], answer: 2 },
        { q: "Le Chatelier's principle applies to?", options: ["Irreversible reactions", "Equilibrium systems", "Exothermic only", "Endothermic only"], answer: 1 },
        { q: "Entropy (S) in a spontaneous process?", options: ["Decreases", "Stays same", "Increases", "Approaches zero"], answer: 2 },
      ],
    },
    biology: {
      easy: [
        { q: "Basic unit of life is?", options: ["Tissue", "Organ", "Cell", "Organism"], answer: 2 },
        { q: "DNA stands for?", options: ["Deoxyribose Nucleic Acid", "Deoxyribonucleic Acid", "Diribonucleic Acid", "Dual Nucleic Acid"], answer: 1 },
        { q: "Photosynthesis occurs in?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Ribosome"], answer: 2 },
        { q: "Powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Chloroplast", "Mitochondria"], answer: 3 },
        { q: "Number of chromosomes in human body cell?", options: ["23", "44", "46", "48"], answer: 2 },
      ],
      medium: [
        { q: "Process of cell division for growth?", options: ["Meiosis", "Mitosis", "Osmosis", "Diffusion"], answer: 1 },
        { q: "Blood group determined by which antigens?", options: ["A, B, O", "A, B, AB", "ABO and Rh", "Rh only"], answer: 2 },
        { q: "Which organ produces insulin?", options: ["Liver", "Pancreas", "Kidney", "Spleen"], answer: 1 },
        { q: "Mendel's law of segregation states?", options: ["Genes blend together", "Alleles separate during gamete formation", "Genes link together", "Dominant always expressed"], answer: 1 },
        { q: "Osmosis involves movement of?", options: ["Solute across membrane", "Water across membrane", "Both solute and water", "Gas molecules"], answer: 1 },
      ],
      hard: [
        { q: "Central dogma of molecular biology is?", options: ["RNA→DNA→Protein", "DNA→RNA→Protein", "Protein→RNA→DNA", "DNA→Protein→RNA"], answer: 1 },
        { q: "Which enzyme unwinds DNA during replication?", options: ["DNA polymerase", "Ligase", "Helicase", "Primase"], answer: 2 },
        { q: "Krebs cycle occurs in?", options: ["Cytoplasm", "Nucleus", "Mitochondrial matrix", "Chloroplast"], answer: 2 },
        { q: "Restriction enzymes cut DNA at?", options: ["Random sites", "Specific palindromic sequences", "AT-rich regions", "GC-rich regions"], answer: 1 },
        { q: "Hardy-Weinberg equilibrium requires?", options: ["Large population, random mating, no mutation", "Small population, natural selection", "Migration and genetic drift", "Mutation and selection"], answer: 0 },
      ],
    },
  },
  english: {
    grammar: {
      easy: [
        { q: "Which is a noun?", options: ["Run", "Beautiful", "Happiness", "Quickly"], answer: 2 },
        { q: "The plural of 'child' is?", options: ["Childs", "Children", "Childes", "Child's"], answer: 1 },
        { q: "Choose the correct sentence:", options: ["She go to school", "She goes to school", "She going to school", "She gone to school"], answer: 1 },
        { q: "'She' is a __ pronoun?", options: ["Personal", "Relative", "Reflexive", "Interrogative"], answer: 0 },
        { q: "Opposite of 'ancient' is?", options: ["Old", "Antique", "Modern", "Historic"], answer: 2 },
      ],
      medium: [
        { q: "Identify the tense: 'He has been sleeping for 3 hours.'", options: ["Simple past", "Past continuous", "Present perfect continuous", "Present continuous"], answer: 2 },
        { q: "Choose the passive voice: 'The dog bit the man.'", options: ["The man bit the dog", "The man is bitten by the dog", "The man was bitten by the dog", "The man has bitten the dog"], answer: 2 },
        { q: "Which is a conjunction?", options: ["Beautiful", "Although", "Quickly", "Table"], answer: 1 },
        { q: "Identify the gerund: 'Swimming is healthy.'", options: ["Swimming", "is", "healthy", "None"], answer: 0 },
        { q: "Correct the error: 'Neither of the boys were present'", options: ["were is correct", "Change were to was", "Change Neither to Both", "No error"], answer: 1 },
      ],
      hard: [
        { q: "'I wish I were a bird.' This uses?", options: ["Indicative mood", "Imperative mood", "Subjunctive mood", "Conditional mood"], answer: 2 },
        { q: "A dangling modifier occurs when?", options: ["A modifier is too long", "Modifier doesn't logically modify any word", "A phrase is repeated", "Subject is unclear"], answer: 1 },
        { q: "Choose the correct punctuation: 'The boy who came yesterday __ has left.'", options: [", has left.", "has left.", ", has left,", "— has left"], answer: 1 },
        { q: "An oxymoron is?", options: ["Extended metaphor", "Two contradictory terms together", "Exaggeration for effect", "Direct comparison"], answer: 1 },
        { q: "'The pen is mightier than the sword' is an example of?", options: ["Metaphor", "Simile", "Hyperbole", "Personification"], answer: 0 },
      ],
    },
    vocabulary: {
      easy: [
        { q: "Synonym for 'happy'?", options: ["Sad", "Angry", "Joyful", "Tired"], answer: 2 },
        { q: "Antonym for 'brave'?", options: ["Strong", "Cowardly", "Bold", "Fierce"], answer: 1 },
        { q: "What does 'benevolent' mean?", options: ["Cruel", "Kind", "Lazy", "Proud"], answer: 1 },
        { q: "What is a 'manuscript'?", options: ["A handwritten text", "A painting", "A sculpture", "A song"], answer: 0 },
        { q: "Plural of 'criterion' is?", options: ["Criterions", "Criterias", "Criteria", "Criterium"], answer: 2 },
      ],
      medium: [
        { q: "'Ubiquitous' means?", options: ["Rare", "Present everywhere", "Invisible", "Ancient"], answer: 1 },
        { q: "Word for 'fear of water'?", options: ["Arachnophobia", "Claustrophobia", "Aquaphobia", "Hydrophilia"], answer: 2 },
        { q: "'Ephemeral' means?", options: ["Eternal", "Short-lived", "Massive", "Invisible"], answer: 1 },
        { q: "Synonym for 'loquacious'?", options: ["Silent", "Talkative", "Lazy", "Brave"], answer: 1 },
        { q: "'Pragmatic' relates to?", options: ["Idealism", "Practicality", "Romance", "Fantasy"], answer: 1 },
      ],
      hard: [
        { q: "'Sycophant' means?", options: ["A genuine friend", "A flatterer seeking favor", "A critic", "A stranger"], answer: 1 },
        { q: "'Mellifluous' describes?", options: ["A harsh sound", "A pleasant, sweet sound", "An ugly appearance", "A bitter taste"], answer: 1 },
        { q: "Root 'anthrop' means?", options: ["Water", "Earth", "Human", "Life"], answer: 2 },
        { q: "'Equivocal' means?", options: ["Clear and direct", "Having double meaning", "Completely false", "Absolutely true"], answer: 1 },
        { q: "'Sesquipedalian' describes?", options: ["Short simple words", "Long words", "Silent letters", "Compound words"], answer: 1 },
      ],
    },
    comprehension: {
      easy: [
        { q: "A 'theme' in a story is?", options: ["The main character", "The central message", "The setting", "The ending"], answer: 1 },
        { q: "The 'setting' of a book is?", options: ["The plot", "Where/When it takes place", "The characters", "The dialogue"], answer: 1 },
        { q: "A 'protagonist' is the?", options: ["Villain", "Main character", "Sidekick", "Narrator"], answer: 1 },
        { q: "The 'climax' is the?", options: ["Start", "Middle", "Turning point", "Ending"], answer: 2 },
        { q: "An 'autobiography' is written about?", options: ["Someone else", "The author themselves", "A fictional person", "History"], answer: 1 },
      ],
      medium: [
        { q: "What is 'foreshadowing'?", options: ["A look at the past", "Hints about the future", "Describing weather", "Hidden messages"], answer: 1 },
        { q: "An 'allusion' is a?", options: ["Direct comparison", "Reference to other works", "Exaggeration", "Repeating sounds"], answer: 1 },
        { q: "Point of view 'First Person' uses?", options: ["He/She", "I/Me", "They", "It"], answer: 1 },
        { q: "The 'conflict' in a story is?", options: ["The solution", "The struggle", "The climax", "The resolution"], answer: 1 },
        { q: "A 'metaphor' is a?", options: ["Comparison with 'like/as'", "Direct comparison without 'like/as'", "Animal trait given to human", "Exaggeration"], answer: 1 },
      ],
      hard: [
        { q: "'Irony' occurs when?", options: ["Expectation matches reality", "Expectation differs from reality", "The story ends happily", "The hero wins"], answer: 1 },
        { q: "Which is an 'allegory'?", options: ["Literal story", "Story with hidden symbolic meaning", "Poem with no rhyme", "Short joke"], answer: 1 },
        { q: "In literature, 'Diction' refers to?", options: ["Sentence structure", "Choice of words", "The plot", "Character growth"], answer: 1 },
        { q: "What is an 'Archetype'?", options: ["A modern character", "A universal symbol or pattern", "The villain", "A typo"], answer: 1 },
        { q: "'Stream of Consciousness' focuses on?", options: ["Physical actions", "Character's flow of thoughts", "Nature", "Dialogue only"], answer: 1 },
      ],
    },
    writing: {
      easy: [
        { q: "Which is used to start a sentence?", options: ["Small letter", "Capital letter", "Number", "Comma"], answer: 1 },
        { q: "Which is for ending a question?", options: [".", "?", "!", ","], answer: 1 },
        { q: "A 'paragraph' should have?", options: ["One word", "One main idea", "No full stops", "Different font"], answer: 1 },
        { q: "What is a 'Draft'?", options: ["Final copy", "Preliminary version", "The waste", "The title"], answer: 1 },
        { q: "Which is a 'Heading'?", options: ["Bottom text", "Title at the top", "Page number", "Margin"], answer: 1 },
      ],
      medium: [
        { q: "An 'Introduction' should contain?", options: ["The conclusion", "A thesis statement/hook", "Final thoughts", "Reference list"], answer: 1 },
        { q: "In formal letters, we use?", options: ["Slang", "Formal language", "Emojis", "Shortcuts"], answer: 1 },
        { q: "A 'Transition' word is?", options: ["However", "Blue", "Jump", "Table"], answer: 0 },
        { q: "The 'Body' of an essay contains?", options: ["Only pictures", "Detailed arguments", "Contact info", "Glossary"], answer: 1 },
        { q: "Which is a 'Bibliography'?", options: ["List of sources", "List of names", "Character list", "Ending"], answer: 0 },
      ],
      hard: [
        { q: "'Plagiarism' is?", options: ["Original writing", "Copying work without credit", "Creative writing", "Editing"], answer: 1 },
        { q: "An 'abstract' is a?", options: ["Long book", "Brief summary of a paper", "Detailed report", "Sketch"], answer: 1 },
        { q: "The 'Active Voice' is preferred because?", options: ["It's longer", "It's more direct/clear", "It sounds fancy", "It's easier to write"], answer: 1 },
        { q: "A 'Colloquialism' is?", options: ["Formal word", "Informal/Slang term", "Scientific name", "Myth"], answer: 1 },
        { q: "'Juxtaposition' in writing is?", options: ["Adding color", "Placing things together for contrast", "Ending a story", "Rhyming"], answer: 1 },
      ],
    },
  },
  computer: {
    programming: {
      easy: [
        { q: "What does HTML stand for?", options: ["HyperText Markup Language", "High Text Machine Language", "Hyper Transfer Markup Language", "HyperText Machine Link"], answer: 0 },
        { q: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Core Processing Utility", "Central Program Unit"], answer: 0 },
        { q: "Which is a programming language?", options: ["HTML", "HTTP", "Python", "CSS"], answer: 2 },
        { q: "What symbol is used for comments in Python?", options: ["//", "/*", "#", "--"], answer: 2 },
        { q: "Binary base is?", options: ["2", "8", "10", "16"], answer: 0 },
      ],
      medium: [
        { q: "O(n log n) is the complexity of which sort?", options: ["Bubble sort", "Selection sort", "Merge sort", "Insertion sort"], answer: 2 },
        { q: "What is a stack data structure?", options: ["FIFO", "LIFO", "Random access", "Priority based"], answer: 1 },
        { q: "Which keyword creates a class in Java?", options: ["struct", "define", "class", "object"], answer: 2 },
        { q: "What does OOP stand for?", options: ["Object Oriented Programming", "Open Object Platform", "Output Oriented Process", "Object Ordering Protocol"], answer: 0 },
        { q: "Which HTML tag is for hyperlinks?", options: ["<link>", "<url>", "<a>", "<href>"], answer: 2 },
      ],
      hard: [
        { q: "Time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"], answer: 2 },
        { q: "A hash collision is resolved by?", options: ["Binary search", "Chaining or open addressing", "Bubble sort", "Stack overflow"], answer: 1 },
        { q: "Which design pattern is Singleton?", options: ["Structural", "Behavioral", "Creational", "Functional"], answer: 2 },
        { q: "Deadlock requires which condition?", options: ["Single resource only", "Circular wait", "Unlimited resources", "No waiting"], answer: 1 },
        { q: "CAP theorem states a distributed system cannot guarantee all of?", options: ["Speed, Accuracy, Availability", "Consistency, Availability, Partition tolerance", "Safety, Liveness, Fairness", "Durability, Isolation, Atomicity"], answer: 1 },
      ],
    },
    networking: {
      easy: [
        { q: "What does IP stand for?", options: ["Internet Protocol", "Internal Process", "Internet Program", "Input Port"], answer: 0 },
        { q: "Default port for HTTP?", options: ["21", "22", "80", "443"], answer: 2 },
        { q: "DNS resolves?", options: ["IP to MAC", "Domain to IP", "IP to email", "Port to service"], answer: 1 },
        { q: "TCP stands for?", options: ["Transfer Control Protocol", "Transmission Control Protocol", "Text Communication Protocol", "Terminal Control Protocol"], answer: 1 },
        { q: "Wi-Fi is a type of?", options: ["Wired network", "Wireless network", "Virtual network", "Optical network"], answer: 1 },
      ],
      medium: [
        { q: "OSI model has how many layers?", options: ["4", "5", "6", "7"], answer: 3 },
        { q: "HTTPS uses which port?", options: ["80", "443", "8080", "3000"], answer: 1 },
        { q: "Subnetting divides a network into?", options: ["Smaller networks", "Larger networks", "Identical copies", "Virtual LANs only"], answer: 0 },
        { q: "Which protocol assigns IP addresses automatically?", options: ["DNS", "DHCP", "FTP", "HTTP"], answer: 1 },
        { q: "Ping uses which protocol?", options: ["TCP", "UDP", "ICMP", "HTTP"], answer: 2 },
      ],
      hard: [
        { q: "BGP is used for?", options: ["Within LAN routing", "Between autonomous systems routing", "Email routing", "DNS lookup"], answer: 1 },
        { q: "Three-way handshake is: SYN → ?", options: ["SYN-ACK → ACK", "ACK → SYN-ACK", "SYN → ACK", "FIN → ACK"], answer: 0 },
        { q: "IPv6 address length?", options: ["32-bit", "64-bit", "128-bit", "256-bit"], answer: 2 },
        { q: "VLAN operates at which OSI layer?", options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"], answer: 1 },
        { q: "TLS provides?", options: ["Routing", "Encryption and authentication", "IP assignment", "Name resolution"], answer: 1 },
      ],
    },
    database: {
      easy: [
        { q: "What does SQL stand for?", options: ["Simple Query Logic", "Structured Query Language", "Shared Queue List", "Source Query Link"], answer: 1 },
        { q: "Which tool is a Database Management System?", options: ["Chrome", "MySQL", "Excel", "Photoshop"], answer: 1 },
        { q: "A 'Primary Key' must be?", options: ["Unique", "Null", "A string", "Large"], answer: 0 },
        { q: "A 'Row' in a database is also called a?", options: ["Field", "Column", "Record", "Index"], answer: 2 },
        { q: "DBMS is used to?", options: ["Edit photos", "Store and manage data", "Browse web", "Play games"], answer: 1 },
      ],
      medium: [
        { q: "What is a 'Foreign Key'?", options: ["A key to a different room", "A link between two tables", "A hidden password", "An extra column"], answer: 1 },
        { q: "Normalization is used to?", options: ["Add duplicates", "Reduce data redundancy", "Speed up internet", "Create backups"], answer: 1 },
        { q: "Which SQL command deletes data?", options: ["REMOVE", "DROP", "DELETE", "ERASE"], answer: 2 },
        { q: "A 'Join' operation combines?", options: ["Files", "Folders", "Rows from two tables", "Indices"], answer: 2 },
        { q: "What does ACID stand for in databases?", options: ["Accuracy, Cost, ID, Data", "Atomicity, Consistency, Isolation, Durability", "Action, Code, Input, Decision", "Access, Control, Info, Dialog"], answer: 1 },
      ],
      hard: [
        { q: "Which is the 3rd Normal Form (3NF) requirement?", options: ["No partial dependency", "No transitive dependency", "No repeating groups", "No primary key"], answer: 1 },
        { q: "A B-Tree index is best for?", options: ["Searching specific names", "Range queries", "Storing images", "Deleting all data"], answer: 1 },
        { q: "What is Sharding?", options: ["Deleting a table", "Splitting data across multiple servers", "Combining databases", "Creating a view"], answer: 1 },
        { q: "A Transaction in SQL ends with?", options: ["COMMIT or ROLLBACK", "SAVE or DELETE", "OPEN or CLOSE", "START or STOP"], answer: 0 },
        { q: "NoSQL databases are generally?", options: ["Relational", "Schema-less", "Only for tiny data", "Offline only"], answer: 1 },
      ],
    },
    os: {
      easy: [
        { q: "Which is an Operating System?", options: ["Monitor", "Windows", "Office 365", "Google"], answer: 1 },
        { q: "What is the 'Kernel'?", options: ["A hardware part", "The core of the OS", "A file name", "A browser"], answer: 1 },
        { q: "A 'Process' is a?", options: ["Static file", "Program in execution", "Folder", "Keyboard"], answer: 1 },
        { q: "Which key restarts the computer?", options: ["F1", "Reset button", "F5", "Enter"], answer: 1 },
        { q: "What does GUI stand for?", options: ["General User Info", "Graphical User Interface", "Global User Input", "Group User Interface"], answer: 1 },
      ],
      medium: [
        { q: "What is 'Virtual Memory'?", options: ["Physical RAM", "Using disk space as RAM", "A flash drive", "Cloud storage"], answer: 1 },
        { q: "Paging is a?", options: ["Memory management scheme", "Printing tool", "Hardware driver", "Security patch"], answer: 0 },
        { q: "A 'Deadlock' occurs when?", options: ["Internet is slow", "Processes wait for each other", "A virus enters", "Power goes out"], answer: 1 },
        { q: "Which part schedules processes?", options: ["Memory Manager", "Printers", "CPU Scheduler", "Graphics Card"], answer: 2 },
        { q: "What is 'Multitasking'?", options: ["Running one app", "Running several apps at once", "Large screen", "Fast typing"], answer: 1 },
      ],
      hard: [
        { q: "Banker's Algorithm is used for?", options: ["Sorting", "Deadlock avoidance", "Searching", "Printing"], answer: 1 },
        { q: "Which is a non-preemptive scheduling?", options: ["Round Robin", "First-Come-First-Served", "Shortest Remaining Time", "Priority"], answer: 1 },
        { q: "The 'Thrashing' phenomenon occurs due to?", options: ["Disk failure", "Excessive paging", "Low CPU speed", "Large files"], answer: 1 },
        { q: "Semaphores are used for?", options: ["Memory allocation", "Process synchronization", "Disk scheduling", "Networking"], answer: 1 },
        { q: "Dual-mode operation includes?", options: ["Real and Fake", "User and Kernel mode", "Input and Output", "Fast and Slow"], answer: 1 },
      ],
    },
  },
  sst: {
    history: {
      easy: [
        { q: "Who was the first President of India?", options: ["Jawaharlal Nehru", "Dr. B.R. Ambedkar", "Dr. Rajendra Prasad", "Sardar Patel"], answer: 2 },
        { q: "India gained independence in?", options: ["1945", "1946", "1947", "1948"], answer: 2 },
        { q: "The French Revolution began in?", options: ["1776", "1789", "1800", "1815"], answer: 1 },
        { q: "The Battle of Plassey was fought in?", options: ["1757", "1764", "1847", "1857"], answer: 0 },
        { q: "Who discovered America?", options: ["Vasco da Gama", "Columbus", "Magellan", "Marco Polo"], answer: 1 },
      ],
      medium: [
        { q: "The Non-Cooperation Movement was launched in?", options: ["1919", "1920", "1921", "1922"], answer: 1 },
        { q: "Partition of Bengal occurred in?", options: ["1901", "1905", "1910", "1915"], answer: 1 },
        { q: "Which treaty ended World War I?", options: ["Treaty of Versailles", "Treaty of Paris", "Treaty of Westphalia", "Treaty of Utrecht"], answer: 0 },
        { q: "The Dandi March was a protest against?", options: ["Partition", "Salt tax", "Jallianwala Bagh", "Rowlatt Act"], answer: 1 },
        { q: "Simon Commission was boycotted because?", options: ["It had no Indians", "It supported partition", "It raised taxes", "It banned protests"], answer: 0 },
      ],
      hard: [
        { q: "Permanent Settlement of 1793 was introduced by?", options: ["Wellesley", "Clive", "Cornwallis", "Dalhousie"], answer: 2 },
        { q: "The Poona Pact (1932) was between Ambedkar and?", options: ["Nehru", "Jinnah", "Gandhi", "Tilak"], answer: 2 },
        { q: "Cabinet Mission Plan was proposed in?", options: ["1942", "1944", "1946", "1947"], answer: 2 },
        { q: "Subsidiary Alliance system was devised by?", options: ["Cornwallis", "Dalhousie", "Wellesley", "Hastings"], answer: 2 },
        { q: "The Berlin Wall fell in?", options: ["1987", "1988", "1989", "1990"], answer: 2 },
      ],
    },
    geography: {
      easy: [
        { q: "Longest river in the world?", options: ["Amazon", "Nile", "Ganges", "Mississippi"], answer: 1 },
        { q: "Highest mountain in the world?", options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"], answer: 2 },
        { q: "Capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], answer: 2 },
        { q: "Tropic of Cancer passes through?", options: ["India", "Pakistan", "Sri Lanka", "Nepal"], answer: 0 },
        { q: "Largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
      ],
      medium: [
        { q: "Monsoon in India originates from?", options: ["Bay of Bengal only", "Arabian Sea only", "Both Bay of Bengal and Arabian Sea", "Indian Ocean only"], answer: 2 },
        { q: "Which soil is best for cotton cultivation?", options: ["Alluvial", "Red", "Black/Regur", "Laterite"], answer: 2 },
        { q: "International Date Line passes through?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], answer: 2 },
        { q: "Deccan Plateau is bounded by which rivers?", options: ["Ganga and Yamuna", "Godavari and Krishna", "Mahanadi and Tapti", "Mahanadi and Narmada"], answer: 3 },
        { q: "Ozone layer is in which atmospheric layer?", options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], answer: 1 },
      ],
      hard: [
        { q: "Koppen climate classification 'Aw' represents?", options: ["Tropical rainforest", "Tropical savanna", "Semi-arid steppe", "Mediterranean"], answer: 1 },
        { q: "Demographic transition model's 4th stage is?", options: ["High birth, high death", "High birth, low death", "Low birth, low death", "Low birth, high death"], answer: 2 },
        { q: "The term 'Archipelago' means?", options: ["Landlocked area", "Chain of islands", "Mountain range", "Desert region"], answer: 1 },
        { q: "Humboldt Current flows along?", options: ["East coast of Africa", "West coast of South America", "East coast of Australia", "Gulf of Mexico"], answer: 1 },
        { q: "Laterite soil formation process is called?", options: ["Calcification", "Gleization", "Laterization/Ferrallitization", "Podzolization"], answer: 2 },
      ],
    },
    civics: {
      easy: [
        { q: "Who is the 'Father of Indian Constitution'?", options: ["Nehru", "Ambedkar", "Gandhi", "Prasad"], answer: 1 },
        { q: "The minimum age to vote in India is?", options: ["16", "18", "21", "25"], answer: 1 },
        { q: "How many Fundamental Rights are there in India?", options: ["5", "6", "7", "10"], answer: 1 },
        { q: "Who is the head of the Indian State?", options: ["PM", "President", "CJ", "Governor"], answer: 1 },
        { q: "The Rajya Sabha is also known as?", options: ["Lower House", "Upper House", "Local House", "State House"], answer: 1 },
      ],
      medium: [
        { q: "What is 'Secularism'?", options: ["Preference for one religion", "Separation of state and religion", "No religion allowed", "Government runs temples"], answer: 1 },
        { q: "The President is elected for how many years?", options: ["4", "5", "6", "10"], answer: 1 },
        { q: "Which article allows Constitutional Remedies?", options: ["Art 14", "Art 21", "Art 32", "Art 44"], answer: 2 },
        { q: "The 'Gram Panchayat' is at which level?", options: ["Village", "District", "State", "City"], answer: 0 },
        { q: "A 'Money Bill' can only be introduced in?", options: ["Rajya Sabha", "Lok Sabha", "High Court", "Supreme Court"], answer: 1 },
      ],
      hard: [
        { q: "The concept of 'Public Interest Litigation' (PIL) came from?", options: ["UK", "Canada", "USA", "Australia"], answer: 2 },
        { q: "Which Schedule lists official languages?", options: ["7th", "8th", "9th", "10th"], answer: 1 },
        { q: "The 'Doctrine of Pleasure' relates to?", options: ["Article 311", "Article 310", "Article 320", "Article 356"], answer: 1 },
        { q: "Who can initiate impeachment of the President?", options: ["Only Lok Sabha", "Only Rajya Sabha", "Either House", "The Cabinet"], answer: 2 },
        { q: "The 73rd Amendment relates to?", options: ["Urban local bodies", "Panchayati Raj", "Anti-defection", "Fundamental Duties"], answer: 1 },
      ],
    },
    economics: {
      easy: [
        { q: "What is currency in India?", options: ["Dollar", "Rupee", "Euro", "Yen"], answer: 1 },
        { q: "Banks provide __ on deposits.", options: ["Tax", "Interest", "Penalty", "Bill"], answer: 1 },
        { q: "Which tool is used for digital payments?", options: ["UPI", "Post Office", "Paper check only", "Manual entry"], answer: 0 },
        { q: "When prices rise, it is called?", options: ["Deflation", "Inflation", "Saturation", "Growth"], answer: 1 },
        { q: "GDP stands for?", options: ["Gross Domestic Product", "General Data Plan", "Global Daily Price", "Grand Domestic Profit"], answer: 0 },
      ],
      medium: [
        { q: "The primary sector includes?", options: ["Banking", "Agriculture", "Manufacturing", "Tourism"], answer: 1 },
        { q: "Who issues currency notes in India?", options: ["SBI", "RBI", "Government directly", "Ministry of Finance"], answer: 1 },
        { q: "A 'Mixed Economy' is?", options: ["Only private", "Only public", "Both public and private", "Zero tax"], answer: 2 },
        { q: "Sustainable development means?", options: ["Fast growth", "Growth for current and future generations", "Only rich growth", "Only industrial growth"], answer: 1 },
        { q: "The 'World Bank' headquarter is in?", options: ["Geneva", "New York", "Washington D.C.", "London"], answer: 2 },
      ],
      hard: [
        { q: "Human Development Index (HDI) is calculated by?", options: ["World Bank", "IMF", "UNDP", "UNESCO"], answer: 2 },
        { q: "What is 'Stagflation'?", options: ["High inflation and high growth", "High inflation and low growth", "Low inflation and low growth", "Zero inflation"], answer: 1 },
        { q: "The 'Law of Demand' implies?", options: ["Price ↑, Demand ↑", "Price ↑, Demand ↓", "Price equals Demand", "Price has no effect"], answer: 1 },
        { q: "A 'Fiscal Deficit' is?", options: ["Export > Import", "Expenditure > Revenue", "Inflation > Growth", "Taxes too high"], answer: 1 },
        { q: "The term 'Capitalist Economy' refers to?", options: ["Market driven", "Government driven", "Barter based", "Primitive"], answer: 0 },
      ],
    },
  },
  hindi: {
    "grammar-hi": {
      easy: [
        { q: "संज्ञा किसे कहते हैं?", options: ["क्रिया को", "किसी व्यक्ति, स्थान, वस्तु के नाम को", "विशेषण को", "सर्वनाम को"], answer: 1 },
        { q: "'राम खाना खाता है' में क्रिया कौन सी है?", options: ["राम", "खाना", "खाता है", "है"], answer: 2 },
        { q: "'सुंदर' किस शब्द भेद का उदाहरण है?", options: ["संज्ञा", "सर्वनाम", "विशेषण", "क्रिया"], answer: 2 },
        { q: "हिंदी वर्णमाला में कितने स्वर होते हैं?", options: ["10", "11", "12", "13"], answer: 1 },
        { q: "'वे' किस सर्वनाम का उदाहरण है?", options: ["उत्तम पुरुष", "मध्यम पुरुष", "अन्य पुरुष", "निजवाचक"], answer: 2 },
      ],
      medium: [
        { q: "'राम ने सेब खाया' में कारक कौन सा है?", options: ["कर्ता कारक", "कर्म कारक", "करण कारक", "संप्रदान कारक"], answer: 0 },
        { q: "निम्न में तत्सम शब्द कौन सा है?", options: ["आग", "दूध", "अग्नि", "पानी"], answer: 2 },
        { q: "'जो परिश्रम करता है वह सफल होता है' – इसमें उपवाक्य है?", options: ["सरल वाक्य", "संयुक्त वाक्य", "मिश्र वाक्य", "जटिल वाक्य"], answer: 2 },
        { q: "संधि विच्छेद: 'महर्षि'?", options: ["महा + ऋषि", "मह + ऋषि", "महा + रिषि", "मही + ऋषि"], answer: 0 },
        { q: "'सूर्य' का पर्यायवाची कौन सा है?", options: ["शशि", "दिनकर", "निशा", "तारा"], answer: 1 },
      ],
      hard: [
        { q: "'वह काम करता है' में वाच्य है?", options: ["कर्तृवाच्य", "कर्मवाच्य", "भाववाच्य", "कोई नहीं"], answer: 0 },
        { q: "रस के कितने प्रकार होते हैं?", options: ["7", "8", "9", "11"], answer: 2 },
        { q: "छंद 'दोहा' में कितनी मात्राएँ होती हैं?", options: ["16 + 11", "13 + 11", "24 + 26", "16 + 14"], answer: 1 },
        { q: "'जहाँ उपमेय में उपमान का आरोप हो' वह अलंकार?", options: ["उपमा", "रूपक", "उत्प्रेक्षा", "अनुप्रास"], answer: 1 },
        { q: "'यमक' अलंकार में क्या होता है?", options: ["एक ही शब्द अलग अर्थों में आए", "तुलना की जाए", "विरोधाभास हो", "अनुप्रास हो"], answer: 0 },
      ],
    },
    literature: {
      easy: [
        { q: "साहित्य की सबसे प्राचीन विधा कौन सी है?", options: ["कविता", "कहानी", "नाटक", "उपन्यास"], answer: 0 },
        { q: "कबीर किस काल के कवि थे?", options: ["आदिकाल", "भक्तिकल", "रीतिकाल", "आधुनीक काल"], answer: 1 },
        { q: "'गबन' किसकी रचना है?", options: ["निराला", "मुंशी प्रेमचंद", "प्रसाद", "महादेवी"], answer: 1 },
        { q: "तुलसीदास ने क्या लिखा?", options: ["महाभारत", "रामचरितमानस", "गीता", "रामायण"], answer: 1 },
        { q: "सूरदास किसके भक्त थे?", options: ["राम", "कृष्ण", "शिव", "विष्णु"], answer: 1 },
      ],
      medium: [
        { q: "छायावाद के चार स्तंभों में कौन नहीं है?", options: ["पंत", "प्रसाद", "बच्चन", "महादेवी"], answer: 2 },
        { q: "'कामायनी' महाकाव्य के लेखक?", options: ["निराला", "प्रसाद", "पंत", "महादेवी"], answer: 1 },
        { q: "भक्तिकाल की सगुण धारा के कवि?", options: ["कबीर", "तुलसी", "जायसी", "रहीम"], answer: 1 },
        { q: "'मधुशाला' किसकी कृति है?", options: ["बच्चन", "दिनकर", "निराला", "प्रसाद"], answer: 0 },
        { q: "साहित्य अकादमी पुरस्कार की स्थापना कब हुई?", options: ["1947", "1954", "1960", "1970"], answer: 1 },
      ],
      hard: [
        { q: "रीतिकाल को 'श्रृंगार काल' किसने कहा?", options: ["शुक्ल", "मिश्र बंधु", "विश्वनाथ प्रसाद मिश्र", "नगेन्द्र"], answer: 2 },
        { q: "'अंधा युग' किसकी रचना है?", options: ["मुक्तिबोध", "धर्मवीर भारती", "अज्ञेय", "दिनकर"], answer: 1 },
        { q: "प्रयोगवाद के प्रवर्तक कौन हैं?", options: ["प्रसाद", "अज्ञेय", "निराला", "पंत"], answer: 1 },
        { q: "हिंदी साहित्य का प्रथम इतिहास किसने लिखा?", options: ["शर्मा", "ग्रियर्सन", "गार्सा द तासी", "शुक्ल"], answer: 2 },
        { q: "भ्रमरगीत परंपरा के कवि?", options: ["रहीम", "सूरदास", "तुलसी", "कबीर"], answer: 1 },
      ],
    },
    "comprehension-hi": {
      easy: [
        { q: "गद्यांश का मुख्य शीर्षक क्या होना चाहिए?", options: ["विषय के अनुसार", "लेखक के अनुसार", "छोटा", "बड़ा"], answer: 0 },
        { q: "पठित गद्यांश में 'सत्य' का विलोम?", options: ["झूठ", "असत्य", "कड़वा", "मीठा"], answer: 1 },
        { q: "लेखक के अनुसार सफलता का आधार?", options: ["पैसा", "कठिन परिश्रम", "भाग्य", "आराम"], answer: 1 },
        { q: "पर्यावरण का अर्थ क्या है?", options: ["पेड़", "पानी", "चारों ओर का घेरा", "वायु"], answer: 2 },
        { q: "शिक्षा का महत्व क्या है?", options: ["ज्ञान प्राप्त करना", "नौकरी", "डिग्री", "पैसा"], answer: 0 },
      ],
      medium: [
        { q: "अनुच्छेद के अनुसार 'परोपकार' का महत्व?", options: ["स्वार्थ", "दूसरों की मदद", "पैसे बचाना", "प्रसिद्धि"], answer: 1 },
        { q: "गद्यांश का मुख्य भाव क्या है?", options: ["क्रोध", "उत्साह", "करुणा", "शांति"], answer: 1 },
        { q: "देशभक्ति का सच्चा अर्थ?", options: ["युद्ध", "देश की सेवा", "ध्वज फहराना", "भाषण देना"], answer: 1 },
        { q: "समय का सदुपयोग क्यों जरूरी है?", options: ["लक्ष्य प्राप्ति के लिए", "आराम के लिए", "खेल के लिए", "नींद के लिए"], answer: 0 },
        { q: "अनुशासन से क्या लाभ है?", options: ["डर", "सफलता और व्यवस्था", "कठिनाई", "प्रतिबंध"], answer: 1 },
      ],
      hard: [
        { q: "लेखक की विचारधारा क्या है?", options: ["रूढ़िवादी", "प्रगतिशील", "उदासीन", "भ्रामक"], answer: 1 },
        { q: "गद्यांश में प्रयुक्त 'आध्यात्मिक' का अर्थ?", options: ["धार्मिक", "आत्मा से संबंधित", "भौतिक", "मानसिक"], answer: 1 },
        { q: "सांस्कृतिक विरासत का संरक्षण क्यों?", options: ["पहचान के लिए", "दिखावे के लिए", "दबाव के लिए", "आर्थिक लाभ"], answer: 0 },
        { q: "वैज्ञानिक प्रगति के खतरे?", options: ["आराम", "नैतिक पतन और विनाश", "सुविधा", "ज्ञान"], answer: 1 },
        { q: "मानवता का सर्वोच्च धर्म?", options: ["अहिंसा", "प्रेम और सेवा", "युद्ध", "ज्ञान"], answer: 1 },
      ],
    },
  },
};

const DIFFICULTIES = ["easy", "medium", "hard"];

function normalizeQuestionBank() {
  Object.keys(TOPIC_MAP).forEach((domain) => {
    if (!QUESTIONS[domain]) {
      QUESTIONS[domain] = {};
    }

    TOPIC_MAP[domain].forEach(({ id: topicId }) => {
      if (!QUESTIONS[domain][topicId]) {
        QUESTIONS[domain][topicId] = {};
      }

      DIFFICULTIES.forEach((level) => {
        const questions = QUESTIONS[domain][topicId]?.[level];
        if (!Array.isArray(questions) || questions.length === 0) {
          QUESTIONS[domain][topicId][level] = [
            {
              q: `Placeholder question for ${domain}/${topicId}/${level}`,
              options: ["Option 1", "Option 2", "Option 3", "Option 4"],
              answer: 0,
            },
          ];
          console.warn("questions.js: added placeholder for", domain, topicId, level);
        }
      });
    });
  });
}

normalizeQuestionBank();

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function fetchQuestions(domain, topic, difficulty) {
  let combinedQuestions = [];

  // 1. Get local fallback questions (Case-insensitive)
  const dId = (domain || "").toLowerCase();
  const tId = (topic || "").toLowerCase();
  const diff = (difficulty || "").toLowerCase();

  const localQs = QUESTIONS?.[dId]?.[tId]?.[diff] || [];
  // Standardize local structure to match Firestore (q -> question)
  const standardizedLocal = localQs.map(q => ({
    question: q.q,
    options: q.options,
    answer: q.answer,
    source: 'local'
  }));

  combinedQuestions = [...standardizedLocal];

  // 2. Fetch Firestore questions and merge
  try {
    const q = query(
      collection(db, "questions"),
      where("domain", "==", domain),
      where("topic", "==", topic),
      where("difficulty", "==", difficulty)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const remoteQs = snap.docs.map(d => ({ ...d.data(), id: d.id, source: 'firestore' }));
      combinedQuestions = [...combinedQuestions, ...remoteQs];
    }
  } catch (e) {
    console.warn("fetchQuestions: Firestore retrieval failed, using local only", e);
  }

  // 3. Prevent empty quizzes
  if (combinedQuestions.length === 0) {
    combinedQuestions.push({
      question: `Fallback placeholder for ${domain}/${topic}/${difficulty}`,
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      answer: 0
    });
  }

  // 4. Shuffle and return (no slice(0,5) here, return the full set!)
  return shuffleArray(combinedQuestions);
}
