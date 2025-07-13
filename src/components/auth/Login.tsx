import { useContext, type ReactElement } from "react";
import { Lock, Sms } from "iconsax-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "@/components/common/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { SnackBarContext } from "@/context/SnackBarProvider";
import { AuthContext } from "@/context/AuthProvider";
import { useCookies } from "react-cookie";
import Spinner from "@/components/ui/Spinner";
import { useMutation } from "@tanstack/react-query";
import { translateSupabaseAuthError } from "@/utils/error";

const inputs = [
  { name: "email", label: "ایمیل", type: "email", Icon: Sms },
  { name: "password", label: "رمز عبور", type: "password", Icon: Lock },
];

const schema = yup.object({
  email: yup.string().required("ایمیل الزامی است").email("ایمیل معتبر نیست"),
  password: yup
    .string()
    .required("رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .matches(/[a-z]/, "رمز عبور باید شامل حداقل یک حرف کوچک باشد")
    .matches(/[A-Z]/, "رمز عبور باید شامل حداقل یک حرف بزرگ باشد")
    .matches(/\d/, "رمز عبور باید شامل حداقل یک عدد باشد")
    .matches(/[@$!%*?&#]/, "رمز عبور باید شامل حداقل یک نماد باشد"),
});

type FormValues = yup.InferType<typeof schema>;

const Login = (): ReactElement => {
  const SnackBar = useContext(SnackBarContext);
  const Auth = useContext(AuthContext);
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

  const loginMutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const { email, password } = formData;

      const response = await fetch(`${import.meta.env.VITE_AUTH_API}/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "خطا در ورود");
      }

      return data;
    },
    onSuccess: (data) => {
      const metadata = data.user.user_metadata;
      setCookie("access_token", data.access_token, { path: "/", secure: true });
      setCookie("refresh_token", data.refresh_token, { path: "/", secure: true });

      Auth?.setUserData({
        id: metadata.sub,
        first_name: metadata.first_name,
        last_name: metadata.last_name,
        email: data.user.email,
      });

      Auth?.setIsLogin(true);
      SnackBar?.showDialog(`${metadata.first_name} ${metadata.last_name} عزیز خوش امدی`, "info");
      navigate("/dashboard/auth");
    },
    onError: (error: Error) => {
      console.log(`enError: ${error.message}\nfaError: ${translateSupabaseAuthError(error.message)}`);
      SnackBar?.showDialog(translateSupabaseAuthError(error.message), "error");
    },
  });

  const onSubmit = (formData: FormValues) => {
    loginMutation.mutate(formData);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={`space-y-6 w-full mt-12 ${Auth?.isLoading || loginMutation.isPending ? "pointer-events-none opacity-50" : ""}`}>
      {inputs.map(({ name, label, type, Icon }) => (
        <Controller key={name} name={name as keyof FormValues} control={control} render={({ field }) => <CustomInput {...field} label={label} type={type} Icon={Icon} error={errors[name as keyof FormValues]?.message} width="100%" height="56px" />} />
      ))}

      <CustomButton type="submit" variant="filled" width="w-full" height="h-14" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="ورود">
        {Auth?.isLoading || loginMutation.isPending ? <Spinner className="size-7 fill-white" /> : "ورود"}
      </CustomButton>

      <div className="Body-Regular">
        ثبت نام نکرده اید؟همین حالا{" "}
        <Link to="/auth/signup" className="text-primary">
          عضو
        </Link>{" "}
        شوید
      </div>
    </form>
  );
};

export default Login;
