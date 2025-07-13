import { useContext, useEffect, type ReactElement } from "react";
import SignUp from "@/components/auth/SignUp";
import Login from "@/components/auth/Login";
import { useLocation, Link, Navigate } from "react-router-dom";
import { Add } from "iconsax-react";
import { AuthContext } from "@/context/AuthProvider";

import { setDocumentTitle } from "@/utils/utils";

const Elem = [
  {
    path: "/auth/login",
    title: "ورود",
    elem: <Login />,
  },
  {
    path: "/auth/signup",
    title: "ثبت نام",
    elem: <SignUp />,
  },
];

const Auth = (): ReactElement => {
  const location = useLocation();
  const AuthCon = useContext(AuthContext);

  const currentRoute = Elem.find((e) => e.path === location.pathname);

  useEffect(() => {
    if (currentRoute?.title) {
      setDocumentTitle(currentRoute?.title);
    }
  }, [location.pathname, currentRoute?.title]);

  if (AuthCon?.isLogin) {
    return <Navigate to="/dashboard/auth" replace />;
  }
  return (
    <div className="w-full min-h-screen flex justify-center items-center BodyPadding relative">
      <div className="absolute top-5 right-5 hover:bg-black/20 rounded-full">
        <Link to="/">
          <Add className="size-13 stroke-primary rotate-45" />
        </Link>
      </div>
      <div className="flex flex-col items-center text-center flex-1 max-w-md">
        <div className="space-y-2">
          <strong className="block h3 text-primary">ایرانی فرش</strong>
          <h1 className="h4 text-shade2">{currentRoute?.title}</h1>
        </div>

        {currentRoute?.elem}
      </div>
    </div>
  );
};

export default Auth;
