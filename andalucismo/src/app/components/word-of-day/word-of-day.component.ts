import { CommonModule, JsonPipe } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { glosario, Thmo } from '../../data/glosario';
import { FavoritosService } from '../../services/favoritos.service';
import { MatCardModule } from '@angular/material/card';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectorRef } from '@angular/core';
import { Favorito } from '../../models/favorito.model';
import { FavoritosFirebaseService } from '../../services/favoritos-firebase.service';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-word-of-day',
  imports: [CommonModule, MatCardModule, GoogleSigninButtonModule, MatSnackBarModule, MatButtonModule],
  providers: [MatSnackBar],
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
  favoritosKey: string | undefined;
  favoritos: any[] | undefined;
  public palabraActual: Thmo; // Declared as a class property
   public palabraHoy: any;
   @ViewChild('scrollArea') scrollArea!: ElementRef;
   @ViewChild('sentinelaFinal') sentinelaFinal!: ElementRef;



 
  constructor(
    private authService: SocialAuthService,
    private snackBar: MatSnackBar,
    private favoritosService: FavoritosService,
    private favoritosFirebaseService: FavoritosFirebaseService,
  ) {
    this.todayThmo = this.getThmoOfTheDay();
    this.palabra = this.todayThmo.palabra;
    this.definicion = this.todayThmo.definicion;
    this.ejemplo = this.todayThmo.ejemplo;
    this.audioUrl = this.todayThmo.audioUrl;
    this.palabraHoy = this.getThmoOfTheDay();
    this.palabraActual = this.palabraHoy;

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.isLogged = !!user;

      if (this.isLogged) {
        localStorage.setItem('userEmail', this.user?.email || '');
        this.favoritosService.setUser(this.user?.email || '');
      } else {
        localStorage.removeItem('userEmail');
        this.favoritosService.setUser(null);
      }
    });

  }

   ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Si el sentinela es visible (el sticky ha sido empujado hacia arriba)
        if (entry.isIntersecting) {
          this.scrollArea.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }, {
      root: null, // viewport
      threshold: 1.0 // 100% visible
    });

    observer.observe(this.sentinelaFinal.nativeElement);
  }

  // Método para obtener la palabra del día
  // Se basa en la fecha actual y el índice del glosario
  getThmoOfTheDay(): Thmo {
    const startDate = new Date(2024, 0, 1); // 1 de enero 2024
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = diffDays % glosario.length;
    return glosario[index+9];
  }

  // Método para cambiar la palabra actual por una aleatoria del glosario
  // Evita repetir la palabra del día
  cambiarPalabraAleatoria() {
    let nueva: Thmo;
    do {
      const randomIndex = Math.floor(Math.random() * glosario.length);
      nueva = glosario[randomIndex];
    } while (nueva.palabra === this.palabraHoy.palabra); // evita repetir la del día
  
    this.palabraActual = nueva;

    // desplaza el scroll al principio de scroll-area
    this.scrollArea.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Método para reproducir el audio de la palabra actual
  // Si el audio no está disponible, muestra una notificación
  reproducirAudio() {
    const audio = new Audio(this.audioUrl);
    audio.play().catch(()=> alert("Audio aún no disponible"));
  }

  //Método para guardar favoritos
  // Verifica si el usuario está autenticado y si la palabra ya está guardada
  guardarFavorito() {
    if (!this.isLogged) {
      this.mostrarNotificacion("⚠️ Debes iniciar sesión para guardar favoritos");
      return;
    }
  
    if (!this.user?.email) {
      this.mostrarNotificacion("⚠️ Error con el usuario");
      return;
    }
  
    const favorito: Favorito = {
      palabra: this.palabraActual.palabra,
      definicion: this.palabraActual.definicion,
      ejemplo: this.palabraActual.ejemplo
    };
  
    if (!this.favoritosService.isFavorito(favorito.palabra)) {
      this.favoritosService.addFavorito(favorito);
      this.favoritosFirebaseService.incrementarFavorito(favorito.palabra);
      this.mostrarNotificacion("✅ Palabra guardada como favorita");
    } else {
      this.mostrarNotificacion("⚠️ Palabra ya estaba guardada");
    }
  }
  
  
  
//Método para compartir favorito
compartirAforismo() {
  
  const favorito: Favorito = {
    palabra: this.palabraActual.palabra,
    definicion: this.palabraActual.definicion,
    ejemplo: this.palabraActual.ejemplo
  };

  const texto = `"${favorito.palabra}"\n\nDefinición: ${favorito.definicion}\nEjemplo: ${favorito.ejemplo}`;
  navigator.clipboard.writeText(texto).then(() => {
    this.mostrarNotificacion("✅ Aforismo copiado al portapapeles");
  }).catch(err => {
    this.mostrarNotificacion("ERROR al copiar Aforismo al portapapeles");
  });
}//end compartirAforismo

// Método para compartir en WhatsApp
compartirEnWhatsApp() {

  const favorito: Favorito = {
    palabra: this.palabraActual.palabra,
    definicion: this.palabraActual.definicion,
    ejemplo: this.palabraActual.ejemplo
  };
  
  const texto = `"${favorito.palabra}"\n\nDefinición: ${favorito.definicion}\nEjemplo: ${favorito.ejemplo}`;
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}//end compartirEnWhatsApp
  

  //metodo mostar notificaciones
  mostrarNotificacion(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  //Método para volver a palabra del día sin tener que actializar navegador
  volverPalabraHoy() {
    this.palabraActual = this.palabraHoy;

    // desplaza el scroll al principio de scroll-area
    this.scrollArea.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /*
  
*/
  


}