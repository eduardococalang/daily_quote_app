// favoritos.component.ts
import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { Subscription } from 'rxjs';
import { FavoritosService } from '../../services/favoritos.service';
import { CommonModule } from '@angular/common';
import { glosario, Thmo} from '../../data/glosario';

@Component({
  selector: 'app-favoritos',
  imports : [CommonModule],
  providers: [FavoritosService, glosario],
  templateUrl: './favoritos.component.html',
})
export class FavoritosComponent implements OnInit, OnDestroy {
  glosario: Thmo[] = glosario;
  favoritos: Thmo[] = [];
  private favSub!: Subscription;


  constructor(private favoritosService: FavoritosService) {}

  ngOnInit(): void {
    this.favSub = this.favoritosService.favoritos$.subscribe(palabrasFav => {
      this.favoritos = this.glosario.filter(item =>
        palabrasFav.includes(item.palabra)
      );
    });
  }

  ngOnDestroy(): void {
    this.favSub.unsubscribe();
  }
}