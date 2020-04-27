import { User } from './User';

export class Room {
  id: number
  name: string
  creator : string
  isPrivate : boolean
  tables = new Array<Table>();
}

export class Table {
  id: number
  tableName : string
  tableCreator : string
  playerCount : number
  startingPot : number
  players = new Array<User>();
}

