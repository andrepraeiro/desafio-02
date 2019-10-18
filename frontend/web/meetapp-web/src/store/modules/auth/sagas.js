import { takeLatest, all, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import api from '~/services/api';
import { signInSuccess, signInFailure } from './actions';
import history from '~/services/history';
import types from '~/store/modules/types';

export function* signIn({ payload }) {
  const { email, password } = payload;
  try {
    const response = yield call(api.post, 'sessions', { email, password });
    const { token, user } = response.data;
    yield put(signInSuccess(token, user));
    history.push('/dashboard');
  } catch (error) {
    toast.error('Falha na autenticação, verifique os seus dados');
    yield put(signInFailure());
  }
}

export default all([takeLatest(types.auth.SIGN_IN_REQUEST, signIn)]);
