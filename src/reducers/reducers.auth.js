import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER
} from '../constants/constants.auth';

const INITIAL_STATE = {
    token: null,
    user: null,
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
      return { ...state, isAuthenticating:true };
    case LOGIN_USER_SUCCESS:
      
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        statusText: 'You have been successfully logged in.'
      };
    case LOGIN_USER_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        user: null,
        statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`
      };
    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        statusText: 'You have been successfully logged out.'
      }
    default:
      return state;
  }
}
