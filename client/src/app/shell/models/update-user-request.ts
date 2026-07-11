export interface UpdateUserRequest {
  firstName: string,
  lastName: string | null,
  emailAddress: string | null,
  roles: null // Roles must be null when a user is updating own profile
}

