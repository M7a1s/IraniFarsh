import type { ReactElement } from "react";
import { useFormContext } from "react-hook-form";

type CustomRadioProps = {
  title: string;
  name: string;
  value: string;
};

const CustomRadio: React.FC<CustomRadioProps> = ({ title, name, value }): ReactElement => {
  const { register } = useFormContext();

  return (
    <label htmlFor={`${name}-${value}`} className="cursor-pointer w-fit flex items-center gap-x-3">
      <input id={`${name}-${value}`} type="radio" value={value} {...register(name)} className="box-content cursor-pointer h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding ring-1 ring-gray-950/20 outline-none checked:border-[var(--color-primary)] checked:ring-[var(--color-primary)]" />
      {title}
    </label>
  );
};

export default CustomRadio;
