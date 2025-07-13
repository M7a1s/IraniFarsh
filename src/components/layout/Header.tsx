import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Login, User } from "iconsax-react";
import CustomButton from "@/components/common/CustomButton";
import { navHeader } from "@/utils/utils";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputHeader from "@/components/layout/InputHeader";
import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";
import Spinner from "@/components/ui/Spinner";
import { CartContext } from "@/context/CartProvider";

type SideBarPropsType = {
  toggleSideBar: (open: boolean) => void;
};

const Header: React.FC<SideBarPropsType> = ({ toggleSideBar }) => {
  const matches1 = useMediaQuery("(min-width: 1024px)");
  const matches2 = useMediaQuery("(min-width: 780px)");
  const matches3 = useMediaQuery("(min-width: 450px)");
  const location = useLocation();
  const Auth = useContext(AuthContext);
  const Cart = useContext(CartContext);

  const checkSizeToWidth = matches3 ? "w-12 h-12" : "w-9 h-9";
  const checkSizeToWidthIcon = matches3 ? "size-6" : "size-5";

  if (location.pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <header className="w-full flex flex-col gap-y-7 mt-6 pb-3 border-b border-neutral6 BodyPadding">
      <div className="w-full flex items-center">
        {!matches2 && (
          <button onClick={() => toggleSideBar(true)} className={`${checkSizeToWidth} flex justify-center items-center bg-neutral3 rounded-xl`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" className={`stroke-black ${checkSizeToWidthIcon}`}>
              <path d="M3 7h18M3 12h18M3 17h18" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round"></path>
            </svg>
          </button>
        )}
        <Link to="/" className={`${!matches2 && "mr-3"} h4 text-primary`}>
          ایرانی فرش
        </Link>

        {matches2 && <InputHeader matches2={matches2} />}

        <div className="mr-auto flex items-center gap-x-4 h-12">
          <div className={`${checkSizeToWidth} relative`}>
            <CustomButton variant="bordered" height="h-12" rounded="rounded-xl" element="Link" ratio="aspect-square" ariaLabel="سبد خرید" to="/cart">
              <ShoppingCart className={`${checkSizeToWidthIcon} stroke-primary`} />
            </CustomButton>

            {Cart?.cart && Cart.cart.length > 0 && <span className={`${matches3 ? "scale-100" : "scale-70"} w-6 h-6 rounded-full flex justify-center items-center bg-primary text-white absolute z-10 -right-2 -bottom-2.5`}>{Cart.cart.length}</span>}
          </div>

          {Auth?.isLoading ? (
            <Spinner />
          ) : Auth?.isLogin ? (
            <div className={`${checkSizeToWidth}`}>
              <CustomButton variant="bordered" height="h-12" rounded="rounded-xl" element="Link" ratio="aspect-square" ariaLabel="پنل کاربری" to="/dashboard/auth">
                <User className={`${checkSizeToWidthIcon} stroke-primary`} />
              </CustomButton>
            </div>
          ) : (
            <div className={`${!matches1 && `${checkSizeToWidth}`}`}>
              <CustomButton variant="bordered" height="h-12" rounded="rounded-xl" element="Link" ratio={matches1 ? "aspect-auto" : "aspect-square"} ariaLabel="ورود / ثبت نام" to="/auth/login">
                <Login className={`${checkSizeToWidthIcon} stroke-primary`} />
                {matches1 && "ورود / ثبت نام"}
              </CustomButton>
            </div>
          )}
        </div>
      </div>

      {matches2 ? (
        <nav className="w-full flex items-center gap-x-8">
          {navHeader.map((e, index) => (
            <Link to={e.path} aria-label={e.label} key={index} className="relative group">
              <span className={`Body-XS ${location.pathname === e.path ? "text-primary" : "group-hover:text-primary"}`}>{e.label}</span>

              <div className={`w-0 h-0.5 bg-primary absolute -bottom-1 right-auto left-0 transition-all ${location.pathname === e.path ? "w-full right-0" : "group-hover:w-full group-hover:right-0"}`}></div>
            </Link>
          ))}
        </nav>
      ) : (
        <InputHeader matches2={matches2} />
      )}
    </header>
  );
};

export default Header;
