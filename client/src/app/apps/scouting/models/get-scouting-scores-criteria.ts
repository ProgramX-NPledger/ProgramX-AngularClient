export interface GetScoutingScoresCriteria {
  fromDate?: string | null;
  toDate?: string | null;
  osmScoutId?: string | null;
  scoreId: string | null;
  continuationToken?: string | null;
}
