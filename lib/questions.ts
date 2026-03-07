export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export interface Participant {
  id: string;
  name: string;
  phone: string;  //added phone number field
  state: string;
  district: string;
  block: string;
  gp: string;
  score: number;
  totalQuestions: number;
  answers: number[];
  completedAt: string;
  timeTaken: number; // seconds
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Which planet in our solar system has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctAnswer: 1,
    category: "Science",
  },
  {
    id: 2,
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Science",
  },
  {
    id: 3,
    question: "In which year did the Berlin Wall fall?",
    options: ["1987", "1989", "1991", "1993"],
    correctAnswer: 1,
    category: "History",
  },
  {
    id: 4,
    question: "Who painted the Sistine Chapel ceiling?",
    options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
    correctAnswer: 2,
    category: "Art",
  },
  {
    id: 5,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    category: "Geography",
  },
  {
    id: 6,
    question: "Which programming language was created by Guido van Rossum?",
    options: ["Java", "Python", "Ruby", "C++"],
    correctAnswer: 1,
    category: "Technology",
  },
  {
    id: 7,
    question: "What is the speed of light in vacuum (approximately)?",
    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"],
    correctAnswer: 0,
    category: "Science",
  },
  {
    id: 8,
    question: "Which Shakespeare play features the character 'Puck'?",
    options: ["Hamlet", "Othello", "A Midsummer Night's Dream", "The Tempest"],
    correctAnswer: 2,
    category: "Literature",
  },
  {
    id: 9,
    question: "What is the smallest country in the world by area?",
    options: ["Monaco", "San Marino", "Liechtenstein", "Vatican City"],
    correctAnswer: 3,
    category: "Geography",
  },
  {
    id: 10,
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Hydrogen", "Carbon", "Oxygen"],
    correctAnswer: 1,
    category: "Science",
  },
];
