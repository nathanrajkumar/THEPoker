import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { User } from '../model/User';
import { ImageService } from '../image.service';
import { GameService } from '../game.service';
import { LiteralArrayExpr } from '@angular/compiler';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.css']
})
export class PlayerCardComponent implements OnInit, AfterViewInit {



  @Input() player: User;
  @Input() players : Array<User>;
  @Input() id : number;
  @Input() activePlayer : User;
  @Input() currentBet : number;
  @Input() callAmount : number;
  @Input() potAmount : number;

  betAmount : number;
  decisionBtn : HTMLButtonElement;
  playerCards : Array<HTMLImageElement>;

  @Output() betEvent = new EventEmitter<number>();
  @Output() turnEndEvent = new EventEmitter();
  @Output() currentBetEvent = new EventEmitter();
  @Output() getPotAmountEvent = new EventEmitter<number>();
  @Output() getActivePlayersEvent = new EventEmitter<Array<User>>();

  activePlayers = new Array<User>();

  constructor(private imageService : ImageService, private gameService : GameService) { }

  ngOnInit(): void {
    this.players.forEach(player => {
      this.activePlayers.push(player);
    });
  }

  ngAfterViewInit() {
    // for faces
    const canvas = <HTMLCanvasElement>document.getElementById(`player_face_${this.player.id}`);
    const ctx = canvas.getContext('2d');
    this.imageService.loadImage(canvas, ctx).subscribe();
    this.imageService.getLayoutPositioningFace(canvas).subscribe();

    // for cards
    this.imageService.getCardImagePath(this.player.hand).subscribe (
      (next) => {
        this.startLoadingCardImages(next);
      }
    )

    // for chip value
    const chipValue = <HTMLLabelElement>document.getElementById(`player_chip_value_${this.player.id}`);
    this.imageService.getLayoutPositioningChipValue(chipValue).subscribe();


    //for decision button
    this.decisionBtn = <HTMLButtonElement>document.getElementById(`player_decision_${this.activePlayer.id}`);
    if (this.decisionBtn != null ) {
      this.imageService.getLayoutPositioningDecisionButton(this.decisionBtn).subscribe();
    }


  }

  startLoadingCardImages(imgArray : Array<string>) {
    const canvasHand = <HTMLCanvasElement>document.getElementById(`player_hand_${this.player.id}`);
    this.imageService.loadCardImages(canvasHand, imgArray, "hand").subscribe(
      (cardImages) => {
        this.playerCards = cardImages;
      }
    );
    this.imageService.getLayoutPositioningHand(canvasHand).subscribe();
  }

  getActivePlayer(activePlayer : string) {
    this.activePlayer = JSON.parse(activePlayer);
    this.turnEndEvent.emit(JSON.stringify(this.activePlayer));
  }

  getBetAmount(betAmount : number) {
    this.betAmount = betAmount;
    this.betEvent.emit(this.betAmount);
  }

  foldCards() {
    this.imageService.flipCard(false, this.playerCards).subscribe();
    this.activePlayers.find(player => player.id === this.activePlayer.id).isFolded = true;
    console.log(this.activePlayer);

    console.log(this.activePlayers);


    this.activePlayers.splice(0, this.activePlayers.length);
    this.players.forEach((player) => {
      if (!player.isFolded) {
        this.activePlayers.push(player);
      }
    });
    console.log(this.activePlayers);

    this.gameService.getNextTurn(this.players, this.activePlayer).subscribe(
      (nextPlayer) => {
        this.activePlayer = nextPlayer;
        this.turnEndEvent.emit(JSON.stringify(this.activePlayer));
      }
    );

    this.getActivePlayersEvent.emit(this.activePlayers);


    // if everyones folded?  Reshuffle and deal
  }

}
