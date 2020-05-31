import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap, switchMap } from 'rxjs/operators';
import { Usuario } from './../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from './../app.reducer';
import * as auth from '../auth/auth.actions';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public authS: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.authS.authState
      .pipe(
        switchMap((fbUser) =>
          !!fbUser
            ? this.firestore.doc(`${fbUser.uid}/usuario`).valueChanges()
            : of(null)
        ),
        tap((user) =>
          !!user
            ? this.store.dispatch(
                auth.setUser({ user: Usuario.fromFirebase(user) })
              )
            : this.store.dispatch(auth.unSetUser())
        )
      )
      .subscribe();
  }

  crearUsuario(
    nombre: string,
    correo: string,
    password: string
  ): Promise<void> {
    return this.authS
      .createUserWithEmailAndPassword(correo, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, correo);
        return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });
      });
  }

  login(
    correo: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.authS.signInWithEmailAndPassword(correo, password);
  }

  logout(): Promise<void> {
    return this.authS.signOut();
  }

  isAuth() {
    return this.authS.authState.pipe(map((fbUser) => !!fbUser));
  }
}
