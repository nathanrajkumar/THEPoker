import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { User } from '../model/User';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-decision',
  templateUrl: './decision.component.html',
  styleUrls: ['./decision.component.css']
})
export class DecisionComponent implements OnInit, OnChanges {

  @Input() player;
  @Input() players;
  @Input() activePlayer;
  @Input() currentBet;
  @Input() callAmount;

  betAmount : number ;

  @Output() betPlacedEvent = new EventEmitter();
  @Output() turnEndEvent = new EventEmitter();
  @Output() activePlayerEvent = new EventEmitter();

  betForm : FormGroup;

  constructor(private gameService : GameService, private formBuilder : FormBuilder) {
  }

  ngOnInit() {
    this.betForm = this.formBuilder.group({
      bet : new FormControl('')
    })
    //console.log(this.betForm.controls);
  }

  ngOnChanges( changes : SimpleChanges) {
    this.activePlayer = changes['activePlayer'].currentValue;
    //console.log(changes);
  }

  submitBet() {
    //console.log(this.betForm.controls.bet.value);
    this.player.money = this.player.money - this.betForm.controls.bet.value;
    this.betPlacedEvent.emit(this.betForm.controls.bet.value.toString());
    this.getNextTurn(this.player);
    this.betForm.controls.bet.setValidators(Validators.min(this.betForm.controls.bet.value))
  }

  getNextTurn(currentActivePlayer : User) {
    this.gameService.getNextTurn(this.players, currentActivePlayer).subscribe(
      (player) => {
        this.activePlayer = player;
        this.activePlayerEvent.emit(JSON.stringify(player));

      }
    )
  }

  call() {
    console.log('call');
    console.log(this.currentBet);
    console.log(this.callAmount);
  }
}
