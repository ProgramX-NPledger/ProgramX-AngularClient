export interface GetApplicationsCriteria {
  containingText: string | null | undefined;
  withinRoles: string | null | undefined;
  continuationToken?: string;
}
