import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritosFirebaseService } from '../../services/favoritos-firebase.service';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-ranking',
  imports: [CommonModule, MatCardModule],
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
