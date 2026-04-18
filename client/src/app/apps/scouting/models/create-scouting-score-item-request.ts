export interface CreateScoutingScoreItemRequest {
  date: Date;
  osmScoutId: number;
  osmPatrolId: number;
  patrolName: string;
  scoreName: string;
  score: number;
  notes: string | null;
}
