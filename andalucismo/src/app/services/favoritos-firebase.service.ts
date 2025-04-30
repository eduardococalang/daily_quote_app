/*
Este servicio se encarga de gestionar los favoritos en Firebase

*/ 

import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FavoritosFirebaseService {

  constructor(private firestore: Firestore) {}

  async incrementarFavorito(palabra: string): Promise<void> {
    try {
      if (!palabra) throw new Error("La palabra no es válida");
  
      const docRef = doc(this.firestore, 'favoritos_globales', palabra);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const datos = docSnap.data();
        const nuevoContador = (datos['contador'] || 0) + 1;
        await updateDoc(docRef, { contador: nuevoContador });
      } else {
        await setDoc(docRef, { contador: 1 });
      }
    } catch (error) {
      console.error('OJO, Error al incrementar favorito en Firestore:', error);
    }
  }
  
  async obtenerContador(palabra:string): Promise<number>{
    const docRef = doc(this.firestore, 'favoritos_globales', palabra);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()['contador'] || 0;
    } else {
      return 0;
    }


  }
}

