import produce from 'immer';
import types from '../types';

const INITIAL_VALUE = {
  token: null,
  signed: false,
  loading: false,
};

export default function auth(state = INITIAL_VALUE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case types.auth.SIGN_IN_REQUEST: {
        draft.loading = true;
        break;
      }

      case types.auth.SIGN_IN_SUCCESS: {
        draft.token = action.payload.token;
        draft.signed = true;
        draft.loading = false;
        break;
      }

      case types.auth.SIGN_IN_FAILURE: {
        draft.loading = false;
        break;
      }

      case types.auth.SIGN_OUT: {
        draft.token = null;
        draft.signed = false;
        break;
      }
      default:
    }
  });
}
