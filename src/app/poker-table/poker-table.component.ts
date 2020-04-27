import { Component, OnInit, ViewEncapsulation, EventEmitter} from '@angular/core';
import { DataService } from '../data.service';
import { Room, Table } from '../model/Table';
import { MessageService } from 'primeng/api/';
import { Router } from '@angular/router';



@Component({
  selector: 'app-poker-table',
  templateUrl: './poker-table.component.html',
  styleUrls: ['./poker-table.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PokerTableComponent implements OnInit {

  rooms : Array <Room>;
  players : Array<string>;
  tables : Array<Table>;
  selectedRoom : Room;
  showActivePlayers = false;
  dataChangedEvent = new EventEmitter;

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }

  ]

  constructor(private dataService : DataService, private messageService : MessageService, private router : Router) {  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.dataService.getRooms().subscribe(
      (room) => {
        this.rooms = room;
      }
    )
  }



  getActivePlayers(table : Table) {
    this.players = new Array<string>();
    for (const player of table.players) {
      this.players.push(player.name);
    }
    let re = /\,/gi;
    this.messageService.add({ severity: 'info', summary: `Roster : ${table.tableName}`, life: 30000, detail: this.players.toString().replace(re,'\n')});
  }

  navigateToJoinGame(tableId: number) {
      this.router.navigate(['gamecontrols', 'joingame'], {queryParams: {action: 'view', id: tableId}});
  }

  leaveGame(tables : Array<Table>, tableId : number) {
    this.dataService.leaveGame(tables, tableId).subscribe(
      (next) => {
        this.dataChangedEvent.emit;
        this.router.navigate(['']);
      }
    );
  }








}
