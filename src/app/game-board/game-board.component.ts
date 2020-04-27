import { EventEmitter, Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, AfterContentChecked, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewChecked, Output } from '@angular/core';
import { Card } from '../model/Card';
import { DataService } from '../data.service';
import { User } from '../model/User';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../image.service';
import { CardService } from '../card.service';
import { Table } from '../model/Table';
import { GameService } from '../game.service';
import { PlayerCardComponent } from '../player-card/player-card.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit, AfterViewInit, AfterViewChecked {


  private shuffledDeck = new Array<Card>();
  table = new Table();
  players = new Array<User>();
  private roomId : number;
  private tableId : number;
  cardTrayCards : Array<Card>;
  trayImages = new Array<HTMLImageElement>();

  flop = new Array<Card>();
  turn = new Card();
  river = new Card();

  dealer = new User();
  activePlayer : User;

  betAmount = 0 ;
  potAmount = 0;
  currentBet : number;
  callAmount : number;
  hasBet = false;

  betAmountCheck = new Array<number>();
  allBetList = new Array<number>();
  betMap = new Map<number, number>();
  callDifference : number ;
  bigBlind: number;

  @Output() currentBetEvent = new EventEmitter();

  constructor(private dataService : DataService,
              private cardService : CardService,
              private imageService : ImageService,
              private gameService : GameService,
              private route : ActivatedRoute) { }


  ngOnInit(): void {
    this.onGameLoad();

  }

  onGameLoad() {

    for (let i = 1; i <= 5; i ++) {
      this.trayImages.push(<HTMLImageElement>document.getElementById(`tray_card_${i}`));
    }

    for (const img of this.trayImages) {
      img.src = '../../assets/PlayingCards/BACKING.png';
    }

    //GAME SETUP AND DEAL

    this.processUrlParams();
    this.dataService.getTable(this.roomId, this.tableId).subscribe(
      (table) => {
        this.players = table.players;
        this.table = table;
      }
    )
    this.cardService.shuffleDeck().subscribe(
      next => {
        this.shuffledDeck = next;
      }
    );
    this.cardService.deal(this.shuffledDeck, this.players).subscribe (
      (next) => {
        this.players = next;
      }
    )
    // PRE-FLOP ANTE AND BETTING

    //TODO: create ante - big blind and little blind -- blind amounts are stacked at 10% of the lowest chip amount

    this.cardService.burnAndTurn(this.shuffledDeck, this.players, 5).subscribe(
      (next) => {
        this.cardTrayCards = next;
      }
    )
    for (let i = 0; i < 3; i++) {
      this.flop.push(this.cardTrayCards[i]);
    }
    this.turn = this.cardTrayCards[3];
    this.river = this.cardTrayCards[4];

    // need to do pre flop betting first before burn and turn


    this.gameService.setDealer(this.players).subscribe(
      (players) => {
        for (const player of players) {
          if (player.isDealer === true) {
            this.dealer = player;
            this.activePlayer = player;
          }
        }
      }
    )
    console.log(`Dealer : ${this.activePlayer.name}`);

    // PRE-FLOP ANTE AND BETTING

    //TODO: create ante - big blind and little blind -- blind amounts are stacked at 10% of the lowest chip amount


    this.gameService.setLittleBlind(this.players, this.dealer, 25).subscribe (
      players => {
        this.players = players;
        this.betAmount = this.betAmount + 25;
      }
    )

    this.gameService.setBigBlind(this.players, this.dealer, 50).subscribe (
      players => {
        this.players = players;
        this.betAmount = this.betAmount + 50;
        this.bigBlind = 50;
      }
    )

    this.callAmount = this.bigBlind;

  }

  processUrlParams() {
    this.route.queryParams.subscribe (
      (params) => {
        this.tableId = params['tableId'];
        this.roomId = params['roomId']
      }
    )
  }

  ngAfterViewChecked() {
    const activeBtn = <HTMLButtonElement>document.getElementById(`player_decision_${this.activePlayer.id}`);
    this.imageService.getLayoutPositioningDecisionButton(activeBtn).subscribe();
  }

  ngAfterViewInit() {

    const potCanvas = <HTMLLabelElement>document.getElementById('pot_value');
    this.getLayoutPositioningPot(potCanvas);
    const chipsImage = <HTMLImageElement>document.getElementById('chips');
    chipsImage.style.position = 'fixed';
    chipsImage.style.width = '7%';
    chipsImage.style.top = '210px';
    chipsImage.style.left = '970px';


  }

  getLayoutPositioningPot(label : HTMLLabelElement) {
    label.style.position = 'fixed';
    label.style.top = '235px';
    label.style.left = '900px';
  }

  getPotAmount(betAmount : string) {
    this.betAmount = this.betAmount + parseInt(betAmount);
    this.betAmountCheck.push(parseInt(betAmount));
    this.allBetList.push(parseInt(betAmount));
    this.betMap.set(this.activePlayer.id, parseInt(betAmount));
    const firstBetter = this.betMap.entries().next().value;
    //this.checkForBettingRoundEnd(firstBetter ,this.betAmountCheck, parseInt(betAmount));
    this.currentBet = this.betAmountCheck[0];
  }

  getNextPlayer(player : string) {
    this.activePlayer = <User>JSON.parse(player);
    const firstBetter = this.betMap.entries().next().value;

    this.checkForBettingRoundEnd(firstBetter ,this.betAmountCheck, this.betAmount);
  }

  checkForBettingRoundEnd(firstBetter : Map<number, number>, betAmountCheck : Array<number>, betAmount : number) {

    const firstBetKey = firstBetter[0];
    const firstBetValue = firstBetter[1];
    console.log(this.activePlayer.id)
    console.log(firstBetKey);
    console.log(betAmountCheck.length);
    // check to see if the loop has come back to the dealer to determine call amount
    if (this.activePlayer.id === firstBetKey && betAmountCheck.length > 1) {
      console.log("circled around to dealer");
      this.hasBet = true;
    }

    const allEqual = betCheckArray => betCheckArray.every( val => val === betCheckArray[0]);

    // if all the values in betAmountCheck is not equal, then get the difference between the first bet value and the current bet
    // to get the raise amount.  If there is a previous bet aka after the first round of betting, just get the difference to get the
    // amount to call.

    // During pre betting, the amount to call is the big blind.

    if (!allEqual(betAmountCheck)) {
      this.callDifference = betAmountCheck[betAmountCheck.length -1] - firstBetValue;
      console.log(betAmount);
      console.log( betAmountCheck[betAmountCheck.length]);
      console.log(`Previous Bet: ${betAmountCheck[betAmountCheck.length - 2]}`)
      console.log(`Raised : ${this.callDifference}`);
      console.log(`original bet: ${firstBetValue}`);
      console.log(`difference between bet now vs bet before: ${this.callDifference}`);
      if (this.callDifference > 0) {
        this.callAmount = firstBetValue + this.callDifference;
        console.log(`add difference to original bet to get call amount : ${this.callAmount}`);
      }
      console.log(this.hasBet);

      if (this.hasBet) {
        this.callAmount = this.callDifference;
      }

      console.log(`To call : ${this.callAmount}`);
      // erase temp array and push new control value
      betAmountCheck.splice(0, this.betAmountCheck.length);
      betAmountCheck.push(betAmount);

    }
    //console.log(`Call : ${fullBetList[0] + callAmount}`);

    console.log(this.betAmountCheck, this.betAmount, betAmount)
  }











}
