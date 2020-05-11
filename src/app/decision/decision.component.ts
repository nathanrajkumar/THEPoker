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
  @Input() potAmount;
  @Input() activePlayers;

  betAmount : number ;

  @Output() betPlacedEvent = new EventEmitter();
  @Output() foldCardsEvent = new EventEmitter();
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
    console.log(changes);
  }

  submitBet() {
    this.player.money = this.player.money - this.betForm.controls.bet.value;
    this.betPlacedEvent.emit(this.betForm.controls.bet.value.toString());
    this.player.bet = this.betForm.controls.bet.value;
    this.getNextTurn(this.player);
    this.betForm.controls.bet.setValidators(Validators.min(this.callAmount));
  }

  getNextTurn(currentActivePlayer : User) {
    console.log(this.activePlayers);
    this.gameService.getNextTurn(this.players, currentActivePlayer).subscribe(
      (player) => {
        this.activePlayer = player;
        this.activePlayerEvent.emit(JSON.stringify(player));

      }
    )
  }

  call() {
    this.player.money = this.player.money - this.callAmount;
    this.player.bet = this.callAmount;
    this.betPlacedEvent.emit(this.callAmount);
    this.getNextTurn(this.player);
  }

  fold() {
    this.foldCardsEvent.emit();
  }
}
