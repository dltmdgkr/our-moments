import axios from "axios";
import {
  ReactNode,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

interface User {
  sessionId: string;
  userId: string;
  name: string;
}

interface AuthContextType {
  me: User | null;
  setMe: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  me: null,
  setMe: () => {},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    if (me) axios.defaults.headers.common.sessionid = me.sessionId;
    else delete axios.defaults.headers.common.sessionid;
  }, [me]);

  return (
    <AuthContext.Provider value={{ me, setMe }}>
      {children}
    </AuthContext.Provider>
  );
}
