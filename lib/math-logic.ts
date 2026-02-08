export type Question = {
  a: number;
  b: number;
  correct: number;
  options: number[];
};

export type Level = 1 | 2 | 3 | 4;

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
      case 1: // 1 to 5
        a = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        break;
      case 2: // 6 to 9
        a = Math.floor(Math.random() * 4) + 6;
        b = Math.floor(Math.random() * 10) + 1;
        break;
      case 3: // Mixed
      case 4: // Contrareloj (Mixed)
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        break;
      default:
        a = 2; b = 2;
    }
  }

  const correct = a * b;
  
  // Create 3 options: 1 correct + 2 fakes
  const optionsSet = new Set<number>([correct]);
  
  while (optionsSet.size < 3) {
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
  if (level !== 4) return 10;
  
  // Level 4 speed scaling
  if (questionIndex < 3) return 10;
  if (questionIndex < 6) return 7;
  return 5;
};

export const calculatePoints = (isCorrect: boolean, timeLeft: number): number => {
  if (!isCorrect) return 0;
  let points = 10;
  if (timeLeft > 5) points += 5; // Fast bonus
  return points;
};
