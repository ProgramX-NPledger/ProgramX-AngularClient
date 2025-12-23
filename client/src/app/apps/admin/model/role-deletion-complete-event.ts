
export interface RoleDeletionCompleteEvent {
  rolesToDelete:string[];
  rolesSuccessfullyDeleted:string[];
  rolesFailedToDelete:string[];
}
