import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { glosario, Thmo } from '../../data/glosario';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-word-of-day',
  imports: [CommonModule],
  providers: [FavoritosService],
  templateUrl: './word-of-day.component.html',
  styleUrl: './word-of-day.component.scss'
})
export class WordOfDayComponent {

  palabra = "";
  definicion = "";
  ejemplo = "";
  audioUrl = "";
  isAuthenticated = false;
  todayThmo: Thmo;
 
  constructor() {
    this.todayThmo = this.getThmoOfTheDay();
    this.palabra = this.todayThmo.palabra;
    this.definicion = this.todayThmo.definicion;
    this.ejemplo = this.todayThmo.ejemplo;
    this.audioUrl = this.todayThmo.audioUrl;


  }

  getThmoOfTheDay(): Thmo {
    const today = new Date();
    const index = today.getDate() % glosario.length; 
    return glosario[index]; // Devuelve un Thmo basado en el día del mes
  }


  reproducirAudio() {
    const audio = new Audio(this.audioUrl);
    audio.play().catch(()=> alert("Audio aún no disponible"));
  }

  guardarFavorito() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    if (favoritos.includes(this.palabra)) {
      return;
    }

    if(favoritos === (this.palabra)){
      alert("Palabra ya guardada como favorita");
    }

    if (!favoritos.includes(this.palabra)){
      favoritos.push(this.palabra);
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
      alert("Palabra guardada como favorita");  
    }
   
}

valorar(){
  alert("Gracias por valorar esta palabra");
}




}