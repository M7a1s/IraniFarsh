import { useState, type FC, type SVGProps } from "react";
import { Eye, EyeSlash } from "iconsax-react";
import { isPersian } from "@/utils/utils";

type InputType = {
  label: string;
  type: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
  error?: string;
  width: string;
  height: string;
  value?: string;
  Element?: "textarea" | "input";
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const CustomInput: FC<InputType> = ({ label, type, Icon, error, width, height, value = "", Element = "input", onChange }) => {
  const [isHidden, setIsHidden] = useState(false);

  const isActive = value.length > 0;

  const StrokeSize = `size-6 transition-all ${isActive ? "stroke-primary" : "stroke-neutral10"}`;
  const size = Element === "textarea" ? "top-3" : "top-1/2 -translate-y-1/2";

  return (
    <div className="space-y-2" style={{ width }}>
      <div className="relative" style={{ width, height }}>
        <Element dir={Element === "input" ? (isPersian(value ?? "") ? "rtl" : "ltr") : "rtl"} id={label} type={type === "password" && !isHidden ? "text" : type} className={`w-full ${Element === "textarea" && "pt-3 resize-none"} text-right border rounded-xl pl-3 pr-10 text-black transition-all placeholder:text-black ${isActive ? "border-primary" : "border-neutral6"}`} value={value} style={{ height }} onChange={(e) => onChange?.(e)} />

        <label htmlFor={label} className={`Body-XS absolute transition-all pointer-events-none bg-white px-3.5 ${isActive ? "scale-80 -top-3.5 right-2 text-primary" : `scale-100 right-6 ${size}`}`}>
          {label}
        </label>

        {type === "password" && (
          <div onClick={() => setIsHidden((prev) => !prev)} className="absolute top-1/2 -translate-y-1/2 cursor-pointer left-2">
            {isHidden ? <Eye className={StrokeSize} /> : <EyeSlash className={StrokeSize} />}
          </div>
        )}

        <Icon className={`${StrokeSize} absolute ${size} pointer-events-none right-2`} />
      </div>

      {error && <p className="text-primary text-start mr-2">{error}</p>}
    </div>
  );
};

export default CustomInput;
