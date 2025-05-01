import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Favorito } from '../../models/favorito.model';
import { FavoritosFirebaseService } from '../../services/favoritos-firebase.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-favorito-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule],
  templateUrl: './favorito-modal.component.html',
  styleUrls: ['./favorito-modal.component.scss']
})
export class FavoritoModalComponent {
   contador: number = 0;

  constructor(
    public dialogRef: MatDialogRef<FavoritoModalComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: Favorito,
    private favoritosFirebaseService: FavoritosFirebaseService
  ) {}

  ngOnInit() {
    this.favoritosFirebaseService.obtenerContador(this.data.palabra). then(contador => {
      this.contador = contador;
    });

  }

  cerrar() {
    this.dialogRef.close();
  }

  compartirFavorito() {
    const texto = `⭐ ${this.data.palabra}\n\n📖 Definición: ${this.data.definicion}\n✍️ Ejemplo: ${this.data.ejemplo}`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  }

  copiarFavorito() {
    navigator.clipboard.writeText(this.data.palabra).then(() => {
      alert("✅ Aforismo copiado al portapapeles");
    }).catch(err => {
      alert("❌ Error al copiar aforismo");
    });
  }
}
