import { createReducer, on, Action } from '@ngrx/store';
import { Usuario } from './../models/usuario.model';
import * as auth from './auth.actions';

export interface State {
  user: Usuario;
}

export const initialState: State = {
  user: null,
};

const _authReducer = createReducer(
  initialState,
  on(auth.setUser, (state, { user }) => ({ ...state, user: { ...user } })),
  on(auth.unSetUser, (state) => ({ ...state, user: null }))
);

export function authReducer(state: State, action: Action) {
  return _authReducer(state, action);
}
