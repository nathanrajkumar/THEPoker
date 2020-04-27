import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { PokerTableComponent } from './poker-table/poker-table.component';
import { CarouselModule } from 'primeng/carousel';
import { RouterModule } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {CardModule} from 'primeng/card';
import {MessageService} from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { GameBoardComponent } from './game-board/game-board.component';
import { PlayerCardComponent } from './player-card/player-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecisionComponent } from './decision/decision.component';


const routes = [
  {path : '', component: PokerTableComponent},
  {path : 'game', component : GameBoardComponent}
]

@NgModule({
  exports: [PlayerCardComponent],
  declarations: [
    AppComponent,
    MenuComponent,
    PokerTableComponent,
    GameBoardComponent,
    PlayerCardComponent,
    DecisionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CarouselModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
