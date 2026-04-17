
export interface Term {
  startDate: Date;
  endDate: Date;
  name: string;
  osmTermId: number;
  masterTerm: string | null;
  isPast: boolean;
  sectionId: number;
  isCurrent: boolean;
}
