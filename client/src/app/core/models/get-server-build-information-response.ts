export interface GetServerBuildInformationResponse {
  gitCommitHash: string;
  buildNumber: string;
  deployedAt: Date;
}
