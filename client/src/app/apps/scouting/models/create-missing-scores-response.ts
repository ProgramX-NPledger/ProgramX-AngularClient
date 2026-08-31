import {ScoutingScore} from './scouting-score';

export interface CreateMissingScoresResponse {
  successfullyCreatedScores: ScoutingScore[],
  failedToCreateScores: ScoutingScore[]
}
