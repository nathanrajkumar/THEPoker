import { Injectable } from '@angular/core';
import { of, Observable, Observer } from 'rxjs';
import { Card } from './model/Card';
import { Button } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  loadImage(canvas : HTMLCanvasElement, ctx: CanvasRenderingContext2D) : Observable<HTMLImageElement>{
    const img = new Image();
    img.src = '../../assets/sampleImage.jpg';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 300, 160);
    }
    return of (img);
  }

  getCardImagePath(cardArray? : Array<Card>, card? : Card) : Observable<Array<string>> {
    const imgArray = new Array<string>();
    for (const card of cardArray) {
      imgArray.push(`../../assets/PlayingCards/${card.suit}/${card.suit}-${card.name}.png`);
    }
    return of (imgArray);
  }

  loadCardImages(canvas : HTMLCanvasElement, imgArray : Array<string>, imgsAre : string) : Observable<Array<HTMLImageElement>> {
    const ctxHand = canvas.getContext('2d');
    const ch = canvas.height;
    const cw = canvas.width;
    const imgs = new Array<HTMLImageElement>();
    let imagesOK = 0;
    for (let i=0; i< imgArray.length; i++) {
      const img = new Image();
      imgs.push(img);
      img.onload = () => {
        imagesOK++
        if (imagesOK >= imgArray.length ) {
          this.imagesAreNowLoaded(ctxHand, imgs, cw, ch, imgsAre);
        }
      };
      img.onerror = () => {
        console.log(`image load failed`);
      };
      img.src = imgArray[i];
    }
    return of (imgs);
  }

  imagesAreNowLoaded(ctx : CanvasRenderingContext2D, imgs : Array<HTMLImageElement>, cWidth : number, cHeight : number, imgsAre : string) {
    if (imgsAre === "hand") {
      ctx.drawImage(imgs[0],0,0, 220,cHeight);
      ctx.fillText("card1.png", 0, 0);

      ctx.drawImage(imgs[1],70,0, 220, cHeight);
      ctx.fillText("card2.png", 0, 200);
    } else {
      ctx.drawImage(imgs[0],0,0, cWidth / 2, cHeight);
      ctx.fillText("card1.png", 0, 0);

      ctx.drawImage(imgs[1],70,0, 220, cHeight);
      ctx.fillText("card2.png", 0, 200);
    }

  }

  generateRoundedCanvas(canvas : HTMLCanvasElement, cvCtx : CanvasRenderingContext2D, fillString : string, rectX : number, rectY : number, rectWidth : number, rectHeight : number, cornerRadius : number) : Observable<HTMLCanvasElement> {
        // Set faux rounded corners
        cvCtx.lineJoin = "round";
        cvCtx.lineWidth = cornerRadius;

        // Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
        cvCtx.strokeRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
        cvCtx.fillRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);

        cvCtx.fillStyle = "white";
        cvCtx.font = "bold 16px Arial";
        cvCtx.fillText(fillString, (canvas.width / 2) - 90, (canvas.height / 2) - 5);
        return of (canvas);
  }

  getLayoutPositioningFace(canvas : HTMLCanvasElement) : Observable<HTMLCanvasElement>{
    canvas.style.position = 'fixed';
    if (canvas.id === "player_face_1") {
      canvas.style.top = '80px';
      canvas.style.left = '250px';
    } else if (canvas.id === 'player_face_2') {
      canvas.style.top = '40px';
      canvas.style.left = '660px';
    } else if (canvas.id === 'player_face_3') {
      canvas.style.top = '80px';
      canvas.style.left = '1100px';
    } else if (canvas.id === 'player_face_6') {
      canvas.style.top = '400px';
      canvas.style.left = '150px';
    } else if (canvas.id === 'player_face_5') {
      canvas.style.top = '450px';
      canvas.style.left = '660px';
    } else {
      canvas.style.top = '400px';
      canvas.style.left = '1200px';
    }

    return of (canvas);

  }

    getLayoutPositioningHand(canvas : HTMLCanvasElement) : Observable<HTMLCanvasElement>{
      canvas.style.position = 'fixed';
      if (canvas.id === "player_hand_1") {
        canvas.style.top = '80px';
        canvas.style.left = '400px';
      } else if (canvas.id === "player_hand_2"){
        canvas.style.top = '40px';
        canvas.style.left = '810px';
      } else if (canvas.id === "player_hand_3") {
        canvas.style.top = '80px';
        canvas.style.left = '1250px';
      } else if (canvas.id === "player_hand_6") {
        canvas.style.top = '400px';
        canvas.style.left = '300px';
      } else if (canvas.id === "player_hand_5") {
        canvas.style.top = '450px';
        canvas.style.left = '810px';
      } else {
        canvas.style.top = '400px';
        canvas.style.left = '1350px';
      }

      return of (canvas);
    }

 getLayoutPositioningChipValue(label : HTMLLabelElement) : Observable<HTMLLabelElement>{
    label.style.position = 'fixed';
    if (label.id === "player_chip_value_1") {
      label.style.top = '230px';
      label.style.left = '330px';
    } else if (label.id === "player_chip_value_2"){
      label.style.top = '190px';
      label.style.left = '740px';
    } else if (label.id === "player_chip_value_3") {
      label.style.top = '230px';
      label.style.left = '1180px';
    } else if (label.id === "player_chip_value_6") {
      label.style.top = '550px';
      label.style.left = '230px';
    } else if (label.id === "player_chip_value_5") {
      label.style.top = '600px';
      label.style.left = '740px';
    } else {
      label.style.top = '550px';
      label.style.left = '1280px';
    }
    return of (label);
  }

  getLayoutPositioningDecisionButton(btn : HTMLButtonElement) : Observable<HTMLButtonElement> {
    btn.style.position = 'fixed';
    if (btn.id === "player_decision_1") {
      btn.style.top = '70px';
      btn.style.left = '200px';
    } else if (btn.id === "player_decision_2"){
      btn.style.top = '30px';
      btn.style.left = '610px';
    } else if (btn.id === "player_decision_3") {
      btn.style.top = '70px';
      btn.style.left = '1050px';
    } else if (btn.id === "player_decision_6") {
      btn.style.top = '380px';
      btn.style.left = '100px';
    } else if (btn.id === "player_decision_5") {
      btn.style.top = '430px';
      btn.style.left = '610px';
    } else {
      btn.style.top = '380px';
      btn.style.left = '1150px';
    }
    return of (btn);
  }

  flipCard(showCard : boolean, cardImgTray? : Array<HTMLImageElement>, cardArray? : Array<Card>) : Observable<Array<HTMLImageElement>>{
    if (showCard === true) {
      this.getCardImagePath(cardArray).subscribe (
        (stringArray) => {
          for(let i = 0; i < stringArray.length; i++) {
            cardImgTray[i].src = stringArray[i]
          }
        }
      )
    } else {
      cardImgTray.forEach(img => {
        img.src = '../../assets/PlayingCards/BACKING.png';
      })
    }
    return of (cardImgTray);
  }


}

