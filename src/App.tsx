import { useLocation, useRoutes } from "react-router-dom";
import SnackbarComp from "@/components/ui/SnackbarComp";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import Footer from "@/components/layout/Footer";
import { getAppRoutes } from "@/routes";
import { useCallback, useEffect, useState } from "react";
import { setDocumentTitle } from "@/utils/utils";
import ScrollBase from "./base/ScrollBase";

const App = () => {
  const routes = getAppRoutes().map((route) => ({
    path: route.path,
    element: route.component,
  }));

  const routing = useRoutes(routes);

  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const location = useLocation();

  const toggleSideBar = useCallback((newOpen: boolean) => {
    setOpenSideBar(newOpen);
  }, []);

  useEffect(() => {
    const matchedRoute = getAppRoutes().find((route) => {
      const isDynamic = route.path.includes("/:");
      if (isDynamic) return false;
      return location.pathname === route.path;
    });

    if (matchedRoute) {
      setDocumentTitle(matchedRoute.title);
    }
  }, [location]);

  return (
    <>
      <ScrollBase />
      <SnackbarComp />
      <Header toggleSideBar={toggleSideBar} />
      <SideBar openSideBar={openSideBar} toggleSideBar={toggleSideBar} />
      <main className={`w-full flexLayout ${location.pathname.startsWith("/auth") ? "" : "my-23"}`}>{routing}</main>
      <Footer />
    </>
  );
};

export default App;
