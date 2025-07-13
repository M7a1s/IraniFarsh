import { useContext, type ReactElement } from "react";
import { User, Lock, Sms } from "iconsax-react";
import CustomInput from "@/components/common/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomButton from "@/components/common/CustomButton";
import { AuthContext } from "@/context/AuthProvider";
import { SnackBarContext } from "@/context/SnackBarProvider";
import { useCookies } from "react-cookie";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/ui/Spinner";
import { translateSupabaseAuthError } from "@/utils/error";

const inputs = [
  { name: "first_name", label: "نام", type: "text", Icon: User },
  { name: "last_name", label: "نام خانوادگی", type: "text", Icon: User },
  { name: "email", label: "ایمیل", type: "email", Icon: Sms },
  { name: "password", label: "ایجاد رمز عبور", type: "password", Icon: Lock },
  { name: "confirmPassword", label: "تکرار رمز عبور", type: "password", Icon: Lock },
];

const schema = yup.object({
  first_name: yup.string().required("نام الزامی است"),
  last_name: yup.string().required("نام خانوادگی الزامی است"),
  email: yup.string().required("ایمیل الزامی است").email("ایمیل معتبر نیست"),
  password: yup
    .string()
    .required("رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .matches(/[a-z]/, "رمز عبور باید شامل حداقل یک حرف کوچک باشد")
    .matches(/[A-Z]/, "رمز عبور باید شامل حداقل یک حرف بزرگ باشد")
    .matches(/\d/, "رمز عبور باید شامل حداقل یک عدد باشد")
    .matches(/[@$!%*?&#]/, "رمز عبور باید شامل حداقل یک نماد باشد"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "رمز عبور و تکرار آن باید یکسان باشد")
    .required("تکرار رمز عبور الزامی است"),
});

type FormValues = yup.InferType<typeof schema>;

const SignUp = (): ReactElement => {
  const Auth = useContext(AuthContext);
  const SnackBar = useContext(SnackBarContext);
  const [, setCookie] = useCookies(["access_token", "refresh_token"]);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (formData: FormValues) => {
      const { first_name, last_name, email, password } = formData;

      const response = await fetch(`${import.meta.env.VITE_AUTH_API}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          email,
          password,
          data: {
            first_name,
            last_name,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "خطا در ثبت‌نام");
      }

      return data;
    },

    onSuccess: (data) => {
      const metadata = data.user.user_metadata;

      setCookie("access_token", data.access_token, { path: "/", secure: false });
      setCookie("refresh_token", data.refresh_token, { path: "/", secure: false });

      Auth?.setUserData({
        id: metadata.sub,
        first_name: metadata.first_name,
        last_name: metadata.last_name,
        email: metadata.email,
      });
      Auth?.setIsLogin(true);
      SnackBar?.showDialog(`${metadata.first_name} ${metadata.last_name} عزیز خوش آمدی`, "info");
      navigate("/dashboard/auth");
    },

    onError: (error: Error) => {
      console.log(`enError: ${error.message}\nfaError: ${translateSupabaseAuthError(error.message)}`);
      SnackBar?.showDialog(translateSupabaseAuthError(error.message), "error");
    },
  });

  const onSubmit = (formData: FormValues) => {
    signupMutation.mutate(formData);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={`space-y-6 w-full mt-12 ${Auth?.isLoading || signupMutation.isPending ? "pointer-events-none opacity-50" : ""}`}>
      {inputs.map(({ name, label, type, Icon }) => (
        <Controller key={name} name={name as keyof FormValues} control={control} render={({ field }) => <CustomInput {...field} label={label} type={type} Icon={Icon} error={errors[name as keyof FormValues]?.message} width="100%" height="56px" />} />
      ))}

      <CustomButton type="submit" variant="filled" width="w-full" height="h-14" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="ثبت نام">
        {Auth?.isLoading || signupMutation.isPending ? <Spinner className="size-7 fill-white" /> : "ثبت نام"}
      </CustomButton>

      <div className="Body-Regular">
        حساب کاربری دارید؟{" "}
        <Link to="/auth/login" className="text-primary">
          ورود
        </Link>{" "}
        کنید
      </div>
    </form>
  );
};

export default SignUp;
