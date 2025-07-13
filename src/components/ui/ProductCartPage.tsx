import type { ProductType } from "@/utils/type";
import { CartContext } from "@/context/CartProvider";
import { useContext, useState } from "react";
import CustomButton from "../common/CustomButton";
import { Add, Minus } from "iconsax-react";
import { AuthContext } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

interface ProductCartPageProps extends ProductType {
  setOpenPayment: React.Dispatch<React.SetStateAction<string | null>>;
}

const ProductCartPage: React.FC<ProductCartPageProps> = ({ id, title, image, price, company, feature, setOpenPayment }) => {
  const Cart = useContext(CartContext);
  const Auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [errorImg, setErrorImg] = useState<boolean>(false);

  const findById = Cart?.cart.find((e) => e.id === id);

  const details = [`رنگ: ${feature.backgroundColor}`, `${company}`, `قیمت: ${price.toLocaleString()}`];
  const orderDetails = [
    {
      label: "تعداد فرش:",
      value: findById?.count ?? 1,
    },
    {
      label: "مجموع سبد خرید: ",
      value: ((findById?.count ?? 1) * price).toLocaleString(),
    },
  ];

  const checkImage = errorImg || image;

  const handleClick = () => {
    if (!Auth?.isLogin) {
      navigate("/auth/login");
    } else {
      setOpenPayment(id);
    }
  };

  const matches = useMediaQuery("(min-width: 640px)");

  return (
    <div className="w-full flex-col lg:flex-row border lg:border-0 rounded-xl border-neutral6 flex justify-between items-start gap-y-5 gap-x-10 2xl:gap-x-20 lg:h-69">
      <div className="h-full w-full lg:w-fit flex-1 lg:border rounded-xl border-neutral6 pr-0 sm:pr-3 p-3 flex justify-start items-start gap-x-3">
        <div className={`w-40 h-58.5 ${!checkImage && "bg-primary/20 rounded-md flex justify-center items-center"}`}>{!checkImage ? <p className="h4 text-primary">ایرانی فرش</p> : <img onError={() => setErrorImg(true)} src={image} alt={title} className="w-full h-full object-cover" />}</div>

        <div className="space-y-3.5 mt-5 flex-1">
          <p className={`${matches ? "h5 line-clamp-1" : "text-base font-semibold line-clamp-2"}`}>{title}</p>
          {details.map((e, index) => (
            <div className="text-sm sm:text-base lg:text-lg font-medium" key={index}>
              {e}
            </div>
          ))}

          <div className="w-fit py-2 px-2 rounded-xl border-neutral6 border flex items-center gap-x-5">
            <CustomButton onClick={() => Cart?.changeCount?.(id.toString(), "plus")} variant="filled" height="h-fit" rounded="rounded-xl" element="button" ratio={"aspect-square"} ariaLabel="افزودن به سبد خرید">
              <Add className="size-7 stroke-white" />
            </CustomButton>
            <p className="h6 text-black">{findById?.count}</p>
            <CustomButton onClick={() => Cart?.changeCount?.(id.toString(), "minus")} variant="filled" height="h-fit" rounded="rounded-xl" element="button" ratio={"aspect-square"} ariaLabel="افزودن به سبد خرید">
              <Minus className="size-7 stroke-white" />
            </CustomButton>
          </div>
        </div>
      </div>
      <hr className="w-full border-neutral6 lg:hidden" />
      <div className="w-full lg:w-78 h-fit bg-white lg:border border-neutral6 rounded-xl p-3 space-y-5">
        {orderDetails.map((e, index) => (
          <div className="flex flex-row justify-between items-center w-full" key={index}>
            <p className="font-medium">{e.label}</p>
            <p className="font-medium">{e.value}</p>
          </div>
        ))}

        <CustomButton onClick={handleClick} variant="filled" width="w-full" height="h-10" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="افزودن به سبد خرید">
          پرداخت نهایی
        </CustomButton>
      </div>
    </div>
  );
};

export default ProductCartPage;
