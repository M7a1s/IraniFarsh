import React, { useCallback, useContext, useEffect, type ReactElement } from "react";
import { Navigate, useParams } from "react-router-dom";
import useFetch from "@/hook/useFetch";
import type { ProductType } from "@/utils/type";
import { Building, Setting3, Star1, Add, Minus, Image } from "iconsax-react";
import CustomButton from "@/components/common/CustomButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { CartContext } from "@/context/CartProvider";
import ProductSection from "@/components/home/ProductSection";
import ProductMainUiSkeleton from "@/components/ui/skeleton/ProductMainUi";
import CustomInput from "@/components/common/CustomInput";
import { User, Message } from "iconsax-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SnackBarContext } from "@/context/SnackBarProvider";
import { useMutation } from "@tanstack/react-query";
import type { ApiResponse } from "@/utils/error";
import { setDocumentTitle } from "@/utils/utils";

type CommentType = {
  id: string;
  text: string;
  user_name: string;
  created_at: string;
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, "ثانیه"],
    [60, "دقیقه"],
    [24, "ساعت"],
    [30, "روز"],
    [12, "ماه"],
    [Number.POSITIVE_INFINITY, "سال"],
  ];

  let i = 0;
  let unitValue = seconds;

  while (unitValue >= intervals[i][0] && i < intervals.length - 1) {
    unitValue /= intervals[i][0];
    i++;
  }

  return `${Math.floor(unitValue)} ${intervals[i][1]} پیش`;
}

const inputs = [
  { name: "user_name", label: "نام و نام خانوادگی", type: "text", Icon: User },
  { name: "text", label: "پیام", type: "text", Icon: Message },
];

const schema = yup.object({
  user_name: yup.string().required("نام و نام خانوادگی الزامی است"),
  text: yup.string().required("پیام الزامی است"),
});

type FormValues = yup.InferType<typeof schema>;

const Product = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const cart = useContext(CartContext);
  const SnackBar = useContext(SnackBarContext);

  const { data, isLoading } = useFetch<ProductType[] | undefined>("product", `${import.meta.env.VITE_API_URL}/products?id=eq.${id}`);

  const dataProduct: ProductType | undefined = data?.data?.[0];

  const { data: dataComments, isLoading: loadingComments, refetch } = useFetch<CommentType[] | undefined>("comments", id ? `${import.meta.env.VITE_API_URL}/comments?productId=eq.${id}&order=created_at.desc` : "", { Prefer: "count=exact" });
  const fetchComments: CommentType[] | undefined = dataComments?.data;
  const total = dataComments?.total ?? 0;

  useEffect(() => {
    console.log(total);
  }, [total]);

  const feature = [
    {
      title: "کیفیت فرش",
      value: dataProduct?.feature.carpetQuality,
    },
    {
      title: "رنگ زمینه",
      value: dataProduct?.feature.backgroundColor,
    },
    {
      title: "شکل",
      value: dataProduct?.feature.shape,
    },
    {
      title: "جنس نخ پود",
      value: dataProduct?.feature.weftMaterial,
    },
    {
      title: "جنس نخ تار",
      value: dataProduct?.feature.warpMaterial,
    },
    {
      title: "جنس نخ خاب",
      value: dataProduct?.feature.pileMaterial,
    },
  ];

  const dataArray = [
    {
      icon: Building,
      label: "شرکت سازنده",
      value: dataProduct?.company,
    },
    {
      icon: Setting3,
      label: "عملکرد",
      value: dataProduct?.rate.performance,
    },
    {
      icon: Star1,
      label: "امتیاز",
      value: dataProduct?.rate.rate.toString(),
    },
  ];

  const matches1 = useMediaQuery("(min-width: 1300px)");
  const matches2 = useMediaQuery("(min-width: 520px)");
  const matches3 = useMediaQuery("(min-width: 470px)");
  const matches = useMediaQuery(`(min-width:501px)`);

  const findById = cart?.cart.find((e) => e.id === id);

  useEffect(() => {
    if (dataProduct?.title) {
      setDocumentTitle(dataProduct.title);
    }
  }, [dataProduct?.title]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const commentMutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/comments`, {
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
        console.error("Server response error:", data);

        throw new Error(data?.msg || "خطا در ارسال نظر");
      }

      return data;
    },
    onSuccess: (_, variables) => {
      SnackBar?.showDialog(`${variables.user_name} عزیز، نظرت با موفقیت ثبت شد`, "success");
      reset();
      refetch();
    },
    onError: (error: Error) => {
      console.log(error);
      SnackBar?.showDialog(error.message, "error");
    },
  });

  const onSubmit = (formData: FormValues) => {
    const now = new Date();
    const created_at = now.toISOString();

    const dataToSend = {
      productId: id,
      ...formData,
      created_at,
    };

    commentMutation.mutate(dataToSend);
  };

  const customSort = useCallback((products: ProductType[], currentPrice?: number) => {
    if (!currentPrice) return products.slice(0, 4);
    return [...products]
      .sort((a, b) => {
        const diffA = Math.abs(a.price - currentPrice);
        const diffB = Math.abs(b.price - currentPrice);
        return diffA - diffB || a.price - b.price;
      })
      .slice(0, 4);
  }, []);

  if (!id) return <Navigate to="/" replace />;

  return (
    <>
      {isLoading || loadingComments ? (
        <ProductMainUiSkeleton />
      ) : (
        <section className={`w-full flex ${matches1 ? "flex-row" : "flex-col"} justify-start items-center BodyPadding`}>
          <div className={`${!dataProduct?.image && "bg-primary/20 rounded-xl flex justify-center items-center"} ${matches1 ? "w-73 h-[461px]" : "w-83 h-[338px]"}`}>
            {dataProduct?.image ? (
              <img src={dataProduct?.image} alt={dataProduct?.title} className={`w-full h-full ${matches1 ? "object-cover" : "object-contain"}`} />
            ) : (
              <div>
                <Image className="size-20 stroke-primary" />
              </div>
            )}
          </div>

          <div className={`flex flex-col ${matches1 ? "mr-7" : "items-center text-center"} ${!matches2 ? "w-full" : "w-[440px]"} mt-8`}>
            <h1 className={`${matches1 ? "h5" : `${matches2 ? "h4" : "h6"}`} text-black line-clamp-1 truncate`}>{dataProduct?.title}</h1>
            {matches1 && <hr className="w-full mt-3.5 border border-neutral7" />}

            <div className={`flex flex-col ${matches1 ? "items-start" : "items-center"} gap-y-6 mt-7 w-full`}>
              <strong className="Body-S font-bold">اندازه فرش: {dataProduct?.size}</strong>

              {matches3 ? (
                <>
                  <p className="Body-S font-bold">ویژگی ها</p>

                  <div className="flex flex-row justify-between items-center flex-wrap gap-x-6 gap-y-4">
                    {feature.map((e, index) => (
                      <div className="w-52 h-17.5 bg-neutral3 rounded-lg flex items-start justify-center flex-col gap-1 pr-3" key={index}>
                        <p className="Button-MD text-neutral11">{e.title}</p>

                        <strong className="Body-XS font-bold text-black">{e.value}</strong>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Swiper className="mySwiper w-full mt-4" slidesPerView="auto">
                  {feature.map((e, index) => (
                    <SwiperSlide key={index} className={`!w-fit px-2 ${index === 0 ? "pr-0" : index === feature.length - 1 ? "pl-0" : ""}`}>
                      <div className="w-fit min-h-11 bg-neutral3 rounded-lg flex items-start justify-center flex-col gap-y-1 py-1 pr-2 pl-10">
                        <p className="Button-S text-neutral11">{e.title}</p>

                        <strong className="Caption-MD font-bold text-black">{e.value}</strong>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>

          <div className={`bg-white ${matches1 ? "mr-auto w-78" : `mt-8 ${!matches2 ? "w-full" : "w-[440px]"}`} space-y-6 shadow-2xl rounded-xl p-3 border border-neutral7`}>
            {dataArray.map((e, index) => (
              <div className="flex items-center gap-x-2.5" title={`${e.label} ${e.value}`} key={index}>
                <e.icon className="size-6 stroke-black" />

                <p className="text-black Body-XS">{e.value}</p>
              </div>
            ))}

            <hr className="border border-neutral7" />

            <div className="w-full flex justify-between items-center">
              <p className="h6 text-black">قیمت:</p>
              <p className="h6 text-black">{dataProduct?.price.toLocaleString()}</p>
            </div>

            {findById ? (
              <div className="h-10 flex justify-between items-center w-full">
                <CustomButton onClick={() => cart?.changeCount(id.toString(), "plus")} variant="filled" height="h-fit" rounded="rounded-full" element="button" ratio={"aspect-square"} ariaLabel="افزودن به سبد خرید">
                  <Add className="size-8 stroke-white" />
                </CustomButton>
                <p className="h6 text-black">{findById?.count}</p>
                <CustomButton onClick={() => cart?.changeCount(id.toString(), "minus")} variant="filled" height="h-fit" rounded="rounded-full" element="button" ratio={"aspect-square"} ariaLabel="افزودن به سبد خرید">
                  <Minus className="size-8 stroke-white" />
                </CustomButton>
              </div>
            ) : (
              <CustomButton onClick={() => cart?.addItem(id.toString(), 1)} variant="filled" width="w-full" height="h-10" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="افزودن به سبد خرید">
                افزودن به سبد خرید
              </CustomButton>
            )}
          </div>
        </section>
      )}

      {dataProduct && <ProductSection title="فرش های مشابه" path="/" urlFetch={`${import.meta.env.VITE_API_URL}/products?type=eq.${dataProduct.type}&id=neq.${dataProduct.id}&limit=6`} currentPrice={dataProduct.price} customSort={customSort} />}

      <section className={`w-full BodyPadding space-y-10`}>
        <div className={`${fetchComments && fetchComments.length > 0 ? "space-y-10" : "space-y-5"} w-full bg-neutral3 p-4 rounded-2xl`}>
          <h2 className={`${matches ? "h4" : "h5"}`}>دیدگاه ها و امتیاز</h2>

          {fetchComments && fetchComments.length > 0 ? (
            <div className="space-y-5">
              {fetchComments.map((e, index) => (
                <React.Fragment key={index}>
                  <div className="w-full flex flex-col">
                    <div className="space-y-3 w-full">
                      <div className="w-full flex justify-start items-center gap-x-2">
                        <div className="w-14 h-14 rounded-full">
                          <svg width="100%" height="100%" viewBox="0 0 410 410" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M410 205C410 91.7816 318.218 0 205 0C91.7816 0 0 91.7816 0 205C0 318.218 91.7816 410 205 410C318.218 410 410 318.218 410 205Z" fill="url(#paint0_linear_12_4)" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M83.1602 332.247C110.793 293.972 155.788 269.062 206.602 269.062C256.606 269.062 300.977 293.185 328.711 330.428C296.9 361.806 253.212 381.172 205 381.172C157.727 381.172 114.802 362.552 83.1602 332.247ZM275.469 164.961C275.469 204.764 244.636 237.031 206.602 237.031C168.567 237.031 137.734 204.764 137.734 164.961C137.734 125.158 168.567 92.8906 206.602 92.8906C244.636 92.8906 275.469 125.158 275.469 164.961Z" fill="white" />
                            <defs>
                              <linearGradient id="paint0_linear_12_4" x1="205" y1="0" x2="205" y2="410" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#A5ABB7" />
                                <stop offset="1" stopColor="#848B94" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <p className="h6 line-clamp-1 flex-1">{e.user_name}</p>
                        <p className="h6 mr-auto">{timeAgo(new Date(e.created_at))}</p>
                      </div>
                      <p>{e.text}</p>
                    </div>
                  </div>

                  {index !== fetchComments.length - 1 && <hr className="border-neutral6" />}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className="text-neutral10">دیدگاهی وجود ندارد</p>
          )}
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full sm:w-[500px]">
          <h2 className={`${matches ? "h5" : "h6"}`}>نظر خود را بنویسید</h2>

          {inputs.map(({ name, label, type, Icon }) => (
            <Controller key={name} name={name as keyof FormValues} control={control} render={({ field }) => <CustomInput {...field} label={label} type={type} Icon={Icon} error={errors[name as keyof FormValues]?.message} width="100%" Element={name === "text" ? "textarea" : "input"} height={`${name === "text" ? "150px" : "56px"}`} />} />
          ))}

          <CustomButton type="submit" variant="filled" width="w-full" height="h-14" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="ارسال">
            ارسال
          </CustomButton>
        </form>
      </section>
    </>
  );
};

export default Product;
