import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { glosario, Thmo } from '../../data/glosario';
import { FavoritosService } from '../../services/favoritos.service';
import { MatCardModule } from '@angular/material/card';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';




@Component({
  selector: 'app-word-of-day',
  imports: [CommonModule, MatCardModule, GoogleSigninButtonModule],
  providers: [FavoritosService],
  templateUrl: './word-of-day.component.html',
  styleUrl: './word-of-day.component.scss',
 
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
 
  constructor(private authService: SocialAuthService) {
    this.todayThmo = this.getThmoOfTheDay();
    this.palabra = this.todayThmo.palabra;
    this.definicion = this.todayThmo.definicion;
    this.ejemplo = this.todayThmo.ejemplo;
    this.audioUrl = this.todayThmo.audioUrl;

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.isLogged = !!user;
    });


  }

  getThmoOfTheDay(): Thmo {
    const startDate = new Date(2024, 0, 1); // 1 de enero 2024
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = diffDays % glosario.length;
    return glosario[index+2];
  }
  


  reproducirAudio() {
    const audio = new Audio(this.audioUrl);
    audio.play().catch(()=> alert("Audio aún no disponible"));
  }

  guardarFavorito() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

    if (favoritos.includes(this.palabra)) {
     alert("Palabra ya guardada como favorita");
     return
    }

      favoritos.push(this.palabra);
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
      alert("Palabra guardada como favorita");  
    
}

compartirAforismo() {
  const texto = `"${this.palabra}"\n\nDefinición: ${this.definicion}\nEjemplo: ${this.ejemplo}`;
  navigator.clipboard.writeText(texto).then(() => {
    alert('¡Aforismo copiado al portapapeles!');
  }).catch(err => {
    alert('Error al copiar el aforismo.');
  });
}

compartirEnWhatsApp() {
  const texto = `"${this.palabra}"\n\nDefinición: ${this.definicion}\nEjemplo: ${this.ejemplo}`;
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}



valorar(){
  alert("Gracias por valorar esta palabra");
}


  signOut(): void {
    this.authService.signOut();
  }



}