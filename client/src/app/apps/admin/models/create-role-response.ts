import {User} from '../../../models/user';

export interface CreateRoleResponse {
  id: string;
  name: string;
  description: string;
  users: User[];
  versionNumber: number;
  createdAt: Date;
  updatedAt: Date;
}
