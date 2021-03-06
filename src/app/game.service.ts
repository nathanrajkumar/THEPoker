import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './model/User';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  setDealer(players : Array<User>) : Observable<Array<User>> {

    for (const player of players) {
      player.isDealer = false;
    }
    let randNum : number;
    this.randomizer(1, players.length).subscribe(
      (rn) => {
        randNum = rn;
      }
    )
    const dealer = players.find( player => player.id === randNum);

    dealer.isDealer = true;

    return of (players);
  }

  randomizer(minIterator : number, maxIterator : number) : Observable<number> {
    return of (Math.floor(Math.random() * (maxIterator - minIterator + 1)) + minIterator);
  }

  getNextTurn(players : Array<User>, currentActivePlayer : User) : Observable<User> {

    let activePlayers = new Array<User>();
    let nextPlayer : User;
    let nextPlayerFind = players.find(player => player.id === currentActivePlayer.id + 1);
    let currentPlayerIndex = players.findIndex(player => player.id === currentActivePlayer.id);
    console.log(nextPlayerFind);

    players.forEach( player => {
      if (!player.isFolded)
      activePlayers.push(player);
    })
    console.log(activePlayers);
    // if the player in players exists as an active player and is not folded
    if (currentPlayerIndex < players.length - 1) {
      if (activePlayers.find(player => player.id === nextPlayerFind.id) && !nextPlayerFind.isFolded ) {
        nextPlayer = nextPlayerFind;
      } else {
        if (activePlayers.findIndex(player => player.id === currentActivePlayer.id) === activePlayers.length -1) {
          nextPlayer = activePlayers[0];
        } else {
          nextPlayer = activePlayers[activePlayers.findIndex(player => player.id === currentActivePlayer.id) + 1];
        };
      }
    } else {
      nextPlayer = activePlayers[0];
    }
    return of (nextPlayer);
  }

  setLittleBlind(players : Array<User> , dealer : User, blindAmount : number) : Observable<Array<User>> {
    let littleBlinder = new User();
    this.getPlayerIndex(players, dealer).subscribe(
      index => {
        if (index === players.length - 1) {
          littleBlinder = players[0];
        } else {
          littleBlinder = players[index + 1]
        }
      }
    )
    littleBlinder.money = littleBlinder.money - blindAmount;
    littleBlinder.isLittleBlind = true;
    return of (players);
  }

  setBigBlind(players : Array<User> , dealer : User, blindAmount : number) : Observable<Array<User>> {
    let bigBlinder = new User();
    this.getPlayerIndex(players, dealer).subscribe(
      index => {
        //5
        if (index === players.length - 1) {
          bigBlinder = players[1];
          //4
        } else if (index === players.length - 2) {
          bigBlinder = players[0];
          //3 and under
        } else if (index === players.length - 3) {
          bigBlinder = players[players.length -1]
        } else {
          bigBlinder = players[index + 2]
        }

      }
    )
    bigBlinder.money = bigBlinder.money - blindAmount;
    bigBlinder.isBigBlind = true;
    console.log(players);
    return of (players);
  }

  setUnderTheGun(players: Array<User>, bigBlinder : User) : Observable<Array<User>> {
    let underTheGun = new User();
    this.getPlayerIndex(players, bigBlinder).subscribe(
      (index) => {
        if(index === players.length - 1) {
          underTheGun = players[0]
        } else {
          underTheGun = players[index + 1];
        }
      }
    )
    underTheGun.isUnderTheGun = true;
    console.log(players);
    return of (players);
  }

  getPlayerIndex(players : Array<User>, player : User) : Observable<number> {
    return of (players.findIndex(p => p.id === player.id))
  }

  initializeCallAmount(players : Array<User>,  bigBlindAmount : number, littleBlindAmount : number , callAmount : number, betMap : Map<number, number>) : Observable<Map<number, number>> {
    for (const player of players) {
      if (player.isDealer || player.isBigBlind) {
        callAmount = bigBlindAmount
        betMap.set(player.id, callAmount);
      } else if (player.isLittleBlind) {
        callAmount = bigBlindAmount - littleBlindAmount
        betMap.set(player.id, callAmount);
      } else {
        callAmount = bigBlindAmount;
        betMap.set(player.id, callAmount);
      }
    }
    return of (betMap);
  }

  getCallAmount(player : User, originalCallAmount : number, raiseArray : Array<number>) : Observable<number> {
    console.log("call amount" + originalCallAmount);
    let raiseAmount = raiseArray.reduce((a, b) => a + b, 0);
    let newCallAmount : number;
    if (player.bet === 0) {
      newCallAmount = originalCallAmount + raiseAmount;
    } else {
      newCallAmount = originalCallAmount + raiseAmount - player.bet;
    }

    return of (newCallAmount);
  }

  clearPlayerBettingRoundAttributes(players : Array<User>) : Observable<Array<User>> {
    players.forEach((player) => {
      player.isBigBlind = false;
      player.isLittleBlind = false;
      player.isCalled = false;
      player.isUnderTheGun = false;
      player.isDealer = false;
      player.bet = 0;
    })
    return of (players);
  }
}
