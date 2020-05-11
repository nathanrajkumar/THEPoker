import { EventEmitter, Component, OnInit, AfterViewInit, AfterViewChecked, Output, Input } from '@angular/core';
import { Card } from '../model/Card';
import { DataService } from '../data.service';
import { User } from '../model/User';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../image.service';
import { CardService } from '../card.service';
import { Table } from '../model/Table';
import { GameService } from '../game.service';

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

  potAmount = 0 ;
  betAmount = 0;
  currentBet : number;
  callAmount : number;
  hasBet = false;
  raiseAmount = 0;
  raiseArray = new Array<number>();

  betAmountCheck = new Array<number>();
  allBetList = new Array<number>();
  betMap = new Map<number, number>();
  callDifference : number ;
  bigBlind: number;
  littleBlind : number;
  callCheck = new Map();
  check = new Array<User>();

  @Input() activePlayers;
  @Output() currentBetEvent = new EventEmitter();


  constructor(private dataService : DataService,
              private cardService : CardService,
              private imageService : ImageService,
              private gameService : GameService,
              private route : ActivatedRoute) { }


  ngOnInit(): void {
    this.onGameLoad();
    this.loadBettingRound(this.players);

  }

  onGameLoad() {
    for (let i = 1; i <= 5; i ++) {
      this.trayImages.push(<HTMLImageElement>document.getElementById(`tray_card_${i}`));
    }

    this.imageService.flipCard(false, this.trayImages).subscribe(
      (cardTrayImages) => {
        this.trayImages = cardTrayImages;
      }
    );

    //GAME SETUP AND DEAL

    this.processUrlParams();
    this.dataService.getTable(this.roomId, this.tableId).subscribe(
      (table) => {
        this.players = table.players;
        this.players.forEach((player) => {
          player.bet = 0;
        })
        this.activePlayers = table.players;
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

    this.gameService.setDealer(this.players).subscribe(
      (players) => {
        for (const player of players) {
          if (player.isDealer === true) {
            this.dealer = player;
          }
        }
      }
    )

  }

  loadBettingRound(players : Array<User>) {
    this.gameService.clearPlayerBettingRoundAttributes(this.players).subscribe();
    this.gameService.setLittleBlind(this.players, this.dealer, 25).subscribe (
      players => {
        this.players = players;
        this.potAmount = this.potAmount + 25;
        this.littleBlind = 25;
      }
    )

    this.gameService.setBigBlind(this.players, this.dealer, 50).subscribe (
      players => {
        this.players = players;
        this.potAmount = this.potAmount + 50;
        this.bigBlind = 50;
      }
    )

    this.gameService.setUnderTheGun(this.players, this.players.find(p => p.isBigBlind === true)).subscribe (
      players => {
        this.players = players;
        this.activePlayer = players.find(p => p.isUnderTheGun === true);
      }
    )

    this.gameService.initializeCallAmount(this.players, this.bigBlind, this.littleBlind, this.callAmount, this.betMap).subscribe(
      (callAmountMap) => {
        this.betMap = callAmountMap;
        this.callAmount = this.betMap.get(this.dealer.id);

      }
    )

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

  getActivePlayers(playerList : Array<User>) {
    console.log(playerList);
    this.activePlayers = playerList;
  }

  processBet(betAmount : string) {
    this.betAmount = parseInt(betAmount);
    this.potAmount = this.potAmount + this.betAmount;
    this.betAmountCheck.push(this.betAmount);
    this.allBetList.push(this.betAmount);

    if (this.betAmount !== this.callAmount){
      this.raiseAmount = this.betAmount - this.callAmount;
      this.raiseArray.push(this.raiseAmount);
      // erase has called array
      this.callCheck.forEach((val, key) => {
        this.callCheck.delete(key);
      })
    }

    const originalCallAmount = this.betMap.get(this.activePlayer.id);
    if (this.betAmount ===  this.allBetList[length]) {
      this.activePlayer.isCalled = true;
      this.callCheck.set(this.activePlayer.id, "has called" );
    } else if (this.activePlayer.isLittleBlind && (originalCallAmount + this.betAmount) === this.allBetList[length]) {
      this.activePlayer.isCalled = true;
      this.callCheck.set(this.activePlayer.id, "little blind has called");
    } else if (this.betAmount === this.allBetList[length] + this.raiseAmount) {
      this.activePlayer.isCalled = true;
      this.callCheck.set(this.activePlayer.id, "has called with raise");
    } else if (this.activePlayer.isBigBlind && this.betAmount === 0) {
      this.activePlayer.isCalled = true;
      this.callCheck.set(this.activePlayer.id, "big blind has called");
    }

    if (this.activePlayer.isCalled) {
      this.check.push(this.activePlayer)
    }
  }

  getNextPlayer(player : string) {
    this.activePlayer = <User>JSON.parse(player);
    this.callAmount = this.betMap.get(this.activePlayer.id);
    this.gameService.getCallAmount(this.activePlayer, this.callAmount, this.raiseArray).subscribe(
      (callAmount) => {
        this.callAmount = callAmount;
        if (this.activePlayer.isBigBlind && this.raiseAmount === 0) {
          this.callAmount = 0;
        } else if (this.activePlayer.isBigBlind && this.raiseAmount > 0) {
          this.callAmount = this.raiseAmount;
        }
      }
    )
    if(this.check.length === this.activePlayers.length) {
      this.imageService.flipCard(true, this.trayImages, this.flop).subscribe(
        (cardImgTray) => {
          this.trayImages = cardImgTray;
        }
      );
      this.loadBettingRound(this.activePlayers);
    }

  }











}
