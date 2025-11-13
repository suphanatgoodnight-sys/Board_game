export interface BoardGame {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  selected: boolean;
}

export enum View {
  List = 'LIST',
  BorrowForm = 'BORROW_FORM',
  BorrowSuccess = 'BORROW_SUCCESS',
  ManageGames = 'MANAGE_GAMES',
}

export interface BorrowerInfo {
  name: string;
  studentId: string;
  classroom: string;
  games: string[];
}
