import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from './../../app.reducer';
import { AuthService } from './../../services/auth.service';
import * as ui from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: ['input { height: 100%;}'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroFG: FormGroup;
  loading = false;
  destroy$ = new Subject();

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registroFG = this.fb.group({
      nombre: [null, Validators.required],
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

  crearUsuario() {
    this.store.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    const { nombre, correo, password } = this.registroFG.value;
    this.auth
      .crearUsuario(nombre, correo, password)
      .then(() => {
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
