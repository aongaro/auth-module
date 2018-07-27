import {
  LOGIN_WITH_TOKEN,
  LOGOUT_USER_REQUEST
} from '../constants/constants.auth';

export function loginWithToken(token) {
  return (dispatch) => {
    dispatch({
      type: LOGIN_WITH_TOKEN,
      payload: token
    })
  }
}

export function logout() {
  return (dispatch) => {
    dispatch({
      type: LOGOUT_USER_REQUEST,
      payload: { unauth: false }
    })
  }
}
