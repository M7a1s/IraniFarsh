import type { UserType } from "@/utils/type";
import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  userData: UserType | null;
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<UserType | null>>;
  handleLogOut: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const URL = import.meta.env.VITE_AUTH_API;
const API_KEY = import.meta.env.VITE_API_KEY;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [cookies, setCookie] = useCookies(["access_token", "refresh_token"]);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    setCookie("access_token", null, { path: "/" });
    setCookie("refresh_token", null, { path: "/" });
    setUserData(null);
    setIsLogin(false);
  };

  const fetchUser = async (token: string): Promise<UserType | null> => {
    try {
      const response = await fetch(`${URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: API_KEY,
        },
      });

      if (!response.ok) {
        handleLogOut();
        return null;
      }

      const data = await response.json();
      const metaData = data.user_metadata;

      const user: UserType = {
        id: metaData.sub,
        first_name: metaData.first_name,
        last_name: metaData.last_name,
        email: data.email,
      };

      setUserData(user);
      setIsLogin(true);
      return user;
    } catch (error) {
      console.log(error);

      handleLogOut();
      return null;
    }
  };

  const tryAutoLogin = async () => {
    try {
      setIsLoading(true);
      if (!cookies.access_token && !cookies.refresh_token) return;

      const accessToken = cookies.access_token;
      const success = await fetchUser(accessToken);

      if (!success && cookies.refresh_token) {
        const refreshResponse = await fetch(`${URL}/token?grant_type=refresh_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({ refresh_token: cookies.refresh_token }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();

          const newAccessToken = refreshData.access_token;
          const newRefreshToken = refreshData.refresh_token;

          setCookie("access_token", newAccessToken, { path: "/", secure: true });
          setCookie("refresh_token", newRefreshToken, { path: "/", secure: true });

          await fetchUser(newAccessToken);
        } else {
          handleLogOut();
        }
      }
    } catch (err) {
      console.log(err);

      handleLogOut();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let hash = window.location.hash.substring(1);

    const secondHashIndex = hash.indexOf("#");
    if (secondHashIndex !== -1) {
      hash = hash.slice(0, secondHashIndex) + "?" + hash.slice(secondHashIndex + 1);
    }

    if (hash.includes("error=") || hash.includes("type=email_change")) {
      navigate("/");
      return;
    }

    if (hash.includes("type=recovery")) {
      const indexOfQuestion = hash.indexOf("?");
      const query = indexOfQuestion !== -1 ? hash.substring(indexOfQuestion + 1) : "";
      navigate(`/auth/recovery?${query}`);
    }

    tryAutoLogin();
  }, [navigate]);

  return <AuthContext.Provider value={{ isLogin, setIsLogin, userData, setUserData, handleLogOut, isLoading }}>{children}</AuthContext.Provider>;
};
