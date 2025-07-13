import { useContext, useEffect, useState, type ReactElement } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Lock } from "iconsax-react";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "@/components/common/CustomButton";
import { useLocation, useNavigate } from "react-router-dom";
import { SnackBarContext } from "@/context/SnackBarProvider";
import { AuthContext } from "@/context/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/ui/Spinner";
import { translateSupabaseAuthError } from "@/utils/error";

const inputs = [
  { name: "password", label: "ایجاد رمز عبور", type: "password", Icon: Lock },
  { name: "confirmPassword", label: "تکرار رمز عبور", type: "password", Icon: Lock },
];

const schema = yup.object({
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

const Recovery = (): ReactElement => {
  const SnackBar = useContext(SnackBarContext);
  const Auth = useContext(AuthContext);
  const [token, setToken] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const RecoveryMutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const { password } = formData;

      const response = await fetch(`${import.meta.env.VITE_AUTH_API}/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "خطا در ریکاوری");
      }

      return data;
    },
    onSuccess: () => {
      SnackBar?.showDialog("رمز عبور با موفقیت تغییر کرد", "success");
      navigate("/auth/login", { replace: true });
    },
    onError: (error: Error) => {
      console.log(`enError: ${error.message}\nfaError: ${translateSupabaseAuthError(error.message)}`);
      SnackBar?.showDialog(translateSupabaseAuthError(error.message), "error");
    },
  });

  const onSubmit = (formData: FormValues) => {
    RecoveryMutation.mutate(formData);
  };

  useEffect(() => {
    let hash = window.location.hash.substring(1); // حذف #

    const lastQuestionMarkIndex = hash.lastIndexOf("?");

    if (lastQuestionMarkIndex !== -1) {
      hash = hash.substring(lastQuestionMarkIndex + 1);
    }

    const params = new URLSearchParams(hash);

    const type = params.get("type");
    const expiresAt = params.get("expires_at");
    const accessToken = params.get("access_token");

    const now = Math.floor(Date.now() / 1000);

    if (type !== "recovery" || !expiresAt || now > Number(expiresAt) || !accessToken) {
      navigate("/auth", { replace: true });
    } else {
      setToken(accessToken);
    }
  }, [location.pathname, navigate]);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={`space-y-6 w-full mt-12 ${Auth?.isLoading || RecoveryMutation.isPending ? "pointer-events-none opacity-50" : ""}`}>
      {inputs.map(({ name, label, type, Icon }) => (
        <Controller key={name} name={name as keyof FormValues} control={control} render={({ field }) => <CustomInput {...field} label={label} type={type} Icon={Icon} error={errors[name as keyof FormValues]?.message} width="100%" height="56px" />} />
      ))}

      <CustomButton type="submit" variant="filled" width="w-full" height="h-14" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="تغییر رمز عبور">
        {Auth?.isLoading || RecoveryMutation.isPending ? <Spinner className="size-7 fill-white" /> : "تغییر رمز عبور"}
      </CustomButton>
    </form>
  );
};

export default Recovery;
