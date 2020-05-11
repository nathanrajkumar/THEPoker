import { Card } from './Card';

export class User {
  id : number;
  name : string;
  password : string
  hand : Array<Card>
  money : number
  bet : number
  isLoggedIn : boolean
  isDealer : boolean
  isBigBlind : boolean
  isLittleBlind : boolean
  isUnderTheGun : boolean
  isFolded : boolean
  isCalled : boolean
}
