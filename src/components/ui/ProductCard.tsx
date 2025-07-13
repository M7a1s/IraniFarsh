import type { ProductType } from "@/utils/type";
import CustomButton from "@/components/common/CustomButton";
import { useState } from "react";
import { TomanSvg } from "@/assets/Svg";
const ProductCard: React.FC<ProductType> = ({ id, title, image, price }) => {
  const [errorImage, setErrorImage] = useState<boolean>(false);
  return (
    <div className="w-72 h-[468px] p-4 border border-neutral5 rounded-2xl flex flex-col justify-between items-center">
      <div className={`w-full h-65 ${errorImage || !image ? "bg-primary/20 p-3 rounded-2xl flex justify-center items-center" : ""}`}>{errorImage || !image ? <p className="h1 text-primary">ایرانی فرش</p> : <img src={image} alt={title} onError={() => setErrorImage(true)} className="w-full h-full object-contain appearance-none" />}</div>

      <p className="text-sm font-semibold mt-6 line-clamp-2 text-black">{title}</p>

      <div className="w-full flex justify-between items-center mt-4">
        <p className="Body-XXS">قیمت:</p>
        <div className="flex items-center gap-x-2">
          <p className="Body-S">{price.toLocaleString()}</p>
          <TomanSvg className="fill-black" />
        </div>
      </div>

      <div className="w-full mt-6">
        <CustomButton variant="bordered" ratio="aspect-auto" element="Link" rounded="rounded-xl" height="h-10" to={`/product/${id}`} ariaLabel="مشاهده  بیشتر">
          مشاهده بیشتر
        </CustomButton>
      </div>
    </div>
  );
};

export default ProductCard;
