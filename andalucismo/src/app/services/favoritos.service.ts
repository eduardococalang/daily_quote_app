import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private favoritosSubject = new BehaviorSubject<string[]>([]);
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

  private updateFavoritos(favs: string[]) {
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, JSON.stringify(favs));
      this.favoritosSubject.next(favs);
    }
  }

  getFavoritos(): string[] {
    if (this.storageKey) {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  addFavorito(palabra: string) {
    const current = this.getFavoritos();
    if (!current.includes(palabra)) {
      const updated = [...current, palabra];
      this.updateFavoritos(updated);
    }
  }

  removeFavorito(palabra: string) {
    const current = this.getFavoritos();
    const updated = current.filter(fav => fav !== palabra);
    this.updateFavoritos(updated);
  }

  isFavorito(palabra: string): boolean {
    return this.getFavoritos().includes(palabra);
  }
}
