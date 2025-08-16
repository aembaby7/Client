'use client';

import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  UPDATEFORMCODE = 'UPDATEFORMCODE',
  LOGIN = 'LOGIN',
  LOGINAUTH = 'LOGINAUTH',
  LOGINNAFATH = 'LOGINNAFATH',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };

  [Types.UPDATEFORMCODE]: {
    user: AuthUserType;
  };

  [Types.LOGIN]: {
    user: AuthUserType;
  };

  [Types.LOGINAUTH]: {
    user: AuthUserType;
  };

  [Types.LOGINNAFATH]: {
    user: AuthUserType;
  };

  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }

  if (action.type === Types.LOGINAUTH) {
    return {
      ...state,
      user: action.payload.user,
    };
  }

  if (action.type === Types.LOGINNAFATH) {
    return {
      ...state,
      user: action.payload.user,
    };
  }

  if (action.type === Types.UPDATEFORMCODE) {
    return {
      ...state,
      user: action.payload.user,
    };
  }

  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const res = await axios.get(endpoints.auth.me, {
          headers: { Authorization: 'Bearer ' + accessToken },
        });

        const { user } = res.data.result;
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (username: string, password: string, otpWay: string) => {
    const data = {
      username,
      password,
      otpWay,
    };

    const res = await axios.post(endpoints.auth.login, data);
    const { isSuccess, errorMessages, result } = res.data;
    if (isSuccess && !result.otpAuth) {
      const { accessToken, user } = result;
      setSession(result.accessToken);
      dispatch({
        type: Types.LOGIN,
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    }
    return res;
  }, []);

  const loginAuth = useCallback(async (username: string, otpCode: string) => {
    const data = {
      username,
      otpCode,
    };
    const res = await axios.post(endpoints.auth.loginAuth, data);

    const { isSuccess, errorMessages, result } = res.data;
    if (isSuccess) {
      const { accessToken, user } = result;
      setSession(result.accessToken);
      dispatch({
        type: Types.LOGIN,
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    }
    return res;
  }, []);

  // LOGIN Nafath
  const loginNafath = useCallback(async (idnumber: string, transId: string, random: string) => {
    const data = {
      idnumber,
      transId,
      random,
    };
    const res = await axios.post(endpoints.auth.NafathCheckRequestStatus, data);
    if (res.data.result.status === 'COMPLETED') {
      const { accessToken, user } = res.data.result;
      setSession(accessToken);
      dispatch({
        type: Types.LOGIN,
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    }
    return res.data.result.status;
  }, []);

  // updateFarmCode
  const updateFarmCode = useCallback(async (user: AuthUserType, farmCode: number) => {
    const data = {
      userName: user!.userName,
      farmCode,
    };
    const res = await axios.post(endpoints.auth.setSelectedFarmCode, data);
    
    if (res.data.isSuccess) {
    const dbFarmCode =res.data.result.farmCode;
    const farmName =res.data.result.farmName;
    const farmIdNumber =res.data.result.farmIdNumber;
      dispatch({
        type: Types.UPDATEFORMCODE,
        payload: {
          user: {
            ...user,
            farmCode:dbFarmCode,
            farmName,
            farmIdNumber,
          },
        },
      });
    }
    return res.data;
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const data = {
        email,
        password,
        firstName,
        lastName,
      };

      const res = await axios.post(endpoints.auth.register, data);

      const { accessToken, user } = res.data;

      sessionStorage.setItem(STORAGE_KEY, accessToken);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      loginAuth,
      loginNafath,
      register,
      logout,
      updateFarmCode,
    }),
    [login, loginAuth, loginNafath, logout, register, updateFarmCode, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
