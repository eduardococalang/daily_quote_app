import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritosFirebaseService } from '../../services/favoritos-firebase.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-ranking',
  imports: [CommonModule, MatCardModule, MatButtonModule ],
  standalone: true,
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit{
  ranking: {palabra: string, contador: number }[] = [];
  private rankingSub!:Subscription;

  constructor(
    private favoritosFirebaseService: FavoritosFirebaseService
  ) {}


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
