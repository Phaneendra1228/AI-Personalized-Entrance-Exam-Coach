"""
Seed data script.
Populates the database with 10 domains, subjects, mock tests, and questions.
Run with: python seed.py
"""
import sys
import os
import json

# Ensure imports work
sys.path.insert(0, os.path.dirname(__file__))

from database import engine, SessionLocal, Base
from models import Domain, Subject, MockTest, Question

# Initialize tables
Base.metadata.create_all(bind=engine)

SEED_DATA = {
    "domains": [
        {
            "name": "STEM",
            "description": "Science, Technology, Engineering & Mathematics",
            "icon": "🔬",
            "subjects": [
                {
                    "name": "Mathematics",
                    "description": "Algebra, Calculus, Statistics, and more",
                    "tests": [
                        {
                            "name": "Algebra Fundamentals",
                            "difficulty": "easy",
                            "duration_minutes": 20,
                            "questions": [
                                {"text": "Solve for x: 2x + 6 = 14", "options": ["x = 3", "x = 4", "x = 5", "x = 6"], "correct": 1, "topic": "Algebra", "explanation": "2x = 14 - 6 = 8, so x = 4"},
                                {"text": "What is the value of 3² + 4²?", "options": ["25", "49", "14", "7"], "correct": 0, "topic": "Algebra", "explanation": "3² = 9, 4² = 16, total = 25"},
                                {"text": "Simplify: (x²y)(xy³)", "options": ["x³y⁴", "x²y⁴", "x³y³", "x²y³"], "correct": 0, "topic": "Algebra", "explanation": "Add exponents: x^(2+1) y^(1+3) = x³y⁴"},
                                {"text": "Factor: x² - 9", "options": ["(x-3)(x+3)", "(x-9)(x+1)", "(x+3)²", "(x-3)²"], "correct": 0, "topic": "Factoring", "explanation": "Difference of squares: a² - b² = (a-b)(a+b)"},
                                {"text": "Solve: |2x - 4| = 6", "options": ["x = 5 or x = -1", "x = 5 or x = 1", "x = -5 or x = 1", "x = 4 or x = -2"], "correct": 0, "topic": "Algebra", "explanation": "2x-4=6 → x=5, or 2x-4=-6 → x=-1"},
                            ]
                        },
                        {
                            "name": "Calculus Basics",
                            "difficulty": "medium",
                            "duration_minutes": 30,
                            "questions": [
                                {"text": "What is the derivative of f(x) = 3x²?", "options": ["6x", "3x", "9x²", "6x²"], "correct": 0, "topic": "Derivatives", "explanation": "Using power rule: d/dx(3x²) = 6x"},
                                {"text": "∫x dx = ?", "options": ["x²/2 + C", "x² + C", "2x + C", "x/2 + C"], "correct": 0, "topic": "Integration", "explanation": "Power rule for integration: ∫x^n dx = x^(n+1)/(n+1)"},
                                {"text": "What is lim(x→0) sin(x)/x?", "options": ["1", "0", "∞", "undefined"], "correct": 0, "topic": "Limits", "explanation": "This is a fundamental limit in calculus, equal to 1"},
                                {"text": "Find dy/dx if y = e^(2x)", "options": ["2e^(2x)", "e^(2x)", "2xe^(2x)", "e^x"], "correct": 0, "topic": "Derivatives", "explanation": "Chain rule: d/dx(e^(2x)) = 2e^(2x)"},
                                {"text": "What is the integral of cos(x)?", "options": ["sin(x) + C", "-sin(x) + C", "-cos(x) + C", "cos(x) + C"], "correct": 0, "topic": "Integration", "explanation": "The antiderivative of cos(x) is sin(x)"},
                            ]
                        },
                        {
                            "name": "Advanced Statistics & Probability",
                            "difficulty": "hard",
                            "duration_minutes": 45,
                            "questions": [
                                {"text": "A fair coin is tossed 3 times. What is P(exactly 2 heads)?", "options": ["3/8", "1/8", "1/2", "1/4"], "correct": 0, "topic": "Probability", "explanation": "C(3,2) × (1/2)² × (1/2) = 3/8"},
                                {"text": "What is the standard deviation of {2, 4, 4, 4, 5, 5, 7, 9}?", "options": ["2", "4", "1", "3"], "correct": 0, "topic": "Statistics", "explanation": "Mean=5, variance=4, SD=2"},
                                {"text": "Bayes theorem states P(A|B) equals:", "options": ["P(B|A)P(A)/P(B)", "P(A)P(B)", "P(A∩B)/P(A)", "P(B|A)/P(A)"], "correct": 0, "topic": "Probability", "explanation": "Bayes theorem: P(A|B) = P(B|A)P(A)/P(B)"},
                                {"text": "In a normal distribution, what percentage of data lies within ±1σ?", "options": ["68%", "95%", "99.7%", "50%"], "correct": 0, "topic": "Statistics", "explanation": "The 68-95-99.7 rule: ±1σ covers 68.2%"},
                                {"text": "What is the expected value E[X] of a fair die roll?", "options": ["3.5", "3", "4", "2.5"], "correct": 0, "topic": "Probability", "explanation": "E[X] = (1+2+3+4+5+6)/6 = 3.5"},
                            ]
                        }
                    ]
                },
                {
                    "name": "Physics",
                    "description": "Mechanics, Thermodynamics, Electromagnetism",
                    "tests": [
                        {
                            "name": "Mechanics Basics",
                            "difficulty": "easy",
                            "duration_minutes": 20,
                            "questions": [
                                {"text": "Newton's second law states F = ?", "options": ["ma", "mv", "mg", "m/a"], "correct": 0, "topic": "Newton's Laws", "explanation": "Force = mass × acceleration"},
                                {"text": "What is the SI unit of force?", "options": ["Newton", "Joule", "Watt", "Pascal"], "correct": 0, "topic": "Units", "explanation": "Force is measured in Newtons (N)"},
                                {"text": "An object at rest stays at rest unless acted upon by an external force. This is Newton's:", "options": ["1st Law", "2nd Law", "3rd Law", "Law of Gravity"], "correct": 0, "topic": "Newton's Laws", "explanation": "Newton's First Law: Law of Inertia"},
                                {"text": "What is the acceleration due to gravity on Earth?", "options": ["9.8 m/s²", "8.9 m/s²", "10.8 m/s²", "9.0 m/s²"], "correct": 0, "topic": "Gravity", "explanation": "Standard g = 9.8 m/s² (approximately 10 m/s²)"},
                                {"text": "KE = ?", "options": ["½mv²", "mv", "mgh", "mv²"], "correct": 0, "topic": "Energy", "explanation": "Kinetic Energy = ½ × mass × velocity²"},
                            ]
                        },
                        {
                            "name": "Electromagnetism",
                            "difficulty": "medium",
                            "duration_minutes": 30,
                            "questions": [
                                {"text": "Ohm's law states V = ?", "options": ["IR", "I/R", "I²R", "R/I"], "correct": 0, "topic": "Electricity", "explanation": "Voltage = Current × Resistance"},
                                {"text": "What is the unit of electric charge?", "options": ["Coulomb", "Ampere", "Volt", "Ohm"], "correct": 0, "topic": "Electricity", "explanation": "Charge is measured in Coulombs (C)"},
                                {"text": "Faraday's law relates to:", "options": ["Electromagnetic induction", "Electric charge", "Magnetic poles", "Current flow"], "correct": 0, "topic": "Electromagnetism", "explanation": "Faraday's law describes how changing magnetic fields induce EMF"},
                                {"text": "The speed of light in vacuum is approximately:", "options": ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], "correct": 0, "topic": "Light", "explanation": "c ≈ 3×10⁸ m/s"},
                                {"text": "In a series circuit, the total resistance equals:", "options": ["R1+R2+R3", "1/R1+1/R2", "(R1×R2)/(R1+R2)", "R1-R2"], "correct": 0, "topic": "Circuits", "explanation": "Series resistances add directly: Rtotal = R1 + R2 + ..."},
                            ]
                        },
                        {
                            "name": "Quantum Mechanics",
                            "difficulty": "hard",
                            "duration_minutes": 40,
                            "questions": [
                                {"text": "The Heisenberg Uncertainty Principle states:", "options": ["Δx·Δp ≥ ℏ/2", "E = mc²", "F = ma", "E = hf"], "correct": 0, "topic": "Quantum Mechanics", "explanation": "Position and momentum cannot be simultaneously known exactly"},
                                {"text": "What is the de Broglie wavelength formula?", "options": ["λ = h/p", "λ = hp", "λ = h/E", "λ = p/h"], "correct": 0, "topic": "Wave-Particle Duality", "explanation": "λ = h/p where h is Planck's constant and p is momentum"},
                                {"text": "Schrödinger's cat thought experiment illustrates:", "options": ["Quantum superposition", "Relativity", "Thermodynamics", "Classical mechanics"], "correct": 0, "topic": "Quantum Mechanics", "explanation": "The paradox of quantum superposition at macroscopic scale"},
                                {"text": "Planck's constant h ≈ ?", "options": ["6.626×10⁻³⁴ J·s", "6.626×10³⁴ J·s", "9.11×10⁻³¹ J·s", "1.6×10⁻¹⁹ J·s"], "correct": 0, "topic": "Constants", "explanation": "h ≈ 6.626×10⁻³⁴ J·s"},
                                {"text": "Pauli exclusion principle states:", "options": ["No two fermions can share the same quantum state", "All bosons must share states", "Electrons repel each other", "Protons attract neutrons"], "correct": 0, "topic": "Atomic Structure", "explanation": "No two identical fermions can occupy the same quantum state simultaneously"},
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Humanities",
            "description": "History, Literature, Philosophy, and Linguistics",
            "icon": "📚",
            "subjects": [
                {
                    "name": "World History",
                    "description": "Ancient civilizations to modern times",
                    "tests": [
                        {"name": "Ancient Civilizations", "difficulty": "easy", "duration_minutes": 20, "questions": [
                            {"text": "The Great Wall of China was primarily built to:", "options": ["Protect against northern invasions", "Mark territorial boundaries", "Control trade", "Showcase power"], "correct": 0, "topic": "Ancient China", "explanation": "The Great Wall was built to defend against nomadic invasions from the north"},
                            {"text": "Which river was central to Ancient Egyptian civilization?", "options": ["Nile", "Euphrates", "Indus", "Tigris"], "correct": 0, "topic": "Ancient Egypt", "explanation": "The Nile River provided the fertile land and water for Egyptian civilization"},
                            {"text": "The Colosseum is located in:", "options": ["Rome", "Athens", "Cairo", "Istanbul"], "correct": 0, "topic": "Ancient Rome", "explanation": "The Colosseum was built in Rome around 70-80 AD"},
                            {"text": "The first Olympic games were held in:", "options": ["776 BCE", "490 BCE", "300 BCE", "100 CE"], "correct": 0, "topic": "Ancient Greece", "explanation": "The ancient Olympic Games began in 776 BCE in Olympia, Greece"},
                            {"text": "Mesopotamia means:", "options": ["Land between rivers", "Land of the sun", "Land of pharaohs", "Land of silk"], "correct": 0, "topic": "Ancient Mesopotamia", "explanation": "Mesopotamia is Greek for 'land between rivers' (Euphrates and Tigris)"},
                        ]},
                        {"name": "Modern History", "difficulty": "medium", "duration_minutes": 30, "questions": [
                            {"text": "World War I began in:", "options": ["1914", "1918", "1939", "1900"], "correct": 0, "topic": "World Wars", "explanation": "WWI began on July 28, 1914 following the assassination of Archduke Franz Ferdinand"},
                            {"text": "The French Revolution started in:", "options": ["1789", "1799", "1776", "1804"], "correct": 0, "topic": "Revolutions", "explanation": "The French Revolution began in 1789 with the storming of the Bastille"},
                            {"text": "The Cold War was primarily between:", "options": ["USA and USSR", "USA and China", "UK and Germany", "France and Russia"], "correct": 0, "topic": "Cold War", "explanation": "The Cold War (1947-1991) was a geopolitical rivalry between the USA and Soviet Union"},
                            {"text": "The Berlin Wall fell in:", "options": ["1989", "1991", "1985", "1979"], "correct": 0, "topic": "Cold War", "explanation": "The Berlin Wall fell on November 9, 1989"},
                            {"text": "Nelson Mandela became President of South Africa in:", "options": ["1994", "1990", "1999", "1988"], "correct": 0, "topic": "Post-Colonial History", "explanation": "Mandela became the first Black president of South Africa on May 10, 1994"},
                        ]},
                        {"name": "Historical Analysis", "difficulty": "hard", "duration_minutes": 40, "questions": [
                            {"text": "The Treaty of Westphalia (1648) is significant because it:", "options": ["Established the modern nation-state system", "Ended WWI", "Created the UN", "Started the Crusades"], "correct": 0, "topic": "Political History", "explanation": "The Peace of Westphalia established the principle of national sovereignty"},
                            {"text": "Thucydides is known as the father of:", "options": ["Scientific history", "Philosophy", "Democracy", "Theatre"], "correct": 0, "topic": "Historiography", "explanation": "Thucydides applied rational analysis to historical events in his History of the Peloponnesian War"},
                            {"text": "The Industrial Revolution began in:", "options": ["Britain", "France", "Germany", "USA"], "correct": 0, "topic": "Industrial History", "explanation": "The Industrial Revolution began in Britain in the mid-18th century"},
                            {"text": "Which best describes historiography?", "options": ["The study of how history is written", "A biography of historians", "Ancient manuscripts", "Historical fiction"], "correct": 0, "topic": "Historiography", "explanation": "Historiography examines the methods and development of writing history"},
                            {"text": "The Silk Road primarily connected:", "options": ["China to the Mediterranean", "India to Africa", "Europe to America", "Japan to Korea"], "correct": 0, "topic": "Trade History", "explanation": "The Silk Road was an ancient network of trade routes connecting China to the Mediterranean"},
                        ]}
                    ]
                }
            ]
        },
        {
            "name": "Business and Management",
            "description": "Economics, Marketing, Finance, and Strategy",
            "icon": "💼",
            "subjects": [
                {
                    "name": "Marketing Principles",
                    "description": "Consumer behavior, branding, digital marketing",
                    "tests": [
                        {"name": "Marketing Basics", "difficulty": "easy", "duration_minutes": 20, "questions": [
                            {"text": "The 4 Ps of marketing are Product, Price, Place, and:", "options": ["Promotion", "Profit", "Process", "People"], "correct": 0, "topic": "Marketing Mix", "explanation": "The classic Marketing Mix consists of Product, Price, Place, and Promotion"},
                            {"text": "A target market is:", "options": ["A specific group of consumers a business aims to reach", "A sales goal", "A competitor's market", "A pricing strategy"], "correct": 0, "topic": "Market Segmentation", "explanation": "Target market = specific consumer segment identified for marketing efforts"},
                            {"text": "Brand equity refers to:", "options": ["The value added by a brand name", "Physical assets", "Revenue", "Market share"], "correct": 0, "topic": "Branding", "explanation": "Brand equity is the commercial value derived from consumer perception of a brand name"},
                            {"text": "What is a USP?", "options": ["Unique Selling Proposition", "Universal Sales Plan", "User Service Protocol", "United Selling Party"], "correct": 0, "topic": "Marketing Strategy", "explanation": "USP = what makes a product uniquely better than competitors"},
                            {"text": "SWOT analysis stands for:", "options": ["Strengths, Weaknesses, Opportunities, Threats", "Strategy, Work, Output, Time", "Service, Warranty, Operations, Technology", "Sales, Website, Orders, Traffic"], "correct": 0, "topic": "Strategic Analysis", "explanation": "SWOT helps businesses evaluate their competitive position"},
                        ]},
                        {"name": "Consumer Behavior", "difficulty": "medium", "duration_minutes": 25, "questions": [
                            {"text": "Maslow's Hierarchy of Needs places at the top:", "options": ["Self-actualization", "Safety", "Physiological needs", "Esteem"], "correct": 0, "topic": "Consumer Psychology", "explanation": "Self-actualization is the highest level in Maslow's hierarchy"},
                            {"text": "Cognitive dissonance in marketing refers to:", "options": ["Post-purchase doubt", "Brand confusion", "Product comparison", "Price sensitivity"], "correct": 0, "topic": "Consumer Psychology", "explanation": "Cognitive dissonance occurs when consumers feel doubt after making a purchase decision"},
                            {"text": "Net Promoter Score (NPS) measures:", "options": ["Customer loyalty", "Product quality", "Market share", "Sales volume"], "correct": 0, "topic": "Customer Metrics", "explanation": "NPS measures how likely customers are to recommend a product/service"},
                            {"text": "The buying decision process starts with:", "options": ["Problem recognition", "Information search", "Purchase", "Evaluation"], "correct": 0, "topic": "Decision Making", "explanation": "Consumers first recognize a need or problem before searching for solutions"},
                            {"text": "Price elasticity of demand measures:", "options": ["How demand changes with price changes", "Production cost", "Market size", "Supplier flexibility"], "correct": 0, "topic": "Pricing", "explanation": "Price elasticity = % change in demand / % change in price"},
                        ]},
                        {"name": "Digital Marketing Strategy", "difficulty": "hard", "duration_minutes": 35, "questions": [
                            {"text": "Which metric measures the profitability of ad spending?", "options": ["ROAS", "CTR", "CPM", "CPC"], "correct": 0, "topic": "Digital Advertising", "explanation": "ROAS (Return on Ad Spend) = Revenue from ads / Cost of ads"},
                            {"text": "A conversion funnel's final stage is:", "options": ["Action/Purchase", "Awareness", "Interest", "Desire"], "correct": 0, "topic": "Conversion Optimization", "explanation": "The AIDA model ends with Action (purchase/conversion)"},
                            {"text": "SEO primarily improves:", "options": ["Organic search visibility", "Paid ad performance", "Social media reach", "Email open rates"], "correct": 0, "topic": "SEO", "explanation": "SEO (Search Engine Optimization) improves organic (unpaid) search engine rankings"},
                            {"text": "In A/B testing, what is being compared?", "options": ["Two versions of content", "Two products", "Two markets", "Two time periods"], "correct": 0, "topic": "Analytics", "explanation": "A/B testing compares version A vs version B to determine which performs better"},
                            {"text": "Customer Lifetime Value (CLV) is significant because:", "options": ["It quantifies long-term customer revenue", "It measures acquisition cost", "It tracks only first purchases", "It evaluates discounts"], "correct": 0, "topic": "Customer Metrics", "explanation": "CLV helps businesses understand the total revenue expected from a customer relationship"},
                        ]}
                    ]
                }
            ]
        },
        {
            "name": "Health and Medical Sciences",
            "description": "Biology, Anatomy, Physiology, and Healthcare",
            "icon": "🏥",
            "subjects": [
                {
                    "name": "Human Anatomy",
                    "description": "Body systems, organs, and structure",
                    "tests": [
                        {"name": "Body Systems Basics", "difficulty": "easy", "duration_minutes": 20, "questions": [
                            {"text": "The largest organ in the human body is:", "options": ["Skin", "Liver", "Heart", "Brain"], "correct": 0, "topic": "Human Body", "explanation": "The skin (integumentary system) is the largest organ"},
                            {"text": "How many chambers does the human heart have?", "options": ["4", "2", "3", "6"], "correct": 0, "topic": "Cardiovascular System", "explanation": "The heart has 4 chambers: 2 atria and 2 ventricles"},
                            {"text": "The primary function of red blood cells is to:", "options": ["Transport oxygen", "Fight infection", "Create antibodies", "Regulate temperature"], "correct": 0, "topic": "Blood", "explanation": "RBCs contain hemoglobin which transports oxygen throughout the body"},
                            {"text": "The CNS consists of:", "options": ["Brain and spinal cord", "Brain and nerves", "Heart and brain", "Spine and skull"], "correct": 0, "topic": "Nervous System", "explanation": "The Central Nervous System (CNS) includes the brain and spinal cord"},
                            {"text": "Which vitamin is produced by exposure to sunlight?", "options": ["Vitamin D", "Vitamin C", "Vitamin A", "Vitamin B12"], "correct": 0, "topic": "Nutrition", "explanation": "Skin synthesizes Vitamin D when exposed to UV radiation"},
                        ]},
                        {"name": "Physiology Intermediate", "difficulty": "medium", "duration_minutes": 30, "questions": [
                            {"text": "The normal human resting heart rate is:", "options": ["60-100 bpm", "40-60 bpm", "100-120 bpm", "120-150 bpm"], "correct": 0, "topic": "Cardiovascular", "explanation": "Normal resting heart rate for adults is 60-100 beats per minute"},
                            {"text": "Insulin is produced by the:", "options": ["Pancreas", "Liver", "Kidney", "Thyroid"], "correct": 0, "topic": "Endocrine System", "explanation": "Beta cells in the islets of Langerhans in the pancreas produce insulin"},
                            {"text": "ATP stands for:", "options": ["Adenosine Triphosphate", "Amino Terminal Protein", "Acid Transfer Process", "Active Transport Potential"], "correct": 0, "topic": "Cell Biology", "explanation": "ATP (Adenosine Triphosphate) is the primary energy currency of cells"},
                            {"text": "The blood-brain barrier:", "options": ["Protects the brain from harmful substances", "Speeds up neural signals", "Produces cerebrospinal fluid", "Connects neurons"], "correct": 0, "topic": "Neuroscience", "explanation": "The BBB selectively limits passage of substances between blood and brain"},
                            {"text": "What is the normal blood pH range?", "options": ["7.35-7.45", "6.5-7.0", "7.0-7.8", "8.0-8.5"], "correct": 0, "topic": "Blood Chemistry", "explanation": "Normal blood pH is 7.35-7.45 (slightly alkaline)"},
                        ]},
                        {"name": "Clinical Medicine Concepts", "difficulty": "hard", "duration_minutes": 40, "questions": [
                            {"text": "Type 1 diabetes is characterized by:", "options": ["Autoimmune destruction of beta cells", "Insulin resistance", "Excess insulin production", "Glucagon deficiency"], "correct": 0, "topic": "Endocrinology", "explanation": "Type 1 DM is an autoimmune condition destroying insulin-producing beta cells"},
                            {"text": "The Frank-Starling mechanism states:", "options": ["Greater preload → stronger contraction", "Less preload → stronger contraction", "Afterload determines heart rate", "Blood pressure controls stroke volume"], "correct": 0, "topic": "Cardiac Physiology", "explanation": "The heart contracts more forcefully when stretched by greater filling volume"},
                            {"text": "MRSA stands for:", "options": ["Methicillin-Resistant Staphylococcus Aureus", "Multi-Resistant Streptococcal Antigen", "Methyl-Resistant Saline Antigen", "Multi-Rod Staphyloid Antigen"], "correct": 0, "topic": "Microbiology", "explanation": "MRSA is a staph infection resistant to many common antibiotics"},
                            {"text": "The APGAR score measures:", "options": ["Newborn health at birth", "Adult vital signs", "Pediatric pain levels", "Anesthesia depth"], "correct": 0, "topic": "Obstetrics", "explanation": "APGAR (Appearance, Pulse, Grimace, Activity, Respiration) is assessed at 1 and 5 minutes after birth"},
                            {"text": "Sensitivity of a test measures:", "options": ["True positive rate", "True negative rate", "False positive rate", "Specificity"], "correct": 0, "topic": "Epidemiology", "explanation": "Sensitivity = TP/(TP+FN) — how well a test identifies true positives"},
                        ]}
                    ]
                }
            ]
        },
        {"name": "Social Sciences", "description": "Psychology, Sociology, Political Science, Economics", "icon": "🌍", "subjects": [
            {"name": "Psychology", "description": "Human behavior, cognition, and mental processes", "tests": [
                {"name": "Psychology Fundamentals", "difficulty": "easy", "duration_minutes": 20, "questions": [
                    {"text": "Pavlov's famous experiment demonstrated:", "options": ["Classical conditioning", "Operant conditioning", "Observational learning", "Cognitive learning"], "correct": 0, "topic": "Learning Theory", "explanation": "Pavlov conditioned dogs to salivate at a bell by pairing it with food"},
                    {"text": "The id, ego, and superego are concepts from:", "options": ["Freudian theory", "Behaviorism", "Cognitive psychology", "Humanistic psychology"], "correct": 0, "topic": "Psychoanalysis", "explanation": "Sigmund Freud proposed the tripartite model of personality"},
                    {"text": "Maslow placed safety needs at which level?", "options": ["Second", "First", "Third", "Fourth"], "correct": 0, "topic": "Motivation", "explanation": "Safety needs (security, stability) are the second level after physiological needs"},
                    {"text": "The placebo effect demonstrates the power of:", "options": ["Expectation on outcomes", "Actual medication", "Surgery", "Diet"], "correct": 0, "topic": "Research Methods", "explanation": "Placebo effect shows how belief in treatment can produce real physiological changes"},
                    {"text": "Cognitive dissonance theory was proposed by:", "options": ["Leon Festinger", "B.F. Skinner", "Carl Jung", "Abraham Maslow"], "correct": 0, "topic": "Social Psychology", "explanation": "Leon Festinger proposed cognitive dissonance in 1957"},
                ]},
                {"name": "Abnormal Psychology", "difficulty": "medium", "duration_minutes": 30, "questions": [
                    {"text": "DSM-5 stands for:", "options": ["Diagnostic and Statistical Manual of Mental Disorders", "Defense System for Mental Disorders", "Diagnostic Standard for Medicine", "Department of Statistical Medicine"], "correct": 0, "topic": "Classification", "explanation": "DSM-5 is the American Psychiatric Association's manual for diagnosing mental disorders"},
                    {"text": "Major Depressive Disorder requires symptoms lasting:", "options": ["At least 2 weeks", "At least 1 week", "At least 1 month", "At least 6 months"], "correct": 0, "topic": "Mood Disorders", "explanation": "DSM-5 requires depressive symptoms persisting for at least 2 consecutive weeks"},
                    {"text": "CBT stands for:", "options": ["Cognitive Behavioral Therapy", "Classical Brain Training", "Cortical Behavior Technique", "Conditioned Behavioral Treatment"], "correct": 0, "topic": "Therapy", "explanation": "CBT is a widely-used evidence-based psychotherapy approach"},
                    {"text": "Schizophrenia is characterized by:", "options": ["Positive and negative symptoms", "Only mood swings", "Memory loss only", "Anxiety attacks"], "correct": 0, "topic": "Psychotic Disorders", "explanation": "Schizophrenia includes positive symptoms (hallucinations) and negative symptoms (flat affect)"},
                    {"text": "PTSD can develop after:", "options": ["Traumatic events", "Genetic factors only", "Childhood nutrition", "Excessive studying"], "correct": 0, "topic": "Trauma", "explanation": "PTSD (Post-Traumatic Stress Disorder) develops following exposure to traumatic events"},
                ]},
                {"name": "Research Methods in Psychology", "difficulty": "hard", "duration_minutes": 40, "questions": [
                    {"text": "In a double-blind study:", "options": ["Neither participants nor researchers know who received treatment", "Only participants don't know", "Only researchers don't know", "All know treatment assignments"], "correct": 0, "topic": "Research Design", "explanation": "Double-blind eliminates both participant and experimenter bias"},
                    {"text": "A p-value of 0.03 means:", "options": ["3% chance results are due to chance", "97% the hypothesis is wrong", "3% confidence in results", "Results are definitively significant"], "correct": 0, "topic": "Statistics", "explanation": "A p-value indicates the probability of observing the result if the null hypothesis were true"},
                    {"text": "Ecological validity refers to:", "options": ["How well findings generalize to real-world settings", "Environmental impact of research", "Validity of ecological studies", "Natural observations"], "correct": 0, "topic": "Research Design", "explanation": "Ecological validity is the extent to which research findings apply to everyday life"},
                    {"text": "Informed consent is essential because:", "options": ["Participants have the right to know research risks", "It improves results", "It's legally required only", "It speeds up research"], "correct": 0, "topic": "Ethics", "explanation": "Informed consent is a cornerstone of research ethics protecting participant autonomy"},
                    {"text": "What is the replication crisis in psychology?", "options": ["Many published studies fail to reproduce", "Labs can't afford equipment", "Data storage problems", "Publication speed issues"], "correct": 0, "topic": "Research Methodology", "explanation": "The replication crisis refers to findings that fail to reproduce in subsequent studies"},
                ]}
            ]}
        ]},
        {"name": "Arts and Creative Studies", "description": "Visual Arts, Music, Design, Film, and Digital Media", "icon": "🎨", "subjects": [
            {"name": "Visual Arts Theory", "description": "Art history, criticism, and practice", "tests": [
                {"name": "Art History Basics", "difficulty": "easy", "duration_minutes": 15, "questions": [
                    {"text": "The Mona Lisa was painted by:", "options": ["Leonardo da Vinci", "Michelangelo", "Raphael", "Caravaggio"], "correct": 0, "topic": "Renaissance Art", "explanation": "Leonardo da Vinci painted the Mona Lisa around 1503-1519"},
                    {"text": "Impressionism as an art movement began in:", "options": ["France", "Italy", "Germany", "USA"], "correct": 0, "topic": "Impressionism", "explanation": "Impressionism emerged in France in the 1860s-70s (Monet, Renoir, Degas)"},
                    {"text": "Surrealism was influenced by:", "options": ["Freudian theory", "Cubism only", "Photography", "Gothic art"], "correct": 0, "topic": "Surrealism", "explanation": "Surrealists like Dalí were influenced by Freud's work on the unconscious mind"},
                    {"text": "Primary colors in traditional art are:", "options": ["Red, Yellow, Blue", "Red, Green, Blue", "Cyan, Magenta, Yellow", "Orange, Purple, Green"], "correct": 0, "topic": "Color Theory", "explanation": "Traditional (RYB) primary colors are Red, Yellow, and Blue"},
                    {"text": "Chiaroscuro refers to:", "options": ["Light and shadow contrast", "Bright colors only", "Abstract patterns", "Miniature painting"], "correct": 0, "topic": "Techniques", "explanation": "Chiaroscuro is the technique of using strong contrasts between light and dark"},
                ]},
                {"name": "Contemporary Art", "difficulty": "medium", "duration_minutes": 25, "questions": [
                    {"text": "Dadaism emerged in response to:", "options": ["World War I", "Industrial Revolution", "Cold War", "Renaissance"], "correct": 0, "topic": "Dada", "explanation": "Dadaism (1916) was a protest movement against the violence and irrationality of WWI"},
                    {"text": "Marcel Duchamp's 'Fountain' (1917) is an example of:", "options": ["Conceptual art / Readymades", "Abstract Expressionism", "Pop Art", "Minimalism"], "correct": 0, "topic": "Conceptual Art", "explanation": "Duchamp's readymades challenged the definition of art by presenting everyday objects as art"},
                    {"text": "Andy Warhol is associated with:", "options": ["Pop Art", "Abstract Expressionism", "Cubism", "Fauvism"], "correct": 0, "topic": "Pop Art", "explanation": "Andy Warhol was a leading figure in the Pop Art movement of the 1960s"},
                    {"text": "NFT in digital art stands for:", "options": ["Non-Fungible Token", "New Format Technology", "Network Film Transfer", "Non-Fiction Text"], "correct": 0, "topic": "Digital Art", "explanation": "NFTs are unique digital assets verified using blockchain technology"},
                    {"text": "The Bauhaus school combined:", "options": ["Art and industrial design", "Music and painting", "Poetry and sculpture", "Architecture and mathematics"], "correct": 0, "topic": "Design History", "explanation": "Bauhaus (1919-1933) pioneered the synthesis of fine arts and functional design"},
                ]},
                {"name": "Art Criticism and Theory", "difficulty": "hard", "duration_minutes": 35, "questions": [
                    {"text": "Formalism in art criticism focuses on:", "options": ["Visual elements and composition", "Social context", "Artist biography", "Economic factors"], "correct": 0, "topic": "Art Theory", "explanation": "Formalism evaluates art based on its formal qualities: line, color, shape, space"},
                    {"text": "Roland Barthes' 'Death of the Author' argues:", "options": ["Meaning is created by the reader", "Authors control meaning", "Text is unchangeable", "Biography determines interpretation"], "correct": 0, "topic": "Critical Theory", "explanation": "Barthes argued that once a text is produced, the author's intent is irrelevant to meaning"},
                    {"text": "Derrida's deconstruction in art means:", "options": ["Revealing internal contradictions in texts/works", "Destroying artworks", "Simplifying interpretation", "Applying logic to art"], "correct": 0, "topic": "Postmodernism", "explanation": "Deconstruction examines how works contain opposing tensions that undermine their stated meaning"},
                    {"text": "The 'gaze' in feminist art theory refers to:", "options": ["The objectifying viewpoint in art", "Technical mastery", "Style of painting", "Exhibition curation"], "correct": 0, "topic": "Feminist Theory", "explanation": "The 'male gaze' (Laura Mulvey) describes how art historically presented subjects from a heterosexual male viewpoint"},
                    {"text": "Postcolonial art theory examines:", "options": ["Effects of colonialism on cultural production", "Pre-industrial art", "Mathematical art patterns", "Commercial art markets"], "correct": 0, "topic": "Postcolonial Theory", "explanation": "Postcolonial art theory analyzes how colonial experiences have shaped cultural identity and artistic expression"},
                ]}
            ]}
        ]},
        {"name": "Law and Legal Studies", "description": "Constitutional Law, Criminal Justice, International Law", "icon": "⚖️", "subjects": [
            {"name": "Constitutional Law", "description": "Fundamental rights, separation of powers", "tests": [
                {"name": "Fundamentals of Law", "difficulty": "easy", "duration_minutes": 20, "questions": [
                    {"text": "The rule of law means:", "options": ["Everyone is subject to the law equally", "Rulers make their own laws", "Laws must be written", "Courts are supreme"], "correct": 0, "topic": "Rule of Law", "explanation": "The rule of law principle requires that all persons, including those in power, are subject to the law"},
                    {"text": "Habeas corpus protects against:", "options": ["Unlawful detention", "Unfair taxation", "Free speech violations", "Property theft"], "correct": 0, "topic": "Civil Rights", "explanation": "Habeas corpus requires that a person under arrest must be brought before a judge"},
                    {"text": "A tort is:", "options": ["A civil wrong causing harm", "A criminal offense", "A legal contract", "A court order"], "correct": 0, "topic": "Tort Law", "explanation": "A tort is a wrongful act that causes harm for which civil legal liability may attach"},
                    {"text": "The burden of proof in criminal cases is:", "options": ["Beyond reasonable doubt", "Balance of probabilities", "Absolute certainty", "Preponderance of evidence"], "correct": 0, "topic": "Criminal Law", "explanation": "Criminal cases require proof beyond reasonable doubt (higher standard than civil cases)"},
                    {"text": "Mens rea refers to:", "options": ["Guilty mind/criminal intent", "Physical act", "Victim consent", "Witness testimony"], "correct": 0, "topic": "Criminal Law", "explanation": "Mens rea is the mental element of a crime — intent to commit the wrongful act"},
                ]},
                {"name": "Contract and Tort Law", "difficulty": "medium", "duration_minutes": 30, "questions": [
                    {"text": "For a valid contract, which is NOT required?", "options": ["Notarization", "Offer", "Acceptance", "Consideration"], "correct": 0, "topic": "Contract Law", "explanation": "Notarization is not required for most contracts; offer, acceptance, and consideration are essential elements"},
                    {"text": "Negligence requires proof of:", "options": ["Duty, breach, causation, damage", "Intent only", "Criminal record", "Written warning"], "correct": 0, "topic": "Tort Law", "explanation": "The four elements of negligence are: duty of care, breach, causation, and actual damage"},
                    {"text": "Vicarious liability means:", "options": ["Employers can be liable for employee acts", "Victims share liability", "Courts share responsibility", "Laws apply to minors only"], "correct": 0, "topic": "Tort Law", "explanation": "Vicarious liability holds one party responsible for the actions of another (typically employer-employee)"},
                    {"text": "In contract law, 'consideration' means:", "options": ["Something of value exchanged", "Careful thinking", "An offer to negotiate", "Written documentation"], "correct": 0, "topic": "Contract Law", "explanation": "Consideration is the exchange of value (money, goods, services, a promise) that makes a contract binding"},
                    {"text": "An injunction is:", "options": ["A court order to do or stop doing something", "A criminal sentence", "A fine", "A legal warning"], "correct": 0, "topic": "Remedies", "explanation": "An injunction is an equitable remedy requiring a party to do or refrain from specific acts"},
                ]},
                {"name": "Advanced Constitutional Theory", "difficulty": "hard", "duration_minutes": 40, "questions": [
                    {"text": "Judicial review enables courts to:", "options": ["Invalidate laws that conflict with the constitution", "Create new legislation", "Override jury verdicts", "Rewrite the constitution"], "correct": 0, "topic": "Constitutional Law", "explanation": "Judicial review (established in Marbury v. Madison, 1803) allows courts to strike down unconstitutional laws"},
                    {"text": "Proportionality in constitutional law means:", "options": ["Rights limitations must be proportionate to aims", "All citizens get equal representation", "Courts are equally distributed", "Sentences match crime severity only"], "correct": 0, "topic": "Rights Theory", "explanation": "Proportionality requires that restrictions on rights are no greater than necessary to achieve a legitimate aim"},
                    {"text": "The doctrine of separation of powers was strongly advocated by:", "options": ["Montesquieu", "Locke", "Hobbes", "Rousseau"], "correct": 0, "topic": "Constitutional Theory", "explanation": "Montesquieu's 'Spirit of the Laws' (1748) developed the modern theory of separation of powers"},
                    {"text": "An ultra vires act is one that:", "options": ["Exceeds legal authority", "Is perfectly legal", "Applies to foreigners only", "Requires judicial approval"], "correct": 0, "topic": "Administrative Law", "explanation": "Ultra vires (beyond the powers) acts are invalid because they exceed granted legal authority"},
                    {"text": "The principle of stare decisis means:", "options": ["Courts should follow prior decisions", "Each case is decided independently", "Laws are permanent", "Precedent can be freely ignored"], "correct": 0, "topic": "Common Law", "explanation": "Stare decisis requires courts to follow established precedent to ensure legal consistency"},
                ]}
            ]}
        ]},
        {"name": "Education", "description": "Pedagogy, Curriculum, Educational Psychology, Research", "icon": "🎓", "subjects": [
            {"name": "Educational Psychology", "description": "Learning theories, motivation, and development", "tests": [
                {"name": "Learning Theories Basics", "difficulty": "easy", "duration_minutes": 20, "questions": [
                    {"text": "Vygotsky's Zone of Proximal Development is:", "options": ["Gap between current and potential ability with help", "Natural learning limit", "Peer learning environment", "Teacher instruction zone"], "correct": 0, "topic": "Constructivism", "explanation": "ZPD is what a learner can do with guidance but not independently yet"},
                    {"text": "Bloom's Taxonomy highest level is:", "options": ["Creating/Evaluation", "Remembering", "Understanding", "Applying"], "correct": 0, "topic": "Learning Outcomes", "explanation": "In the revised Bloom's Taxonomy, Creating (synthesis) is the highest cognitive level"},
                    {"text": "Formative assessment is used:", "options": ["During learning to provide feedback", "Only at end of term", "For grading only", "For school ranking"], "correct": 0, "topic": "Assessment", "explanation": "Formative assessment monitors student progress during instruction to improve learning"},
                    {"text": "Growth mindset (Dweck) believes:", "options": ["Abilities can be developed through effort", "Intelligence is fixed", "Talent determines success", "Learning is innate"], "correct": 0, "topic": "Motivation", "explanation": "Carol Dweck's growth mindset theory holds that abilities are not fixed but can grow with effort"},
                    {"text": "Scaffolding in education means:", "options": ["Providing temporary support for learning", "Building school structures", "Designing curricula", "Testing students regularly"], "correct": 0, "topic": "Teaching Methods", "explanation": "Scaffolding provides structured support that is gradually removed as learners develop independence"},
                ]},
                {"name": "Curriculum Design", "difficulty": "medium", "duration_minutes": 30, "questions": [
                    {"text": "Backward design in curriculum starts with:", "options": ["Desired learning outcomes", "Available resources", "Student interests", "Teacher preferences"], "correct": 0, "topic": "Curriculum Design", "explanation": "Backward design (Wiggins & McTighe) begins with defining desired outcomes, then designing assessments and activities"},
                    {"text": "Differentiated instruction means:", "options": ["Tailoring teaching to individual needs", "Teaching different subjects", "Using different grades", "Separating students by ability"], "correct": 0, "topic": "Inclusive Education", "explanation": "Differentiated instruction adapts content, process, and products to meet diverse learner needs"},
                    {"text": "The hidden curriculum refers to:", "options": ["Unplanned lessons from school culture/environment", "Secret coursework", "Advanced placement programs", "Extra learning resources"], "correct": 0, "topic": "Curriculum Theory", "explanation": "The hidden curriculum includes implicit values and behaviors learned through school environment"},
                    {"text": "Universal Design for Learning (UDL) focuses on:", "options": ["Flexible learning for all students", "Architecture of schools", "Technology design", "Gifted education only"], "correct": 0, "topic": "Inclusive Education", "explanation": "UDL proactively designs flexible learning experiences accessible to all learners"},
                    {"text": "Summative assessment evaluates:", "options": ["Learning at end of instruction period", "Ongoing progress", "Teacher performance", "Peer collaboration"], "correct": 0, "topic": "Assessment", "explanation": "Summative assessment evaluates student learning at the conclusion of a defined instructional period"},
                ]},
                {"name": "Advanced Educational Research", "difficulty": "hard", "duration_minutes": 40, "questions": [
                    {"text": "Ethnographic research in education primarily involves:", "options": ["Immersive observation in natural settings", "Lab experiments", "Standardized testing", "Survey questionnaires only"], "correct": 0, "topic": "Research Methods", "explanation": "Ethnography involves extended observation and participation in educational settings to understand culture"},
                    {"text": "Action research is characterized by:", "options": ["Teachers investigating their own practice", "External researcher observations", "Large-scale quantitative studies", "Historical document analysis"], "correct": 0, "topic": "Research Methods", "explanation": "Action research is a reflective process where practitioners investigate their own practice"},
                    {"text": "A Likert scale measures:", "options": ["Attitudes/opinions on a rating scale", "Physical measurements", "Time-based variables", "Binary yes/no responses"], "correct": 0, "topic": "Research Instruments", "explanation": "Likert scales typically use 5-7 points from 'Strongly Agree' to 'Strongly Disagree'"},
                    {"text": "Triangulation in qualitative research means:", "options": ["Using multiple methods to verify findings", "Three-point sampling", "Geometric research design", "Three-researcher teams"], "correct": 0, "topic": "Research Validity", "explanation": "Triangulation uses multiple data sources or methods to enhance credibility of findings"},
                    {"text": "The achievement gap refers to:", "options": ["Persistent performance differences between demographic groups", "Gap between goals and outcomes", "Technology access disparities", "Teacher-student ratio issues"], "correct": 0, "topic": "Educational Equity", "explanation": "The achievement gap describes persistent differences in academic performance between demographic groups"},
                ]}
            ]}
        ]},
        {"name": "Agriculture and Environmental Studies", "description": "Sustainable farming, ecology, climate science", "icon": "🌱", "subjects": [
            {"name": "Environmental Science", "description": "Ecosystems, climate, biodiversity", "tests": [
                {"name": "Ecology Basics", "difficulty": "easy", "duration_minutes": 20, "questions": [
                    {"text": "Photosynthesis converts:", "options": ["CO2 and water to glucose and oxygen", "Oxygen to CO2", "Sunlight to heat only", "Glucose to starch"], "correct": 0, "topic": "Plant Biology", "explanation": "6CO2 + 6H2O + light → C6H12O6 + 6O2"},
                    {"text": "A food chain starts with:", "options": ["Producers (plants)", "Consumers", "Decomposers", "Apex predators"], "correct": 0, "topic": "Ecosystems", "explanation": "Food chains begin with producers (autotrophs) that convert sunlight to energy"},
                    {"text": "Greenhouse gases include:", "options": ["CO2, methane, water vapor", "Nitrogen and oxygen only", "Ozone and argon", "Helium and neon"], "correct": 0, "topic": "Climate Science", "explanation": "Primary greenhouse gases: CO2, CH4, N2O, and water vapor"},
                    {"text": "Biodiversity refers to:", "options": ["Variety of life in an ecosystem", "Number of plants only", "Geographic diversity", "Cultural differences"], "correct": 0, "topic": "Conservation", "explanation": "Biodiversity encompasses the variety of life: species, genetic, and ecosystem diversity"},
                    {"text": "The water cycle includes:", "options": ["Evaporation, condensation, precipitation", "Only rainfall", "River flow only", "Ocean currents"], "correct": 0, "topic": "Earth Systems", "explanation": "The hydrological cycle: evaporation → condensation → precipitation → runoff"},
                ]},
                {"name": "Climate Change and Sustainability", "difficulty": "medium", "duration_minutes": 30, "questions": [
                    {"text": "The Paris Agreement aims to limit global warming to:", "options": ["1.5-2°C above pre-industrial levels", "3°C above current levels", "0.5°C total", "5°C above 1990 levels"], "correct": 0, "topic": "Climate Policy", "explanation": "The Paris Agreement (2015) targets limiting warming to well below 2°C, ideally 1.5°C"},
                    {"text": "Carbon sequestration means:", "options": ["Capturing and storing CO2", "Releasing carbon", "Measuring emissions", "Burning fossil fuels"], "correct": 0, "topic": "Climate Solutions", "explanation": "Carbon sequestration is the process of capturing CO2 from the atmosphere and storing it"},
                    {"text": "The ozone layer primarily absorbs:", "options": ["UV radiation", "Infrared radiation", "Visible light", "Radio waves"], "correct": 0, "topic": "Atmospheric Science", "explanation": "The stratospheric ozone layer absorbs harmful UV-B and UV-C radiation from the sun"},
                    {"text": "Sustainable development meets current needs without:", "options": ["Compromising future generations' ability", "Using renewable energy", "Allowing economic growth", "Respecting ecosystems"], "correct": 0, "topic": "Sustainability", "explanation": "Brundtland definition: 'development that meets present needs without compromising future generations'"},
                    {"text": "Eutrophication is caused by:", "options": ["Excess nutrients (nitrogen/phosphorus) in water", "Salt water intrusion", "UV exposure of water", "Oil spills"], "correct": 0, "topic": "Water Quality", "explanation": "Eutrophication occurs when excess nutrients cause algal blooms, depleting oxygen in water"},
                ]},
                {"name": "Advanced Ecology and Conservation", "difficulty": "hard", "duration_minutes": 40, "questions": [
                    {"text": "Trophic cascade occurs when:", "options": ["Changes in apex predators affect entire ecosystems", "Nutrients flow up the food chain", "Decomposers recycle all nutrients", "Energy is lost at each trophic level"], "correct": 0, "topic": "Ecosystem Dynamics", "explanation": "Trophic cascades show how removing/adding top predators can restructure entire ecosystems"},
                    {"text": "Island biogeography theory predicts:", "options": ["Larger/closer islands have more species", "All islands have equal biodiversity", "Small islands support more species", "Distance is irrelevant"], "correct": 0, "topic": "Biogeography", "explanation": "MacArthur-Wilson theory: species richness increases with island size and decreases with distance from mainland"},
                    {"text": "IPCC refers to:", "options": ["Intergovernmental Panel on Climate Change", "International Protocol for Carbon Control", "Industrial Pollution Control Commission", "International Plant Conservation Committee"], "correct": 0, "topic": "Climate Science", "explanation": "IPCC is the UN body for assessing the science related to climate change"},
                    {"text": "A keystone species is one that:", "options": ["Has disproportionately large impact on its ecosystem", "Is the most numerous species", "Is hunted most frequently", "Lives at the base of food chains"], "correct": 0, "topic": "Conservation Biology", "explanation": "Keystone species play critical roles in maintaining ecosystem structure (e.g., wolves in Yellowstone)"},
                    {"text": "CITES regulates:", "options": ["International wildlife trade", "Carbon emissions", "Ocean fishing quotas", "National park management"], "correct": 0, "topic": "Conservation Law", "explanation": "CITES (Convention on International Trade in Endangered Species) regulates trade in 38,000+ species"},
                ]}
            ]}
        ]},
        {"name": "Vocational and Technical Education", "description": "IT, Engineering, Trades, Healthcare Technology", "icon": "🔧", "subjects": [
            {"name": "Information Technology", "description": "Programming, networks, cybersecurity, databases", "tests": [
                {"name": "IT Fundamentals", "difficulty": "easy", "duration_minutes": 20, "questions": [
                    {"text": "HTML stands for:", "options": ["HyperText Markup Language", "High Tech Machine Language", "Hyper Terminal Markup Logic", "HyperText Machine Learning"], "correct": 0, "topic": "Web Technologies", "explanation": "HTML (HyperText Markup Language) is the standard language for creating web pages"},
                    {"text": "RAM is:", "options": ["Random Access Memory (temporary)", "Read-only Archived Memory", "Remote Access Module", "Recursive Allocation Memory"], "correct": 0, "topic": "Computer Hardware", "explanation": "RAM is volatile (temporary) memory used to store data the CPU is actively using"},
                    {"text": "An IP address identifies:", "options": ["A device on a network", "An internet browser", "A file type", "A programming language"], "correct": 0, "topic": "Networking", "explanation": "IP addresses uniquely identify devices on a network"},
                    {"text": "Which is an example of open-source software?", "options": ["Linux", "Windows", "macOS", "iOS"], "correct": 0, "topic": "Software", "explanation": "Linux is open-source; Windows, macOS, and iOS are proprietary"},
                    {"text": "Encryption converts data to:", "options": ["An unreadable format to protect it", "Compressed files", "Readable text", "HTML format"], "correct": 0, "topic": "Cybersecurity", "explanation": "Encryption uses algorithms to convert readable data into ciphertext"},
                ]},
                {"name": "Programming Concepts", "difficulty": "medium", "duration_minutes": 30, "questions": [
                    {"text": "Object-Oriented Programming (OOP) uses:", "options": ["Classes and objects", "Only functions", "Only arrays", "Only loops"], "correct": 0, "topic": "Programming Paradigms", "explanation": "OOP organizes software around objects (instances of classes) with data and behavior"},
                    {"text": "A REST API uses which HTTP method to create resources?", "options": ["POST", "GET", "DELETE", "PUT"], "correct": 0, "topic": "APIs", "explanation": "POST creates new resources; GET retrieves; PUT updates; DELETE removes"},
                    {"text": "Big O notation O(n²) describes:", "options": ["Quadratic time complexity", "Linear time complexity", "Constant time", "Logarithmic time"], "correct": 0, "topic": "Algorithms", "explanation": "O(n²) means execution time grows with the square of input size (e.g., nested loops)"},
                    {"text": "SQL SELECT statement is used for:", "options": ["Querying/reading data", "Inserting records", "Deleting tables", "Creating databases"], "correct": 0, "topic": "Databases", "explanation": "SELECT retrieves data from tables; INSERT adds data; DELETE removes; CREATE builds structures"},
                    {"text": "Version control with Git allows:", "options": ["Tracking code changes over time", "Faster code execution", "Automatic testing", "Database management"], "correct": 0, "topic": "DevOps", "explanation": "Git is a distributed version control system enabling collaboration and change history"},
                ]},
                {"name": "Advanced Cybersecurity", "difficulty": "hard", "duration_minutes": 40, "questions": [
                    {"text": "A SQL injection attack involves:", "options": ["Inserting malicious SQL into inputs", "Physical database theft", "Firewall circumvention", "Password guessing"], "correct": 0, "topic": "Cybersecurity", "explanation": "SQL injection inserts malicious SQL code through user inputs to manipulate databases"},
                    {"text": "HTTPS uses which protocol for security?", "options": ["TLS/SSL", "HTTP/2", "TCP/IP", "DNS"], "correct": 0, "topic": "Network Security", "explanation": "HTTPS uses TLS (Transport Layer Security) to encrypt data in transit"},
                    {"text": "Zero-day vulnerability refers to:", "options": ["Unknown flaw with no patch available", "A 24-hour security window", "Newly patched software", "Daily security updates"], "correct": 0, "topic": "Vulnerability Management", "explanation": "Zero-day vulnerabilities are unknown to vendors and have no patches when exploited"},
                    {"text": "Multi-factor authentication (MFA) requires:", "options": ["Two or more verification methods", "One strong password", "Biometrics only", "Security questions only"], "correct": 0, "topic": "Authentication", "explanation": "MFA combines something you know, have, and/or are (password + phone + fingerprint)"},
                    {"text": "Public Key Infrastructure (PKI) uses:", "options": ["Asymmetric key pairs (public/private)", "Single shared keys", "Password hashing only", "Symmetric encryption only"], "correct": 0, "topic": "Cryptography", "explanation": "PKI uses public keys (shared freely) and private keys (kept secret) for secure communications"},
                ]}
            ]}
        ]}
    ]
}


def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Domain).count() > 0:
            print("✅ Database already seeded. Skipping.")
            return

        print("🌱 Seeding database...")
        for domain_data in SEED_DATA["domains"]:
            domain = Domain(
                name=domain_data["name"],
                description=domain_data["description"],
                icon=domain_data["icon"]
            )
            db.add(domain)
            db.flush()

            for subject_data in domain_data["subjects"]:
                subject = Subject(
                    name=subject_data["name"],
                    description=subject_data["description"],
                    domain_id=domain.id
                )
                db.add(subject)
                db.flush()

                for test_data in subject_data["tests"]:
                    test = MockTest(
                        name=test_data["name"],
                        difficulty=test_data["difficulty"],
                        subject_id=subject.id,
                        duration_minutes=test_data.get("duration_minutes", 30)
                    )
                    db.add(test)
                    db.flush()

                    for i, q_data in enumerate(test_data["questions"]):
                        question = Question(
                            test_id=test.id,
                            text=q_data["text"],
                            options=json.dumps(q_data["options"]),
                            correct_answer=q_data["correct"],
                            topic=q_data["topic"],
                            explanation=q_data.get("explanation", ""),
                            order_num=i
                        )
                        db.add(question)

                print(f"  ✅ {subject.name}: {len(subject_data['tests'])} tests")

        db.commit()
        print(f"\n✅ Seeded {db.query(Domain).count()} domains successfully!")
        print(f"   • Subjects: {db.query(Subject).count()}")
        print(f"   • Tests: {db.query(MockTest).count()}")
        print(f"   • Questions: {db.query(Question).count()}")

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
