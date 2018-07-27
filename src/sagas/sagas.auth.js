import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER,
  LOGOUT_USER_REQUEST,
  LOGIN_WITH_TOKEN,
  START_HTTP_INTERCEPTORS
} from '../constants/constants.auth';
import { toast } from 'react-toastify';
import { logoutAPI } from '../httpAPI/api.auth';
import jwtDecode from 'jwt-decode';
import { call, put, takeEvery, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import axios from 'axios';

/***********************************************/



function* tokenLoginWorker(request) {
  const token = request.payload;
  console.log(token)
  try {
    const decoded = jwtDecode(token);
    //localStorage.setItem('syn_token', token);

    yield put({
      type: LOGIN_USER_SUCCESS,
      payload: {
        token: token,
        user: decoded
      }
    })
    yield put({
      type: START_HTTP_INTERCEPTORS,
      payload: token
    })
  } catch(err) {
    console.log(err)

    yield put({
      type: LOGIN_USER_FAILURE,
      payload: {
        status: 403,
        statusText: 'Invalid authentication token'
      }
    });
    yield put({
      type: LOGOUT_USER_REQUEST,
      payload: {
        unauth: true
      }
    })
    toast.error('Invalid authentication token!', { autoClose: 2000, position: toast.POSITION.TOP_LEFT });
  };
}

function* logoutReqWorker(request) {
  if(request.payload.unauth) {
    localStorage.removeItem('syn_token')
    yield put({ type: LOGOUT_USER });
  } else {
    try {
      const res = yield call(logoutAPI);
      localStorage.removeItem('syn_token')
      yield put({
        type: LOGOUT_USER
      })
    } catch(err) {
      toast.error(`${err.response.status}`);
    };
  }
}

function createInterceptorsChannel() {
  // `eventChannel` takes a subscriber function
  // the subscriber function takes an `emit` argument to put messages onto the channel
  return eventChannel(emit => {
    const unallowedHanlder = (error) => {
      // puts event payload into the channel
      // this allows a Saga to take this payload from the returned channel
      emit(error)
    }

    axios.interceptors.request.use(
      (config) => {
        //Set jwt token (not for aws requestes since they're signed by back-end)
        if(config.url.indexOf('amazonaws') === -1)
          if(localStorage.getItem('syn_token'))
            config.headers.Authorization = 'Bearer ' + localStorage.getItem('syn_token');
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // check if unauthorized errors
        const stringError = String(error.response.status);
        if(stringError === '401' || stringError === '403') {
          unallowedHanlder(error.response);
        }
        return Promise.reject(error);
      }
    );

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    const unsubscribe = () => {
      axios.interceptors.response.eject(resInterceptor);
    }

    return unsubscribe
  })
}

function* httpInterceptorsWorker() {
  const interceptorsChannel = yield call(createInterceptorsChannel);
  const error = yield take(interceptorsChannel);
  interceptorsChannel.close();
  yield put({
    type: LOGOUT_USER_REQUEST,
    payload: { unauth: true }
  })
  // Add a response interceptor

}
/******************************************/


export default function* () {
  yield [
    //takeEvery(LOGIN_USER_REQUEST, loginReqWorker),
    takeEvery(LOGIN_WITH_TOKEN, tokenLoginWorker),
    takeEvery(START_HTTP_INTERCEPTORS, httpInterceptorsWorker),
    takeEvery(LOGOUT_USER_REQUEST, logoutReqWorker)
  ]
}
