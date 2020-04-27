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
    const currentPlayerIndex = players.findIndex(player => player.id === currentActivePlayer.id);
    let nextPlayer : User;
    if (currentPlayerIndex + 1 != players.length) {
      nextPlayer = players[currentPlayerIndex + 1];
    } else {
      nextPlayer = players[0];
    }
    return of (nextPlayer);
  }

  setLittleBlind(players : Array<User> , dealer : User, blindAmount : number) : Observable<Array<User>> {
    let littleBlinder = new User();
    this.getDealerIndex(players, dealer).subscribe(
      index => {
        console.log(index);
        console.log(players[index]);
        if (index === players.length - 1) {
          littleBlinder = players[0];
        } else {
          littleBlinder = players[index + 1]
        }
      }
    )
    littleBlinder.money = littleBlinder.money - blindAmount;
    return of (players);
  }

  setBigBlind(players : Array<User> , dealer : User, blindAmount : number) : Observable<Array<User>> {
    let bigBlinder = new User();
    this.getDealerIndex(players, dealer).subscribe(
      index => {
        //5
        if (index === players.length - 1) {
          bigBlinder = players[1]
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
    console.log(players);
    return of (players);
  }

  getDealerIndex(players : Array<User>, dealer : User) : Observable<number> {
    return of (players.findIndex(player => player.id === dealer.id))
  }






}
