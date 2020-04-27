import { Injectable } from '@angular/core';
import { Card, Suit, Name } from './model/Card';
import { Table, Room } from './model/Table';
import { User } from './model/User';
import { Observable, of } from 'rxjs';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  tables : Array<Table>;
  users : Array<User>;
  rooms : Array<Room>;
  selectedRoom : Room;
  selectedTable : Table;


  constructor() {
    /************* DUMMY DATA *******************/

    //USERS

    this.users = new Array<User>();
    const user1 = new User();
    user1.id = 1;
    user1.name = 'Nathan';
    user1.money = 100;

    const user2 = new User();
    user2.id = 2;
    user2.name = 'Amanda';
    user2.money = 100;

    const user3 = new User();
    user3.id = 3
    user3.name = "Ellie"
    user3.money = 100;

    const user4 = new User();
    user4.id = 4
    user4.name = 'Archie'
    user4.money = 100;

    const user5 = new User();
    user5.id = 5
    user5.name = 'Trevor'
    user5.money = 100;

    const user6 = new User();
    user6.id = 6
    user6.name = 'Christina'
    user6.money = 100;

    this.users.push(user1);
    this.users.push(user2);
    this.users.push(user3);
    this.users.push(user4);
    this.users.push(user5);
    this.users.push(user6);


    //TABLES
    const table1 = new Table();

    table1.id = 1;
    table1.tableCreator = 'Nathan'
    table1.tableName = 'Table One'
    table1.startingPot = 500
    table1.players.push(user1);
    table1.players.push(user2);
    table1.playerCount = table1.players.length;


    const table2 = new Table();
    table2.id = 2;
    table2.tableCreator = 'Amanda'
    table2.tableName = 'Table Two'
    table2.startingPot = 1000
    table2.players.push(user2);
    table2.players.push(user3);
    table2.players.push(user4);
    table2.playerCount = table2.players.length;

    const table3 = new Table();
    table3.id = 3;
    table3.tableCreator = 'Ellie'
    table3.tableName = 'Table Three'
    table3.startingPot = 1000
    table3.players.push(user1);
    table3.players.push(user3);
    table3.players.push(user5);
    table3.players.push(user6);
    table3.playerCount = table3.players.length;

    const table4 = new Table();
    table4.id = 4;
    table4.tableCreator = 'Archie'
    table4.tableName = 'Table Four'
    table4.startingPot = 2000
    table4.players.push(user1);
    table4.players.push(user3);
    table4.playerCount = table4.players.length;

    const table5 = new Table();
    table5.id = 5;
    table5.tableCreator = 'Ellie'
    table5.tableName = 'Table Five'
    table5.startingPot = 3000
    table5.players.push(user1);
    table5.playerCount = table5.players.length;

    const table6 = new Table();
    table6.id = 6;
    table6.tableCreator = 'Archie'
    table6.tableName = 'Table Six'
    table6.startingPot = 200
    table6.players.push(user1);
    table6.players.push(user2);
    table6.players.push(user3);
    table6.players.push(user4);
    table6.players.push(user5);
    table6.players.push(user6);
    table6.playerCount = table6.players.length;

    const table7 = new Table();
    table7.id = 7;
    table7.tableCreator = 'Nathan'
    table7.tableName = 'Table Seven'
    table7.startingPot = 500
    table7.playerCount = table7.players.length;

    const table8 = new Table();
    table8.id = 8;
    table8.tableCreator = 'Amanda'
    table8.tableName = 'Table Eight'
    table8.startingPot = 1000
    table8.players.push(user1);
    table8.players.push(user4);
    table8.players.push(user3);
    table8.players.push(user6);
    table8.playerCount = table8.players.length;





    //ROOMS
    this.rooms = new Array<Room>();
    const room1 = new Room();
    room1.id = 1
    room1.name = "Nathan's Poker Pit"
    room1.creator = "Nathan"
    room1.tables.push(table1);
    room1.tables.push(table2);

    const room2 = new Room();
    room2.id = 2
    room2.name = "Amanda's Boom Boom Room"
    room2.creator = "Amanda"
    room2.tables.push(table3);
    room2.tables.push(table4);

    const room3 = new Room();
    room3.id = 3
    room3.name = "Ellies Cheese Hut"
    room3.creator = "Ellie"
    room3.tables.push(table5);
    room3.tables.push(table6);

    const room4 = new Room();
    room4.id = 4
    room4.name = "Archies Bone Club"
    room4.creator = "Archie"
    room4.tables.push(table7);
    room4.tables.push(table8);

    this.rooms.push(room1);
    this.rooms.push(room2);
    this.rooms.push(room3);
    this.rooms.push(room4);



  }



  getTables() : Observable<Array<Table>> {
    return of (this.tables);
  }

  getUsers() : Observable<Array<User>> {
    return of (this.users);
  }

  getRooms() : Observable<Array<Room>> {
    return of (this.rooms);
  }

  getRoom(id : number) : Observable<Room> {
    return of (this.rooms.find( room => room.id === id))
  }

  getAllPlayers(tables : Array<Table>) : Observable<Array<User>> {
    const players = new Array<User>();
    for (const table of tables) {
      for (const player of table.players) {
        players.push(player);
      }
    }
    return of (players);
  }

  getTable(roomId : number, tableId : number) : Observable<Table> {
    this.selectedRoom = new Room();
    this.selectedRoom = this.rooms.find(room => room.id === +roomId);
    const tables = this.selectedRoom.tables;
    this.selectedTable = new Table();
    this.selectedTable = tables.find( table => table.id === +tableId);
    return of (this.selectedTable)
  }

  leaveGame(tables : Array<Table>, tableId) : Observable<any> {
    const gameToLeave = tables.find(table => table.id === tableId);
    tables.splice(tables.indexOf(gameToLeave), 1);
    return of (null)
  }




}
