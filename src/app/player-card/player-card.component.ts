import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { User } from '../model/User';
import { ImageService } from '../image.service';
import { GameService } from '../game.service';
import { timingSafeEqual } from 'crypto';

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

  betAmount : number;
  decisionBtn : HTMLButtonElement;

  @Output() betEvent = new EventEmitter<number>();
  @Output() turnEndEvent = new EventEmitter();
  @Output() currentBetEvent = new EventEmitter();

  finishedPlayers = new Array<User>();

  constructor(private imageService : ImageService, private gameService : GameService) { }

  ngOnInit(): void {
    this.player.loggedIn = false;
    if (this.player.id === 1) {
      this.player.loggedIn = true;
    }
    if (this.player.money == null) {
      this.player.money = 0;
    }
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
    this.imageService.loadCardImages(canvasHand, imgArray, "hand").subscribe();
    this.imageService.getLayoutPositioningHand(canvasHand).subscribe();
  }

  getActivePlayer(activePlayer : string) {
    this.activePlayer = JSON.parse(activePlayer);
    this.turnEndEvent.emit(JSON.stringify(this.activePlayer));
    this.finishedPlayers.push(this.player);
  }

  getBetAmount(betAmount : number) {
    this.betAmount = betAmount;
    this.betEvent.emit(this.betAmount);
  }
}
