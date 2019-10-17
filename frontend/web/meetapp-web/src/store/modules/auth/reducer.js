import produce from 'immer';

const INITIAL_VALUE = {
  token: null,
  signed: false,
  loading: false,
};

export default function auth(state = INITIAL_VALUE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS': {
        draft.token = action.payload.token;
        draft.signed = true;
        break;
      }
      default:
        break;
    }
  });
}
