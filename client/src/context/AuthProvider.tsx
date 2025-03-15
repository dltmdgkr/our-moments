import {
  ReactNode,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { User } from "../types/User";

interface AuthContextType {
  me: User | null;
  setMe: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  me: null,
  setMe: () => {},
  isLoading: true,
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (me) {
      axiosInstance.defaults.headers.common.sessionid = me.sessionId;
      localStorage.setItem("sessionId", me.sessionId);
      setIsLoading(false);
    } else if (sessionId) {
      axiosInstance
        .get("/users/me", { headers: { sessionid: sessionId } })
        .then((result) => {
          setMe({
            name: result.data.name,
            sessionId: result.data.sessionId,
            userId: result.data.userId,
          });
          setIsLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("sessionId");
          delete axiosInstance.defaults.headers.common.sessionid;
          setIsLoading(false);
        });
    } else {
      delete axiosInstance.defaults.headers.common.sessionid;
      setIsLoading(false);
    }
  }, [me]);

  return (
    <AuthContext.Provider value={{ me, setMe, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
