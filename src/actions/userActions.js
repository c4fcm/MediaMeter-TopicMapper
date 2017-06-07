import { createAction } from 'redux-actions';
import * as api from '../lib/serverApi/user';
import { createAsyncAction } from '../lib/reduxHelpers';

export const LOGIN_WITH_PASSWORD = 'LOGIN_WITH_PASSWORD';
export const LOGOUT = 'LOGOUT';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const RECOVER_PASSWORD = 'RECOVER_PASSWORD';
export const SIGNUP = 'SIGNUP';
export const RESEND_ACTIVATION_EMAIL = 'RESEND_ACTIVATION_EMAIL';
export const LOGIN_WITH_COOKIE = 'LOGIN_WITH_COOKIE';

// pass in email and password
export const loginWithPassword = createAsyncAction(LOGIN_WITH_PASSWORD, api.loginWithPassword);

export const logout = createAction(LOGOUT);

export const changePassword = createAsyncAction(CHANGE_PASSWORD, api.changePassword);

export const recoverPassword = createAsyncAction(RECOVER_PASSWORD, api.recoverPassword);

export const signupUser = createAsyncAction(SIGNUP, api.signupUser);

export const resendActivation = createAsyncAction(RESEND_ACTIVATION_EMAIL, api.resendActionationEmail);

export const loginWithCookie = createAsyncAction(LOGIN_WITH_COOKIE, api.loginWithCookie);
