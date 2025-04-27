import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { FavoritosService } from '../../services/favoritos.service';
import { MatDialog } from '@angular/material/dialog';
import { FavoritoModalComponent } from '../favorito-modal/favorito-modal.component';




@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FavoritosComponent {
  favoritos: string[] = [];
  favoritosKey: string = '';
  isLogged = false;
  userEmail: string | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private authService: SocialAuthService,
    private favoritosService: FavoritosService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Comprobar si hay usuario autenticado y cargar favoritos
    this.authService.authState.subscribe((user: SocialUser | null) => {
      if (user) {
        this.isLogged = true;
        this.userEmail = user.email;
        this.favoritosKey = `favoritos_${user.email}`;
        const favoritosGuardados = JSON.parse(localStorage.getItem(this.favoritosKey) || '[]');
        this.favoritos = [...favoritosGuardados];
        this.favoritosService.favoritos$.subscribe(favoritos => {
          this.favoritos = [...favoritos];
          const userEmail = localStorage.getItem('userEmail');
  if (userEmail) {
    this.favoritosService.setUser(userEmail);
  }
        })
      } else {
        this.isLogged = false;
        this.favoritos = [];
        this.userEmail = null;
        this.favoritosKey = '';
      }
    });
  }

  eliminarFavorito(index: number) {
    this.favoritos.splice(index, 1);
    if (this.favoritosKey) {
      localStorage.setItem(this.favoritosKey, JSON.stringify(this.favoritos));
    }
    this.mostrarNotificacion('❌ Favorito eliminado');
  }

  compartirFavoritoWhatsApp(favorito: string) {
    const texto = `Mira este aforismo que guardé: "${favorito}"`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  }

  mostrarNotificacion(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  //abrir modal
  abrirFavorito(favorito: string) {
    this.dialog.open(FavoritoModalComponent, {
      data: { favorito },
      width: '400px', // puedes ajustar el tamaño si quieres
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms'
    });
  }
  
}
