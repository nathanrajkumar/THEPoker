import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private dataService : DataService, private router : Router) { }

  ngOnInit(): void {

  }

  navigateToPokerTables() {
    this.router.navigate(['']);
  }

  navigateToHostGame() {
    this.router.navigate(['gamecontrols', 'hostgame']);
  }

  navigateToJoinGame() {
    this.router.navigate(['gamecontrols', 'joingame']);
  }

  navigateToScoreBoard() {
    this.router.navigate(['scoreboard']);
  }

}
