import { useContext, type ReactElement } from "react";
import ClientOnlyMap from "@/components/map/ClientOnlyMap";
import { User, Sms, Message } from "iconsax-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "@/components/common/CustomButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMutation } from "@tanstack/react-query";
import { SnackBarContext } from "@/context/SnackBarProvider";
import Spinner from "@/components/ui/Spinner";
import type { ApiResponse } from "@/utils/error";

const inputs = [
  { name: "userName", label: "نام و نام خانوادگی", type: "text", Icon: User },
  { name: "email", label: "ایمیل", type: "email", Icon: Sms },
  { name: "message", label: "پیام", type: "text", Icon: Message },
];

const schema = yup.object({
  userName: yup.string().required("نام و نام خانوادگی الزامی است"),
  email: yup.string().required("ایمیل الزامی است").email("ایمیل معتبر نیست"),
  message: yup.string().required("پیام الزامی است"),
});

type FormValues = yup.InferType<typeof schema>;

const ContactUs = (): ReactElement => {
  const SnackBar = useContext(SnackBarContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const messageMutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contactus`, {
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
    onSuccess: (_, variables) => {
      SnackBar?.showDialog(`${variables.userName} عزیز، پیامت با موفقیت ثبت شد`, "success");
    },
    onError: (error: Error) => {
      console.log(error);
      SnackBar?.showDialog(error.message, "error");
    },
  });

  const onSubmit = (formData: FormValues) => {
    messageMutation.mutate(formData);
  };

  const matches = useMediaQuery("(min-width: 1060px)");

  return (
    <div className={`${matches ? "w-[1037px] gap-y-10" : "w-full sm:w-[574px] px-5 gap-y-5"} items-center flex flex-col`}>
      <h1 className={`ResponsiveFontSize w-full`}>تماس با ما</h1>
      <div className={`w-full ${matches ? "flex-row" : "flex-col"} items-center flex justify-center gap-y-10 gap-x-32`}>
        <form noValidate onSubmit={handleSubmit(onSubmit)} className={`w-full space-y-5 ${messageMutation.isPending && "pointer-events-none opacity-50"}`}>
          {inputs.map(({ name, label, type, Icon }) => (
            <Controller key={name} name={name as keyof FormValues} control={control} render={({ field }) => <CustomInput {...field} label={label} type={type} Icon={Icon} error={errors[name as keyof FormValues]?.message} width="100%" Element={name === "message" ? "textarea" : "input"} height={`${name === "message" ? "150px" : "56px"}`} />} />
          ))}

          <CustomButton type="submit" variant="filled" width="w-full" height="h-14" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="ارسال">
            {messageMutation.isPending ? <Spinner className="size-7 fill-white" /> : "ارسال"}
          </CustomButton>
        </form>
        <ClientOnlyMap />
      </div>
    </div>
  );
};

export default ContactUs;
