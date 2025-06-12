import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordOfDayComponent } from "./components/word-of-day/word-of-day.component";
import { FooterComponent } from "./components/footer/footer.component";
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { CommonModule } from '@angular/common';
import { RatingAppComponent } from "./components/rating/rating.component";
import { HeaderComponent } from './components/header/header.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-root',
  imports: [ WordOfDayComponent, FooterComponent, CommonModule, FavoritosComponent, RatingAppComponent, HeaderComponent, RankingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  user: SocialUser | null = null;
  isLogged: boolean = false;
  title = 'andalucismo';
  
  constructor(private authService: SocialAuthService) {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.isLogged = !!user;
    });
  }

}
