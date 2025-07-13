import { Link } from "react-router-dom";

type BtnType = {
  children: React.ReactNode;
  variant: "filled" | "bordered" | "transparent";
  height: "h-14" | "h-12" | "h-10" | "h-9" | "h-fit";
  width?: "w-full" | "w-fit";
  rounded: "rounded-xl" | "rounded-full";
  ratio: "aspect-square" | "aspect-auto";
  element: "Link" | "button";
  type?: "button" | "submit" | "reset";
  ariaLabel: string;
  to?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function classNames(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const CustomButton: React.FC<BtnType> = ({ variant, height, width, rounded, ratio, element, type = "button", ariaLabel, to, onClick, children }) => {
  const sizeClass = height === "h-14" || height === "h-12" ? "Body-S" : height === "h-10" ? "Caption-LG" : "Body-XXS";

  const gapClass = height === "h-14" || height === "h-12" || height === "h-10" ? "gap-x-2" : "gap-x-1";

  const paddingClass = ratio === "aspect-auto" ? (height === "h-14" || height === "h-12" ? "px-4" : "px-2") : undefined;

  const variantClass = variant === "filled" ? "bg-primary text-white" : variant === "bordered" ? "border border-primary text-primary" : "text-primary";

  const className = classNames("flex flex-row justify-center items-center", ratio, ratio === "aspect-auto" && height, width, sizeClass, gapClass, paddingClass, variantClass, rounded);

  if (element === "Link") {
    return (
      <Link to={to || "/"} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  );
};

export default CustomButton;
