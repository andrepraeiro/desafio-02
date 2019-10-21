import { takeLatest, all, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import api from '~/services/api';
import types from '../types';
import { updateProfileFailure, updateProfileSuccess } from './actions';

export function* updateProfile({ payload }) {
  try {
    console.tron.log('payload', payload);
    const { name, email, ...rest } = payload;
    const profile = {
      name,
      email,
      ...(rest.oldPassword ? rest : {}),
    };
    const response = yield call(api.put, 'users', profile);
    yield put(updateProfileSuccess(response.data));
    toast.success('Perfil atualizado com sucesso');
  } catch (err) {
    toast.error('Error ao atualizar perfil, confira os seus dados.');
    yield put(updateProfileFailure());
  }
}

export default all([
  takeLatest(types.user.UPDATE_PROFILE_REQUEST, updateProfile),
]);
