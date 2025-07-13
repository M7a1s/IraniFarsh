import { useContext, type ReactElement } from "react";
import { Sms } from "iconsax-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "@/components/common/CustomInput";
import { SnackBarContext } from "@/context/SnackBarProvider";
import { AuthContext } from "@/context/AuthProvider";
import CustomButton from "@/components/common/CustomButton";
import Spinner from "@/components/ui/Spinner";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { translateSupabaseAuthError } from "@/utils/error";

const inputs = [{ name: "email", label: "ایمیل", type: "email", Icon: Sms }];

const schema = yup.object({
  email: yup.string().required("ایمیل الزامی است").email("ایمیل معتبر نیست"),
});

type FormValues = yup.InferType<typeof schema>;

const ResetPass = (): ReactElement => {
  const SnackBar = useContext(SnackBarContext);
  const Auth = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const resetPassMutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const { email } = formData;

      const response = await fetch(`${import.meta.env.VITE_AUTH_API}/recover`, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "خطا در ریکاوری");
      }

      return data;
    },
    onSuccess: () => {
      SnackBar?.showDialog("لینک بازیابی رمز عبور به ایمیل شما ارسال شد", "success");
    },
    onError: (error: Error) => {
      console.log(`enError: ${error.message}\nfaError: ${translateSupabaseAuthError(error.message)}`);
      SnackBar?.showDialog(translateSupabaseAuthError(error.message), "error");
    },
  });

  const onSubmit = (formData: FormValues) => {
    resetPassMutation.mutate(formData);
  };
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={`space-y-6 w-full mt-12 ${Auth?.isLoading || resetPassMutation.isPending ? "pointer-events-none opacity-50" : ""}`}>
      {inputs.map(({ name, label, type, Icon }) => (
        <Controller key={name} name={name as keyof FormValues} control={control} render={({ field }) => <CustomInput {...field} label={label} type={type} Icon={Icon} error={errors[name as keyof FormValues]?.message} width="100%" height="56px" />} />
      ))}

      <div className="w-full text-start">
        <Link to="/auth/login" className="hover:text-primary">
          ورود
        </Link>
      </div>

      <CustomButton type="submit" variant="filled" width="w-full" height="h-14" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="ارسال">
        {Auth?.isLoading || resetPassMutation.isPending ? <Spinner className="size-7 fill-white" /> : "ارسال"}
      </CustomButton>
    </form>
  );
};

export default ResetPass;
