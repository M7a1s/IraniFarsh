import type { ReactElement } from "react";
import { Image } from "iconsax-react";

const ProductCardSkeleton = (): ReactElement => {
  return (
    <div className="w-72 h-[468px] p-4 border border-neutral5 rounded-2xl animate-pulse flex flex-col justify-between items-center">
      <div className="w-full h-65 bg-neutral3 rounded-2xl flex justify-center items-center">
        <Image className="size-20 stroke-neutral7" />
      </div>

      <div className="w-full mt-6 space-y-2">
        <div className="h-4 bg-neutral3 rounded"></div>
        <div className="h-4 bg-neutral3 rounded w-3/4"></div>
      </div>

      <div className="w-full flex justify-between items-center mt-4">
        <div className="h-3 w-12 bg-neutral3 rounded"></div>
        <div className="flex items-center gap-x-2">
          <div className="h-4 w-16 bg-neutral3 rounded"></div>
          <div className="h-4 w-4 bg-neutral3 rounded"></div>
        </div>
      </div>

      <div className="w-full mt-6">
        <div className="h-10 w-full bg-neutral3 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
