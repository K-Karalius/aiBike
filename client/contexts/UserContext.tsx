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
} from '../interfaces/auth';
import { login, register } from '../apis/authApis';
import { getToken, removeToken, setToken } from '../utils/secureStoreUtils';
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
      const response: LoginResponse = await login(props);
      if (response.token) {
        setUser({ email: props.email });
        setToken(response.token);
        router.replace('/');
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  async function userRegister(props: RegisterRequest) {
    try {
      await register(props);
      router.back();
    } catch (err: any) {
      console.error(err);
    }
  }

  async function userLogout() {
    removeToken();
    setUser(null);
  }

  async function getInitialUserValue() {
    try {
      // endpoint to get user email or id by token
      if (await getToken()) {
        setUser(null);
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
