export type Question = {
  a: number;
  b: number;
  correct: number;
  options: number[];
};

export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export const generateQuestion = (level: Level, failedQuestions: string[] = []): Question => {
  let a: number, b: number;

  // Intelligent repetition: 20% chance to repeat a failed question
  if (failedQuestions.length > 0 && Math.random() < 0.2) {
    const randomFailed = failedQuestions[Math.floor(Math.random() * failedQuestions.length)];
    const parts = randomFailed.split('x').map(Number);
    a = parts[0];
    b = parts[1];
  } else {
    switch (level) {
      case 1: // Tablas 1-3
        a = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
        b = Math.floor(Math.random() * 10) + 1; // 1-10
        break;
      case 2: // Tablas 4-6
        a = Math.floor(Math.random() * 3) + 4; // 4, 5, 6
        b = Math.floor(Math.random() * 10) + 1; // 1-10
        break;
      case 3: // Tablas 7-10
        a = Math.floor(Math.random() * 4) + 7; // 7, 8, 9, 10
        b = Math.floor(Math.random() * 10) + 1; // 1-10
        break;
      case 4: // Combinación nivel 1 y 2 (tablas 1-6)
        a = Math.floor(Math.random() * 6) + 1; // 1-6
        b = Math.floor(Math.random() * 10) + 1; // 1-10
        break;
      case 5: // Todas las tablas (1-10)
        a = Math.floor(Math.random() * 10) + 1; // 1-10
        b = Math.floor(Math.random() * 10) + 1; // 1-10
        break;
      case 6: // Todas las tablas contrarreloj (1-10)
        a = Math.floor(Math.random() * 10) + 1; // 1-10
        b = Math.floor(Math.random() * 10) + 1; // 1-10
        break;
      default:
        a = 2; b = 2;
    }
  }

  const correct = a * b;

  // Create 4 options: 1 correct + 3 fakes
  const optionsSet = new Set<number>([correct]);

  while (optionsSet.size < 4) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const isPlus = Math.random() > 0.5;
    const fake = isPlus ? correct + offset : correct - offset;
    if (fake > 0 && fake !== correct) {
      optionsSet.add(fake);
    }
  }

  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  return { a, b, correct, options };
};

export const getTimeLimit = (level: Level, questionIndex: number): number => {
  // Level 6 is time-based challenge
  if (level === 6) {
    // Progressive difficulty
    if (questionIndex < 3) return 8;
    if (questionIndex < 6) return 6;
    return 4;
  }

  // All other levels have standard time
  return 10;
};

export const calculatePoints = (isCorrect: boolean, timeLeft: number): number => {
  if (!isCorrect) return 0;
  let points = 10;
  if (timeLeft > 5) points += 5; // Fast bonus
  return points;
};
