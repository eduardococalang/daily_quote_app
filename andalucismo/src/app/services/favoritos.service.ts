import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Favorito } from '../models/favorito.model'; // importa el modelo
@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private favoritosSubject = new BehaviorSubject<Favorito[]>([]);
  public readonly favoritos$ = this.favoritosSubject.asObservable();

  private storageKey = '';

  constructor() {}

  setUser(email: string | null) {
    if (email) {
      this.storageKey = `favoritos_${email}`;
      const stored = localStorage.getItem(this.storageKey);
      const favoritos = stored ? JSON.parse(stored) : [];
      this.favoritosSubject.next(favoritos);
    } else {
      this.storageKey = '';
      this.favoritosSubject.next([]);
    }
  }

  private updateFavoritos(favs: Favorito[]) {
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, JSON.stringify(favs));
      this.favoritosSubject.next(favs);
    }
  }

  getFavoritos(): Favorito[] {
    if (this.storageKey) {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  addFavorito(favorito: Favorito) {
    const current = this.getFavoritos();
    const existe = current.some(f => f.palabra === favorito.palabra);
    if (!existe) {
      const updated = [...current, favorito];
      this.updateFavoritos(updated);
    }
  }

  removeFavorito(palabra: string) {
    const current = this.getFavoritos();
    const updated = current.filter(fav => fav.palabra !== palabra);
    this.updateFavoritos(updated);
  }

  isFavorito(palabra: string): boolean {
    return this.getFavoritos().some(fav => fav.palabra === palabra);
  }
}
