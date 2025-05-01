import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritosFirebaseService } from '../../services/favoritos-firebase.service';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-ranking',
  imports: [CommonModule, MatCardModule],
  standalone: true,
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit{
  ranking: {palabra: string, contador: number }[] = [];

  constructor(
    private favoritosFirebaseService: FavoritosFirebaseService
  ) {}


  ngOnInit(): void {
    this.favoritosFirebaseService.obtenerRankingTopN(10).then((res) =>{
      this.ranking = res;
    });
} 
}
