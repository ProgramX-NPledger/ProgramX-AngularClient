export interface ScoutingScoreItem {
  id: string;
  osmMemberId: number;
  date: Date;
  notes: string | null;
  scoreName: string;
  score: number;
  patrolName: string;
  schemaVersionNumber: number;
  createdAt: Date;
  updatedAt: Date | null;
}
