import { Usuario } from './../../models/usuario.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from './../../shared/ui.actions';

import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ['input { height: 100%;}'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginFG: FormGroup;
  loading = false;
  destroy$ = new Subject();

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginFG = this.fb.group({
      correo: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
    this.store
      .select('ui')
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => (this.loading = state.isLoading));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  login() {
    this.store.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    const { correo, password } = this.loginFG.value;
    this.auth
      .login(correo, password)
      .then((credenciales) => {
        this.store.dispatch(ui.stopLoading());
        // Swal.close();
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
      });
  }
}
