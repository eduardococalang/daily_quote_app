import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { glosario, Thmo } from '../../data/glosario';
import { FavoritosService } from '../../services/favoritos.service';
import { MatCardModule } from '@angular/material/card';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';




@Component({
  selector: 'app-word-of-day',
  imports: [CommonModule, MatCardModule, GoogleSigninButtonModule, MatSnackBarModule],
  providers: [FavoritosService, MatSnackBar],
  templateUrl: './word-of-day.component.html',
  styleUrl: './word-of-day.component.scss',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [   // Cuando un elemento entra
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [   // Cuando un elemento se elimina
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
 
})
export class WordOfDayComponent {

  palabra = "";
  definicion = "";
  ejemplo = "";
  audioUrl = "";
  isAuthenticated = false;
  todayThmo: Thmo;
  user: SocialUser | null = null;
  isLogged: boolean = false;
  favoritos: any;
  favoritosKey: string = '';
 
  constructor(
    private authService: SocialAuthService,
    private snackBar: MatSnackBar
  ) {
    this.todayThmo = this.getThmoOfTheDay();
    this.palabra = this.todayThmo.palabra;
    this.definicion = this.todayThmo.definicion;
    this.ejemplo = this.todayThmo.ejemplo;
    this.audioUrl = this.todayThmo.audioUrl;

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.isLogged = !!user;

      if(this.isLogged) {
        this.favoritosKey = 'favoritos_${this.user?.email}';
        this.favoritos = JSON.parse(localStorage.getItem(this.favoritosKey) || '[]');
      }else{
        this.favoritos = [];
        this.favoritosKey = '';
      }
    });

  }

  getThmoOfTheDay(): Thmo {
    const startDate = new Date(2024, 0, 1); // 1 de enero 2024
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = diffDays % glosario.length;
    return glosario[index+4];
  }
  


  reproducirAudio() {
    const audio = new Audio(this.audioUrl);
    audio.play().catch(()=> alert("Audio aún no disponible"));
  }

  guardarFavorito() {
    if (!this.isLogged) {
      this.mostrarNotificacion("DEBES INICIAR SESIÓN PARA GUARDAR FAVORITOS");
      return;
    }
  
    // 1. Leer favoritos actuales de la memoria (this.favoritos), no del localStorage
    if (!this.favoritos.includes(this.palabra)) {
      this.favoritos.push(this.palabra);  // 2. Añadir palabra a array existente
      localStorage.setItem(this.favoritosKey, JSON.stringify(this.favoritos)); // 3. Guardar el array entero
      this.mostrarNotificacion("✅ Palabra guardada como favorita");
    } else {
      this.mostrarNotificacion("✅ palabra favorita ya guardada");

    }
  }

compartirAforismo() {
  const texto = `"${this.palabra}"\n\nDefinición: ${this.definicion}\nEjemplo: ${this.ejemplo}`;
  navigator.clipboard.writeText(texto).then(() => {
    this.mostrarNotificacion("✅ Aforismo copiado al portapapeles");
  }).catch(err => {
    this.mostrarNotificacion("ERROR al copiar Aforismo al portapapeles");
  });
}

compartirEnWhatsApp() {
  const texto = `"${this.palabra}"\n\nDefinición: ${this.definicion}\nEjemplo: ${this.ejemplo}`;
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

//CRUD FAVORITOS

eliminarFavorito(index: number) {
    this.favoritos.splice(index, 1);
    localStorage.setItem('favoritos', JSON.stringify(this.favoritosKey));
    this.mostrarNotificacion("Favorito eliminado correctamente");
  }

  compartirFavoritoWhatsApp(favorito: string) {
    const texto = `Mira este aforismo que guardé: "${favorito}"`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  }
  
  //metodo mostar notificaciones
  mostrarNotificacion(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  
  



valorar(){
  this.mostrarNotificacion("✅GRACIAS POR VALORAR NUESTRO TRABAJO");
}


  signOut(): void {
    this.authService.signOut();
  }



}