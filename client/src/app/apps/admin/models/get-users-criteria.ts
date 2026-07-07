export interface GetUsersCriteria {
  containingText?: string | null;
  hasRole?: string | null;
  hasApplication?: string | null;
  continuationToken?: string | null;
}
