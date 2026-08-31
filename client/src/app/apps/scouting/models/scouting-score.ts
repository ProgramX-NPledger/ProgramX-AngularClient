export interface ScoutingScore {
  id: string;
  name: string;
  isDynamicallyCalculated: boolean;
  ordinal: number;
  score: number;
  createdAt: Date;
  updatedAt: Date | null;
}
