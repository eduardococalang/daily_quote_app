import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritosFirebaseService } from '../../services/favoritos-firebase.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';


@Component({
  selector: 'app-ranking',
  imports: [CommonModule, MatCardModule, MatButtonModule ],
  standalone: true,
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit{
  user: SocialUser | null = null;
  isAuthenticated = false;
  isLogged: boolean = false;
  ranking: {palabra: string, contador: number }[] = [];
  private rankingSub!:Subscription;

  constructor(
    private favoritosFirebaseService: FavoritosFirebaseService,
    private authService: SocialAuthService
  ) {
    this.authService.authState.subscribe((user)=>{
      this.user = user;
      this.isLogged = !!user;
    })
  }


ngOnInit(): void {
  this.rankingSub = this.favoritosFirebaseService.getRankingObservable(10)
    .subscribe(data => {
      this.ranking = data;
    });
}


ngOnDestroy(): void {
  this.rankingSub?.unsubscribe
  }

}
