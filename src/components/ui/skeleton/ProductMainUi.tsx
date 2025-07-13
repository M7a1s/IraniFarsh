import type { ReactElement } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Image } from "iconsax-react";

const ProductMainUiSkeleton = (): ReactElement => {
  const matches1 = useMediaQuery("(min-width: 1300px)");
  const matches2 = useMediaQuery("(min-width: 520px)");
  const matches3 = useMediaQuery("(min-width: 472px)");

  return (
    <div className={`w-full flex ${matches1 ? "flex-row" : "flex-col"} animate-pulse justify-start items-center BodyPadding`}>
      <div className={`bg-neutral3 flex justify-center items-center rounded-xl ${matches1 ? "w-73 h-[461px]" : "w-83 h-[338px]"}`}>
        <Image className="size-20 stroke-neutral7" />
      </div>

      <div className={`flex flex-col ${matches1 ? "mr-7" : "items-center text-center"} ${!matches2 ? "w-full" : "w-[440px]"} mt-8`}>
        <div className={`bg-neutral3 rounded ${matches1 ? "h-8 w-3/4" : matches2 ? "h-9 w-4/5" : "h-7 w-3/4"}`}></div>
        {matches1 && <hr className="w-full mt-3.5 border border-neutral7" />}

        <div className={`flex flex-col ${matches1 ? "items-start" : "items-center"} gap-y-6 mt-7 w-full`}>
          <div className="h-5 w-1/2 bg-neutral3 rounded"></div>

          {matches3 ? (
            <>
              <div className="h-5 w-1/4 bg-neutral3 rounded"></div>

              <div className="flex flex-row justify-between items-center flex-wrap gap-x-6 gap-y-4">
                {[...Array(6)].map((_, index) => (
                  <div className="w-52 h-17.5 bg-neutral3 rounded-lg" key={index}></div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center gap-4 w-full mt-4">
              {[...Array(3)].map((_, index) => (
                <div className="w-32 h-11 bg-neutral3 rounded-lg" key={index}></div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`bg-neutral3 ${matches1 ? "mr-auto w-78" : `mt-8 ${!matches2 ? "w-full" : "w-[440px]"}`} space-y-6 shadow-2xl rounded-xl px-3 py-4 border border-neutral7`}>
        {[...Array(3)].map((_, index) => (
          <div className="flex items-center gap-x-2.5" key={index}>
            <div className="size-6 bg-neutral7 rounded-full"></div>
            <div className="h-4 w-24 bg-neutral7 rounded"></div>
          </div>
        ))}

        <hr className="border border-neutral7" />

        <div className="w-full flex justify-between items-center">
          <div className="h-6 w-12 bg-neutral7 rounded"></div>
          <div className="h-6 w-20 bg-neutral7 rounded"></div>
        </div>

        <div className="h-10 w-full bg-neutral7 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ProductMainUiSkeleton;
