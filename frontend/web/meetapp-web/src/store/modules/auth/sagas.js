import { takeLatest, all, call, put } from 'redux-saga/effects';
import api from '~/services/api';
import { signInSuccess } from './actions';
import history from '~/services/history';

export function* signIn({ payload }) {
  console.tron.log('response');
  const { email, password } = payload;
  try {
    const response = yield call(api.post, 'sessions', { email, password });
    console.tron.log(response);
    const { token, user } = response.data;
    yield put(signInSuccess(token, user));
    history.push('/dashboard');
  } catch (error) {
    console.tron.log(error);
  }

  // todo: usuário não é organizador
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);
