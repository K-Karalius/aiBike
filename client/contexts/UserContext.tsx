import {
  createContext,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '../interfaces/auth';

import { loginUser, refreshTokenApi, registerUser } from '../apis/authApis';

import {
  getEmail,
  getRefreshToken,
  removeEmail,
  removeRefreshToken,
  removeToken,
  setEmail,
  setRefreshToken,
  setToken,
} from '../utils/secureStoreUtils';

import { router } from 'expo-router';

interface User {
  email: string;
}

interface UserContextInterface {
  user: User | null;

  authChecked: boolean;

  userLogin: (params: LoginRequest) => Promise<void>;

  userRegister: (params: RegisterRequest) => Promise<void>;

  userLogout: () => void;
}

export const UserContext = createContext<UserContextInterface>(
  {} as UserContextInterface,
);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps): ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  async function userLogin(props: LoginRequest) {
    try {
      const response: LoginResponse = await loginUser(props);

      if (response.accessToken && response.refreshToken) {
        setUser({ email: props.email });

        await setToken(response.accessToken);
        await setRefreshToken(response.refreshToken);
        await setEmail(props.email);

        router.replace('/');
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  async function userRegister(props: RegisterRequest) {
    try {
      await registerUser(props);

      router.replace('/login');
    } catch (err: any) {
      console.error(err);
    }
  }

  async function userLogout() {
    await removeToken();
    await removeRefreshToken();
    await removeEmail();

    setUser(null);
  }

  async function getInitialUserValue() {
    try {
      const refreshToken = await getRefreshToken();

      const email = await getEmail();

      if (email && refreshToken) {
        const response: RefreshTokenResponse = await refreshTokenApi({
          refreshToken: refreshToken,
        });

        if (response.accessToken && refreshToken) {
          await setToken(response.accessToken);
          await setRefreshToken(response.refreshToken);
          setUser({ email });
        } else {
          await removeToken();
          await removeRefreshToken();
          await removeEmail();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        authChecked,
        userLogin,
        userRegister,
        userLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
