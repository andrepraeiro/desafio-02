import produce from 'immer';
import types from '../types';

const INITIAL_VALUE = {
  profile: null,
};
export default function user(state = INITIAL_VALUE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case types.auth.SIGN_IN_SUCCESS: {
        draft.profile = action.payload.user;
        break;
      }

      case types.user.UPDATE_PROFILE_SUCCESS: {
        draft.profile = action.payload;
        break;
      }

      case types.auth.SIGN_OUT: {
        draft.profile = null;
        break;
      }

      default:
    }
  });
}
