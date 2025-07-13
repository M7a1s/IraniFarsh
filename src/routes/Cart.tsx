import { useContext, useEffect, useState, type ReactElement } from "react";
import { CartContext } from "@/context/CartProvider";
import useFetch from "@/hook/useFetch";
import type { ProductType } from "@/utils/type";
import Spinner from "@/components/ui/Spinner";
import ProductCart from "@/components/ui/ProductCartPage";
import redBasket from "@/assets/image/redBasket.webp";
import useBodyScrollLock from "@/hook/useScrollBody";
import { Sms } from "iconsax-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "@/components/common/CustomButton";
import { AuthContext } from "@/context/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { SnackBarContext } from "@/context/SnackBarProvider";
import type { ApiResponse } from "@/utils/error";

const inputs = [
  { name: "address", label: "ادرس", type: "text", Icon: Sms },
  { name: "postalCode", label: "کد پستی", type: "text", Icon: Sms },
];

const schema = yup.object({
  address: yup.string().required("ادرس الزامی است"),
  postalCode: yup
    .string()
    .required("کد پستی الزامی است")
    .matches(/^\d{10}$/, "کد پستی باید دقیقا ۱۰ رقم عدد باشد"),
});

type FormValues = yup.InferType<typeof schema>;

const Cart = (): ReactElement => {
  const Cart = useContext(CartContext);
  const Auth = useContext(AuthContext);
  const SnackBar = useContext(SnackBarContext);

  const ids = Cart?.cart.map((item) => item.id).join(",");
  const { setIsScrollLocked } = useBodyScrollLock();
  const [openPayment, setOpenPayment] = useState<string | null>(null);
  const { data, isLoading, isError } = useFetch<ProductType[]>("Product", `${import.meta.env.VITE_API_URL}/products?id=in.(${ids})&select=*`);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const products = data?.data ?? [];
  const findName = products.find((e) => e.id === openPayment);
  const findCount = Cart?.cart.find((e) => e.id === openPayment);

  useEffect(() => {
    setIsScrollLocked(openPayment !== null);

    if (openPayment === null) {
      reset();
    }
  }, [openPayment, reset, setIsScrollLocked]);

  const CartMutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(formData),
      });

      let data: ApiResponse | null = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.msg || "خطا در ارسال پیام");
      }

      return data;
    },
    onSuccess: () => {
      SnackBar?.showDialog(`${Auth?.userData?.first_name} ${Auth?.userData?.last_name} عزیز سفارشت با موفقیت ثبت شد`, "success");
      if (openPayment) {
        Cart?.handleRemove(openPayment);
      }
      setOpenPayment(null);
    },
    onError: (error: Error) => {
      console.log(error);
      SnackBar?.showDialog(error.message, "error");
    },
  });

  const onSubmit = (formData: FormValues) => {
    if (!findCount) return;

    const combinedData = {
      ...formData,
      productCount: findCount.count,
      productId: findCount.id,
      userId: Auth?.userData?.id,
    };

    CartMutation.mutate(combinedData);
  };

  return (
    <>
      <section className="w-full BodyPadding flex flex-col gap-y-6">
        <h1 className={`ResponsiveFontSize ${products && products.length > 0 ? "" : "sr-only"}`}>سبد خرید</h1>

        {isError ? (
          <p>error</p>
        ) : isLoading ? (
          <Spinner />
        ) : (
          <>
            {products && products.length > 0 ? (
              products.map((products) => <ProductCart key={products.id} setOpenPayment={setOpenPayment} {...products} />)
            ) : (
              <div className="w-full flex flex-col items-center gap-y-10">
                <img className="w-[clamp(100px,50vw,250px)] h-auto object-contain" src={redBasket} alt="سبد خرید شما خالی است!" />
                <p className="ResponsiveFontSize">سبد خرید شما خالی است!</p>
              </div>
            )}
          </>
        )}
      </section>

      {openPayment && (
        <div className="w-screen h-screen fixed top-0 left-0 bg-black/50 backdrop-blur-sm z-[999] flex justify-center items-center" onClick={() => setOpenPayment(null)}>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className={`w-[95%] xs:w-96 gap-y-5 bg-white rounded-2xl p-3 flex flex-col items-center justify-between ${CartMutation.isPending && "opacity-50"}`} onClick={(e) => e.stopPropagation()}>
            <p className="font-medium text-lg line-clamp-2 w-full">{findName?.title}</p>

            {inputs.map(({ name, label, type, Icon }) => (
              <Controller key={name} name={name as keyof FormValues} control={control} render={({ field }) => <CustomInput {...field} label={label} type={type} Icon={Icon} error={errors[name as keyof FormValues]?.message} width="100%" Element={name === "address" ? "textarea" : "input"} height={`${name === "address" ? "150px" : "56px"}`} />} />
            ))}

            <div className={`w-full ${CartMutation.isPending && "pointer-events-none"}`}>
              <CustomButton type="submit" variant="filled" width="w-full" height="h-12" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="افزودن به سبد خرید">
                {CartMutation.isPending ? <Spinner className="size-7 fill-white" /> : "تایید پرداخت"}
              </CustomButton>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Cart;
