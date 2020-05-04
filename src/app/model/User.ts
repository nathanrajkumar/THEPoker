import { Card } from './Card';

export class User {
  id : number;
  name : string;
  password : string
  hand : Array<Card>
  money : number
  loggedIn : boolean
  isDealer : boolean
  isBigBlind : boolean
  isLittleBlind : boolean
  isUnderTheGun : boolean
  call : number
}
