
export interface Muscle {
  id: string;
  name: string;
  region: string;
  definition: string;
  origin: string;
  path: string;
  termination: string;
  innervation: string;
  action: string;
  relations: string;
  clinicalApplications: string;
}

export interface CardType {
  id: string;
  type: 'reference' | 'answer';
  muscleId: string;
  characteristic?: 'definition' | 'origin' | 'path' | 'termination' | 'innervation' | 'action' | 'relations' | 'clinicalApplications';
  content: string;
}

export interface GameSession {
  id: string;
  region: string;
  muscles: Muscle[];
  startTime: Date;
  endTime?: Date;
  score: number;
}

export interface UserProgress {
  userId: string;
  completedSessions: GameSession[];
  totalScore: number;
  musclesLearned: string[];
}
