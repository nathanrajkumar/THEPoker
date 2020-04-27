import { Injectable } from '@angular/core';
import { Card, Suit, Name } from './model/Card';
import { User } from './model/User';
import { Observable, of } from 'rxjs';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  cards : Array<Card>;
  shuffledDeck : Array<Card>;

  constructor(private gameService : GameService) { }

  getDeckOfCards() : Observable<Array<Card>> {
    this.cards = new Array<Card>();

    Object.keys(Suit).forEach (suit => {
      Object.keys(Name).forEach ( name => {
        const card  = new Card();
        card.name = name;
        card.rank = +Name[name];
        card.suit = suit;
        this.cards.push(card);
      })
    })
    return of (this.cards);
  }

  shuffleDeck() : Observable<Array<Card>> {
    let deck = new Array<Card>();
    this.shuffledDeck = new Array<Card>();

    this.getDeckOfCards().subscribe(
      (next) => {
        deck = next;
      }
    )

    while (this.shuffledDeck.length < deck.length) {
      deck.forEach( (card) => {
        this.gameService.randomizer(0, deck.length - 1).subscribe(
          (rNumber) => {
            const randomNumber = rNumber;
            const randomCard = deck[randomNumber];
            if (!this.shuffledDeck.includes(randomCard)) {
              this.shuffledDeck.push(randomCard);
            }
          }
        )
      })
    }
    return of (this.shuffledDeck);
  }

  deal(shuffledDeck : Array<Card>, players : Array<User>) : Observable<Array<User>> {
    shuffledDeck.reverse;
    players.forEach( player => {
      player.hand = new Array<Card>();
      for (let i = 0; i < 2 ; i ++) {
        const card = shuffledDeck.pop();
        player.hand.push(card);
      }
    })
    return of (players);
  }

  burnAndTurn(shuffledDeck : Array<Card>, players : Array<User>, numberOfCardsToTurn : number) : Observable<Array<Card>> {
    players.forEach (
      (player) => {
        player.hand.forEach(
          card => {
            shuffledDeck.splice(shuffledDeck.indexOf(card), 1);
          }
        )
      }
    )
    const cardsToTurn = new Array<Card>();
    let discardPile = new Array<Card>();
    discardPile.push(shuffledDeck.pop());
    for (let i = 0; i < numberOfCardsToTurn; i++) {
      cardsToTurn.push(shuffledDeck.pop());
    }

    return of (cardsToTurn)
  }
}
