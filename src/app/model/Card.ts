export class Card {
  rank : number
  suit : string
  name : string
}

export enum Suit {
  HEARTS = "Hearts",
  CLUBS = "Clubs",
  DIAMONDS = "Diamonds",
  SPADES = "Spades"
}

export enum Name {
  ACE = "0",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
  TEN = "10",
  JACK = "11",
  QUEEN = "12",
  KING = "13"
}
