export interface CreateRoleRequest {
  name: string;
  description: string;
  addToUsers: string[],
  addToApplications: string[]
}
