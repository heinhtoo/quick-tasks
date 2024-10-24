export type TeamList = {
  id: number;
  name: string;
  userIds: number[];
  users: string[];
  noOfIncompletedTasks: number;
  createdBy: string;
};
