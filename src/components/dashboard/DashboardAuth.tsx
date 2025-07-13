import { useContext, type ReactElement } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { User, Lock, Sms } from "iconsax-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "@/components/common/CustomInput";
import useMediaQuery from "@mui/material/useMediaQuery";
import CustomButton from "@/components/common/CustomButton";
import { useMutation } from "@tanstack/react-query";
import { SnackBarContext } from "@/context/SnackBarProvider";
import { useCookies } from "react-cookie";
import Spinner from "@/components/ui/Spinner";
import { translateSupabaseAuthError } from "@/utils/error";

interface UserUpdates {
  first_name?: string;
  last_name?: string;
}

interface Payload {
  data?: UserUpdates;
  email?: string;
  password?: string;
}

const DashboardAuth = (): ReactElement => {
  const Auth = useContext(AuthContext);
  const SnackBar = useContext(SnackBarContext);
  const [cookies] = useCookies(["access_token", "refresh_token"]);

  const matches = useMediaQuery("(min-width:1296px)");

  const inputs = [
    { name: "first_name", label: "نام", type: "text", defaultValue: Auth?.userData?.first_name, Icon: User },
    { name: "last_name", label: "نام خانوادگی", type: "text", defaultValue: Auth?.userData?.last_name, Icon: User },
    { name: "email", label: "ایمیل", type: "email", defaultValue: Auth?.userData?.email, Icon: Sms },
    { name: "password", label: "رمز عبور", type: "password", defaultValue: "******", Icon: Lock },
  ];

  const schema = yup.object({
    first_name: yup.string().optional(),
    last_name: yup.string().optional(),
    email: yup.string().email("ایمیل معتبر نیست").optional(),
    password: yup
      .string()
      .test("password-validation", "رمز عبور باید حداقل ۶ کاراکتر باشد", function (value) {
        if (!value || value === "") return true;
        return value.length >= 6;
      })
      .test("password-lowercase", "رمز عبور باید شامل حداقل یک حرف کوچک باشد", function (value) {
        if (!value || value === "") return true;
        return /[a-z]/.test(value);
      })
      .test("password-uppercase", "رمز عبور باید شامل حداقل یک حرف بزرگ باشد", function (value) {
        if (!value || value === "") return true;
        return /[A-Z]/.test(value);
      })
      .test("password-number", "رمز عبور باید شامل حداقل یک عدد باشد", function (value) {
        if (!value || value === "") return true;
        return /\d/.test(value);
      })
      .test("password-symbol", "رمز عبور باید شامل حداقل یک نماد باشد", function (value) {
        if (!value || value === "") return true;
        return /[@$!%*?&#]/.test(value);
      })
      .optional(),
  });

  type FormValues = yup.InferType<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    mode: "onSubmit",
    defaultValues: {
      first_name: Auth?.userData?.first_name ?? "",
      last_name: Auth?.userData?.last_name ?? "",
      email: Auth?.userData?.email ?? "",
      password: "",
    },
  });

  const EditMutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const { first_name, last_name, email, password } = formData;
      const updates: UserUpdates = {};

      if (first_name !== Auth?.userData?.first_name) updates.first_name = first_name;
      if (last_name !== Auth?.userData?.last_name) updates.last_name = last_name;

      const payload: Payload = {};

      if (Object.keys(updates).length > 0) {
        payload.data = updates;
      }

      if (email?.trim().toLowerCase() !== Auth?.userData?.email?.trim().toLowerCase()) {
        payload.email = email;
      }

      if (password && password !== "") {
        payload.password = password;
      }

      const hasChanges = !!payload.data || payload.email || payload.password;

      if (!hasChanges) {
        throw new Error("No changes have been made");
      }

      const response = await fetch(`${import.meta.env.VITE_AUTH_API}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${cookies.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.msg || "خطا در تغییر اطلاعات");
      }

      return data;
    },

    onSuccess: (_, variables) => {
      SnackBar?.showDialog(`${variables.first_name} ${variables.last_name} عزیز اطلاعاتت با موفقیت تغییر کرد`, "success");
      Auth?.handleLogOut();
    },

    onError: (error: Error) => {
      console.log(`enError: ${error.message}\nfaError: ${translateSupabaseAuthError(error.message)}`);
      SnackBar?.showDialog(translateSupabaseAuthError(error.message), "warning");
    },
  });

  const onSubmit = (formData: FormValues) => {
    EditMutation.mutate(formData);
  };

  return (
    <>
      {Auth?.isLoading ? (
        <Spinner className="size-8 fill-primary" />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-row w-full justify-between items-center flex-wrap gap-5">
          {inputs.map(({ name, label, type, Icon }) => (
            <Controller key={name} name={name as keyof FormValues} control={control} render={({ field }) => <CustomInput {...field} label={label} type={type} Icon={Icon} error={errors[name as keyof FormValues]?.message} width={matches ? "350px" : "100%"} height="56px" />} />
          ))}

          <div className={`${matches ? "w-[350px]" : "w-full"}`}>
            <CustomButton type="submit" variant="filled" width="w-full" height="h-14" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="تغییر اطلاعات">
              {EditMutation.isPending ? <Spinner className="size-7 fill-white" /> : "تغییر اطلاعات"}
            </CustomButton>
          </div>
        </form>
      )}
    </>
  );
};

export default DashboardAuth;
