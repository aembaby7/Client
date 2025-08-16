import { LogoutOptions, PopupLoginOptions, RedirectLoginOptions } from '@auth0/auth0-react';

// ----------------------------------------------------------------------

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, any>;

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: AuthUserType;
};

// ----------------------------------------------------------------------

type CanRemove = {
  login?: (username: string, password: string, otpWay: string) => Promise<any>;
  loginAuth?: (username: string, otpCode: string) => Promise<any>;
  loginNafath?: (idNumber: string, transId: string, random: string) => Promise<string>;
  register?: (
    username: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  //
  loginWithGoogle?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  loginWithTwitter?: () => Promise<void>;
  //
  loginWithPopup?: (options?: PopupLoginOptions) => Promise<void>;
  loginWithRedirect?: (options?: RedirectLoginOptions) => Promise<void>;
  //
  confirmRegister?: (email: string, code: string) => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
  resendCodeRegister?: (email: string) => Promise<void>;
  newPassword?: (email: string, code: string, password: string) => Promise<void>;
  updatePassword?: (password: string) => Promise<void>;
  updateFarmCode?: (user: AuthUserType, farmCode: number) => Promise<string>;
};

export type JWTContextType = CanRemove & {
  user: AuthUserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (username: string, password: string, otpWay: string) => Promise<any>;
  loginAuth: (username: string, otpCode: string) => Promise<any>;
  loginNafath: (idNumber: string, transId: string, random: string) => Promise<string>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateFarmCode: (user: AuthUserType, farmCode: number) => Promise<string>;
};

export type FirebaseContextType = CanRemove & {
  user: AuthUserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithTwitter: () => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
};

export type AmplifyContextType = CanRemove & {
  user: AuthUserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<unknown>;
  logout: () => Promise<unknown>;
  confirmRegister: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resendCodeRegister: (email: string) => Promise<void>;
  newPassword: (email: string, code: string, password: string) => Promise<void>;
};

// ----------------------------------------------------------------------

export type Auth0ContextType = CanRemove & {
  user: AuthUserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  loginWithPopup: (options?: PopupLoginOptions) => Promise<void>;
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>;
  logout: (options?: LogoutOptions) => Promise<void>;
};

export type SupabaseContextType = CanRemove & {
  user: AuthUserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (email: string, password: string) => Promise<string>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
};

// auth.me user interface added in types file for code seperation
export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string; // Optional field
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
}
