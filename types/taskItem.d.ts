export type TaskItem = {
  id: number;
  name: string;
  note: string;
  isComplete: boolean;
  priority: number;
  orderNo: number;
  teamId?: number;
  taskListId?: number;
  createdBy: string;
  listName?: string;
  teamName?: string;
};
