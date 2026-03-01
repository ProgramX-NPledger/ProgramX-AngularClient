export interface ApplicationMetaData {
  friendlyName: string,
  description: string,
  imageUrl: string | null,
  name: string,
  requiresRoleNames: string[],
  targetUrl: string
}
