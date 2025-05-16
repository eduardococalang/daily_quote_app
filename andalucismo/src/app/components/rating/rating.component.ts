import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { collection, doc, getDoc, setDoc, Firestore, onSnapshot } from '@angular/fire/firestore';
import { getAuth, user } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
@Component({
  selector: 'app-rating-app',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingAppComponent implements OnInit {
  promedio: number = 0;
  votos: number = 0;
  userId: string | null = null;

  constructor(
    private firestore: Firestore,
    private authService: SocialAuthService,
  ) {}

  ngOnInit() {
    // Escuchar promedio en tiempo real
    const docRef = doc(this.firestore, 'valoraciones', 'app');
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.promedio = data['promedio'] || 0;
        this.votos = data['total'] || 0;
      }
    });
  
    // Obtener el usuario logueado vía angularx-social-login
    this.authService.authState.subscribe((user: SocialUser | null) => {
      this.userId = user?.email || null;  // Usamos el email como ID único para votación
    });
  }
  async valorar(nota: number) {
    if (!user) {
      alert('Debes iniciar sesión para valorar');
      return;
    }

    const ratingRef = doc(this.firestore, 'ratings_por_usuario', this.userId!);
    const appRef = doc(this.firestore, 'valoraciones', 'app');

    const prev = await getDoc(ratingRef);
    const yaVotado = prev.exists() ? prev.data()['nota'] : null;

    if (yaVotado !== null) {
      alert('Ya has valorado esta app. Gracias 😊');
      return;
    }

    await setDoc(ratingRef, { nota });

    const appSnap = await getDoc(appRef);
    const datos = appSnap.exists() ? appSnap.data() : { total: 0, suma: 0 };
    const nuevaSuma = (datos['suma'] || 0) + nota;
    const nuevoTotal = (datos['total'] || 0) + 1;
    const nuevoPromedio = nuevaSuma / nuevoTotal;

    await setDoc(appRef, {
      suma: nuevaSuma,
      total: nuevoTotal,
      promedio: nuevoPromedio
    });

    alert('✅ ¡Gracias por tu valoración!');
  }
}
