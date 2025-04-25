// favorites.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private readonly storageKey = 'favoritos';
  private readonly favoritosSubject = new BehaviorSubject<string[]>(this.loadFavoritos());
  public readonly favoritos$ = this.favoritosSubject.asObservable();

  private loadFavoritos(): string[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private updateFavoritos(favs: string[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(favs));
    this.favoritosSubject.next(favs);
  }

  getFavoritos(): string[] {
    return this.loadFavoritos();
  }

  toggleFavorito(palabra: string) {
    const current = this.getFavoritos();
    const updated = current.includes(palabra)
      ? current.filter(fav => fav !== palabra)
      : [...current, palabra];
    this.updateFavoritos(updated);
  }

  isFavorito(palabra: string): boolean {
    return this.getFavoritos().includes(palabra);
  }
}
