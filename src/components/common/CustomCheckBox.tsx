import type { ReactElement } from "react";
import { useFormContext } from "react-hook-form";

type CustomCheckBoxProps = {
  title: string;
  name: string;
  value: string;
};

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({ title, name, value }): ReactElement => {
  const { register } = useFormContext();

  return (
    <label className="cursor-pointer relative flex items-center gap-x-3">
      <div className="relative">
        <input type="checkbox" value={value} {...register(name)} className="peer appearance-none cursor-pointer w-6 h-6 border border-primary rounded-md checked:bg-primary" />
        <span className="hidden peer-checked:block fill-white size-5 absolute top-1/2 left-1/2 -translate-1/2 -translate-y-3.5">
          <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium svg-icon css-5zsjn4" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
            <path d="M9 16.17 5.53 12.7a.996.996 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41a.996.996 0 0 0-1.41 0z" />
          </svg>
        </span>
      </div>

      <p className="-translate-y-1">{title}</p>
    </label>
  );
};

export default CustomCheckBox;
