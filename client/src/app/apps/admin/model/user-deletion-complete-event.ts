
export interface UserDeletionCompleteEvent {
  usersToDelete:string[];
  usersSuccessfullyDeleted:string[];
  usersFailedToDelete:string[];
}
