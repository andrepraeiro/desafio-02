import { takeLatest, all, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import api from '~/services/api';
import { signInSuccess, signInFailure, signUpFailure } from './actions';
import history from '~/services/history';
import types from '~/store/modules/types';

export function* signIn({ payload }) {
  const { email, password } = payload;
  try {
    const response = yield call(api.post, 'sessions', { email, password });

    const { token, user } = response.data;
    yield put(signInSuccess(token, user));
    history.push('/dashboard');
  } catch (err) {
    toast.error('Falha na autenticação, verifique os seus dados');
    yield put(signInFailure());
  }
}

export function* signUp({ payload }) {
  const { name, email, password } = payload;
  try {
    yield call(api.post, 'users', { name, email, password });
    history.push('/');
  } catch (err) {
    toast.error('Falha ao cadastrar usuário, verifique os seus dados');
    yield put(signUpFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;
  const token = payload.auth;
  if (token) api.defaults.headers.Authorization = `Bearer ${token}`;
}

export default all([
  takeLatest(types.auth.SIGN_IN_REQUEST, signIn),
  takeLatest(types.auth.SIGN_UP_REQUEST, signUp),
  takeLatest('persist/REHYDRATE', setToken),
]);
