import {PreciseAge} from './precise-age';

export interface Member {
  age: PreciseAge;
  firstName: string;
  lastName: string;
  patrolRoleLevel: string;
  isActive: boolean;
  osmScoutId: number;
  fullName: string;
  photoId: string | null;
  osmPatrolId: number | null;
  osmSectionId: number;
  startDate: Date;
  endDate: Date | null;
  patrolNameAndLevel: string | null;
  patrolName: string | null;
  hasInvitations: boolean | null;
}
