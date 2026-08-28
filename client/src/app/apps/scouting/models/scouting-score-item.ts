export interface ScoutingScoreItem {
  id: string;
  osmMemberId: number;
  date: Date;
  notes: string | null;
  scoreName: string;
  score: number;
  patrolName: string;
  schemaVersionNumber: number;
  memberName: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
