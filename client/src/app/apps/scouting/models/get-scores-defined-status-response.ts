import {ScoutingScore} from './scouting-score';

export interface GetScoresDefinedStatusResponse {
  hasAllScoresDefined: boolean;
  missingScores: ScoutingScore[]

}
