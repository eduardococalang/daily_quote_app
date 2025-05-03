import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordOfDayComponent } from "./components/word-of-day/word-of-day.component";
import { FooterComponent } from "./components/footer/footer.component";
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { CommonModule } from '@angular/common';
import { RatingAppComponent } from "./components/rating/rating.component";
import { HeaderComponent } from './components/header/header.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WordOfDayComponent, FooterComponent, CommonModule, FavoritosComponent, RatingAppComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'andalucismo';
  isLogged: any;
}
