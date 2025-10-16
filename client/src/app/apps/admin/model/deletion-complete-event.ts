
export interface DeletionCompleteEvent {
  usersToDelete:string[];
  usersSuccessfullyDeleted:string[];
  usersFailedToDelete:string[];
}
