export interface CatchMindRecord {
  gameId: number;
  playId: string;
  answer: string;
  round: number;
  state: CatchMindState;
  drawerIndex: number;
  scores: Record<string, number>;
  totalScores: Record<string, number>;
  forStart: number[];
}

export interface CatchMindGameRoom {
  title: string;
  gameId: 1;
  minimumPeople: number;
  maximumPeople: number;
  isPrivate: boolean;
  password?: string;
  participants: Participant[];
}

export interface Participant {
  email: string;
  nickname: string;
  profileImage: string;
  roomId: string;
  socketId: string;

  score: number;
  userId: number;

  connected: boolean;
}
