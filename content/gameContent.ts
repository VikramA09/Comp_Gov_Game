/**
 * Replace this file (or edit the exports below) to swap events, MCQs, index notes, and works cited
 * without changing game code.
 */

export const GAME_RULES = {
  minPoints: -15,
  maxPoints: 25,
  winPoints: 25,
  skillCorrectBonus: 5,
  skillWrongPenalty: -10,
  moveMin: 1,
  moveMax: 7,
  /** Start + 25 chance + 3 skill + end (30 positions on the path) */
  totalBoardSpaces: 30,
  chanceSquareCount: 25,
  skillSquareCount: 3,
} as const;

/** Each line is shown exactly as written; lines starting with http become links. */
export const WORKS_CITED: string[] = [
  "Comp Govt’t case studies",
  "https://docs.google.com/file/d/1hvW3mmWFFlSKe6OaPGdwJ4uD4z0c4ut0/edit?usp=docslist_api&filetype=mspresentation",
  "https://docs.google.com/presentation/d/12phUx6L8WaJ000TcMueUpE8DDsRGrefN/edit?usp=sharing&ouid=112846848183713968046&rtpof=true&sd=true",
  "https://apcentral.collegeboard.org/media/pdf/ap-comparative-government-and-politics-course-and-exam-description.pdf",
  "https://fsi.stanford.edu/news/mexicos-rule-law-reforms-declines-torture-and-rise-planted-evidence",
  "https://www.journalofdemocracy.org/articles/the-putin-myth/",
  "https://www.ireland.ie/en/dfa/role-policies/northern-ireland/about-the-good-friday-agreement/",
];

export type ChanceCard = {
  id: string;
  text: string;
  points: number;
  indexNote: string;
};

export const CHANCE_CARDS: ChanceCard[] = [
  {
    id: "ch-1",
    text: "Yippee! An independent electoral commission was formed in your country, +3 pt (Vikram)",
    points: 3,
    indexNote:
      "Mexico established the Federal Electoral Institute (IFE) in 1990, which was replaced by the national electoral institute in 2014 which oversees the elections making sure they are free and faire",
  },
  {
    id: "ch-2",
    text: "Congrats! Your country implemented rule of law reforms to protect civil liberties, +3 pt (Francesco)",
    points: 3,
    indexNote:
      "Mexico implemented rule of law reforms in 2008 to reduce unfair police treatment, torture, and increase rule of law and civil liberties. (Francesco)",
  },
  {
    id: "ch-3",
    text: "Yay! Your country holds free and fair elections +4 pt",
    points: 4,
    indexNote:
      "Nigeria’s transition toward democracy was seen through a free and fair election of Olusegun Obasanjo in 1999. (Ebner)",
  },
  {
    id: "ch-4",
    text: "Wow! Your country had a successful peaceful civilian-to-civilian transition, +3 pt (Vikram)",
    points: 3,
    indexNote:
      "Nigeria’s successful civilian-to-civilian transition in 2003 represents a positive step towards the consolidation of democracy in Nigeria (Vikram)",
  },
  {
    id: "ch-5",
    text: "Cool! The government reforms the legislature and judiciary to increase independence and decentralize power +2 pt (Francesco)",
    points: 2,
    indexNote:
      "The Zedillo reforms in Mexico led to greater legislative and judicial independence, as well as prosper program for poverty relief, aiding democratization efforts (Francesco)",
  },
  {
    id: "ch-6",
    text: "Amazing! Your country has successful transitions of power +3pt (Ebner)",
    points: 3,
    indexNote:
      "Nigeria goes through many turbulent times of corrupt military rule during 1966-1999 (Ebner)",
  },
  {
    id: "ch-7",
    text: "Fantastic! Your country has had an uprising of prebendalism (client patronage) in your societies, -3 pts (Vikram)",
    points: -3,
    indexNote:
      "There is a prevalence of prebendalism (client patronage) in Nigerian societies (Vikram)",
  },
  {
    id: "ch-8",
    text: "Uh oh! Your country fails to unite its diverse ethnic groups and clashes occur between them, -3 pts (Hisham)",
    points: -3,
    indexNote:
      "Nigeria undergoes many ethnic and religious conflicts, especially with diverse ethnic groups fighting, and religious battles between Christianity and Islam. These conflicts have resulted in over 25,000 lives lost. (Hisham)",
  },
  {
    id: "ch-9",
    text: "No! A foreign government occupies sections of your territory. You lose sovereignty and support -5 pts (Francesco)",
    points: -5,
    indexNote:
      "After the Mexican American war (1846-1848) the Mexican government lost sovereignty and legitimacy, dealing with civil conflicts and loss of authority.",
  },
  {
    id: "ch-10",
    text: "Hooray! Your country creates a Human Rights Violations Commission, +3 pts (Vikram)",
    points: 3,
    indexNote:
      "Two weeks after his inauguration on May 29, 1999, Obasanjo announced the formation of the Human Rights Violations Investigation Commission (HRVIC) which is also known as the “Oputa Panel.” (Vikram)",
  },
  {
    id: "ch-11",
    text: "Whoops! Despite current reform efforts, your country has a tradition of Patron-Clientalism and government corruption -1 pts (Francesco)",
    points: -1,
    indexNote:
      "Mexico has had a tradition of patron clientelism, stemming from the PRI rule, leading to favoritism and corruption in the legislature towards the elite. (Francesco)",
  },
  {
    id: "ch-12",
    text: "Gulp! Your country has tension with rights and freedoms for the states. -2pt (Ebner)",
    points: -2,
    indexNote:
      "Nigeria struggles with laws between the main government and the states. As a rentier state, which makes it difficult to predict state revenue, states compete with each other for access to resources(can intensify ethnic and religious conflicts) (Ebner)",
  },
  {
    id: "ch-13",
    text: "Great! Your country creates better financial control for the people +3pt(Ebner)",
    points: 3,
    indexNote:
      "In 2003, Nigeria created the Economic and Financial crimes commission to investigate financial crimes, prosecute the accused of wrongdoing, and recover government funds diverted for personal benefit. (Ebner)",
  },
  {
    id: "ch-14",
    text: "Nice! Your country grants more power to your states, allowing more autonomous control and letting them become more self-sustainable. +2 pts (Hisham)",
    points: 2,
    indexNote:
      "After democratization in Mexico, federalism strengthened. States were able to carry out programs only if they could afford, allowing more financial stability on a local level. (Hisham).",
  },
  {
    id: "ch-15",
    text: "Yikes! Your country's president re-writes the country's constitution to expand his personal power! -6 pts (Francesco)",
    points: -6,
    indexNote:
      "In 2000, Russia elected president Putin, who rewrote the constitution to increase his authority and control over the country, greatly decreasing democratization (Francesco)",
  },
  {
    id: "ch-16",
    text: "Shoot! An independent organization waged war on your nation! -4 pts (Hisham)",
    points: -4,
    indexNote:
      "In 1993, The Zapatistas, a Marxist organization of mainly indigenous people fed up with the way they were treated by the Mexican government waged war and took control of many territories in southern Mexico, seeking out autonomy. (Hisham)",
  },
  {
    id: "ch-17",
    text: "Faaaah! Independent militia fighters in your country have organized against the government, and are attacking natural resource deposits! -2 pts (Francesco)",
    points: -2,
    indexNote:
      "Nigeria deals with militia fighters that strike oil deposits and disrupt the democratic process, weakening stability, legitimacy, civilian participation, and harming the economy (Francesco)",
  },
  {
    id: "ch-18",
    text: "Darn! A theocratic ruler has gained popularity in your country! Democratic style of government is weakened and discredited, and religion and tradition are the primary sources of authority! -2 pts (francesco)",
    points: -2,
    indexNote:
      "The Iranian government is under the control of the sha, a theocratic leader who controls most of the state apparatus. The theocratic sentiment weakens democratic governance and balance of power. (Francesco)",
  },
  {
    id: "ch-19",
    text: "Nah! A political organization has taken control of the government and keeps winning the elections! -3 pts (Ebner)",
    points: -3,
    indexNote:
      "The PRI(Partido de la Revolución Institucional; Mexico) was founded in 1929 and kept control of the government until 2000. While it represented peasants, workers, and maintained their loyalty and support, the PRI made sure that it won virtually, regardless of opposition parties.(Ebner)",
  },
  {
    id: "ch-20",
    text: "The educated students in your country are protesting against your government! -2 pts (Hisham)",
    points: -2,
    indexNote:
      "In 2012, there was a movement in Mexico called #Yosoy132, a series of protests to fight against political bias in the media. (Hisham)",
  },
  {
    id: "ch-21",
    text: "Yessir! The government is winning against gangs and violence! Faith is returned in democracy! (Ebner) +7 pts",
    points: 7,
    indexNote:
      "The Cartel is the most feared group in Mexico, and has been feared for a long time. People question whether the government has enough power to stop them. (Ebner)",
  },
  {
    id: "ch-22",
    text: "Oh hey! Your government devolved powers and increased local autonomy to settle conflict! Legitimacy and stability are increased! +8 pts (francesco)",
    points: 8,
    indexNote:
      "In 1998, the Good Friday agreement was signed, devolving powers, resolving the troubles, and restoring faith in the British gov’t. This action, alongside other devolutions in Scotland and wales, helped preserve the United Kingdom and it’s democracy. (Francesco)",
  },
  {
    id: "ch-23",
    text: "Ka-Ching! Your government is helping innovate and improve economic and quality of life for residents in poorer states and areas! Poverty is decreasing in your country! +7pts (Ebner)",
    points: 7,
    indexNote:
      "The North and South of Mexico are different. The north provides more economic opportunity and has a higher HDI, while the south has the poorest states, lagging behind Mexico City and the North. (Ebner)",
  },
  {
    id: "ch-24",
    text: "Your country has had multiple, successful transitions of power, proving it stands the test of time. The democratic experiment becomes commonplace, and is widely considered the dominant form of government in your country! +9 pts (Francesco)",
    points: 9,
    indexNote:
      "The United Kingdom has had successful elections and transfers of power for over a century. The people believe in democracy and broadly have faith in democratic institutions. (Francesco)",
  },
  {
    id: "ch-25",
    text: "No! Your military shot and killed protesters! -5 pts (Hisham)",
    points: -5,
    indexNote:
      "In October 2020, Nigerians were protesting against police brutality, known as the #EndSARS movement, when the Nigerian army opened fire in a large gathering of protesters at the Lekki Toll Gate. (Hisham)",
  },
];

export type McqCard = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: number;
};

export const SKILL_CARDS: McqCard[] = [
  {
    id: "mcq-1",
    question:
      "The process of democratization does not aim to result in what of the following over time?",
    choices: [
      "More competition, fairness, and transparency in elections",
      "Equal treatment of citizens",
      "Universal suffrage for adult citizens",
      "Eliminate inequality and promote equal economic power for all",
    ],
    correctIndex: 3,
  },
  {
    id: "mcq-2",
    question: "What does the term rule of law mean?",
    choices: [
      "The law has a defined set of rules that are transparent",
      "There are laws in place",
      "Nobody is above the law and the law applies to everyone",
      "Some people are above the law while others are subject to it",
    ],
    correctIndex: 2,
  },
  {
    id: "mcq-3",
    question: "What does universal suffrage mean?",
    choices: [
      "Universal suffering",
      "Universal prosperity",
      "The right for everyone to vote without discrimination",
      "The right for everyone to own property",
    ],
    correctIndex: 2,
  },
  {
    id: "mcq-4",
    question: "What is democratic consolidation?",
    choices: [
      "The process by which a democratic regime matures in terms of election rules, separation of powers and protection of civil liberties, making it unlikely to revert to authoritarianism",
      "Democracy has been concentrated into just one group or leader causing a shift toward an authoritarian regime under the facade of democracy",
      "Democracy has been formed in a country but still is unstable",
      "A country who has never experienced democracy started has uprising, rebellions, and protests advocating for democracy",
    ],
    correctIndex: 0,
  },
  {
    id: "mcq-5",
    question: "Which of the following is considered an event that helped democratize Mexico?",
    choices: [
      "The North-South Divide",
      "Vicente Fox and the breaking of the PRI",
      "The Cartel and their actions",
      "The Mexican American War",
    ],
    correctIndex: 1,
  },
  {
    id: "mcq-6",
    question: "Which of the following is an effect of corruption on consolidation?",
    choices: [
      "Corruption causes increased legitimacy and therefore increases consolidation",
      "Corruption harms consolidation because authoritarian governments are more efficient",
      "Corruption increases consolidation because interest groups and kleptocrats support the government",
      "Corruption inhibits consolidation because it decreases government legitimacy and stability, and hinders civil participation",
    ],
    correctIndex: 3,
  },
];
