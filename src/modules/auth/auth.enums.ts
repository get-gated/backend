export enum Role {
  User = 'user',
  Admin = 'admin',
}

export enum SpecialRole {
  Unauthenticated = 'UNAUTHENTICATED',
  AllAuthenticated = 'ALL_AUTHENTICATED',
}

export enum Provider {
  Google = 'google.com',
}

export enum AuthType {
  Signup = 'signup',
  Login = 'login',
  InboxAccess = 'inbox',
  Signature = 'signature',
}

export enum AuthCookie {
  State = 'auth_state',
  CustomToken = 'auth_custom_token',
  Error = 'auth_error',
  LoginHint = 'auth_login_hint',
  CsrfToken = 'auth_csrf_token',
}
