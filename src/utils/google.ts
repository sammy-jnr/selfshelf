import * as queryString from 'query-string';

const stringifiedParamsLogin = queryString.default.stringify({
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  redirect_uri: 'http://localhost:3000/login/authenticate/google',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '),
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
});

const stringifiedParamsRegister = queryString.default.stringify({
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  redirect_uri: 'http://localhost:3000/register/authenticate/google',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '),
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
});

export const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParamsLogin}`;
export const googleRegisterUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParamsRegister}`;

