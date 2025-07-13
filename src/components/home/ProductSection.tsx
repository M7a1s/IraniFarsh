import useFetch from "@/hook/useFetch";
import type { ProductType } from "@/utils/type";
import ProductCard from "@/components/ui/ProductCard";
import CustomButton from "../common/CustomButton";
import { ArrowLeft } from "iconsax-react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import ProductCardSkeleton from "@/components/ui/skeleton/ProductCardSkeleton";
import "swiper/swiper-bundle.css";

type typeProps = {
  title: string;
  path: string;
  urlFetch: string;
  customSort?: (products: ProductType[], currentPrice?: number) => ProductType[];
  currentPrice?: number;
};

const ProductSection: React.FC<typeProps> = ({ title, path, urlFetch, customSort, currentPrice }) => {
  const location = useLocation();
  const checkPath = location.pathname.startsWith("/product");
  const { data, isLoading, isError } = useFetch<ProductType[]>("Product", urlFetch);
  const matches = useMediaQuery(`(min-width:501px)`);
  const ProductData = useMemo(() => data?.data ?? [], [data]);
  const sortedProducts = useMemo(() => {
    if (!ProductData) return [];
    return customSort ? customSort(ProductData, currentPrice) : ProductData;
  }, [ProductData, customSort, currentPrice]);

  if (isError) {
    return null;
  }
  return (
    <section className={`w-full ${checkPath && "mt-20"}`}>
      <div className="w-full flex justify-between items-center BodyPadding">
        <h2 className={`${matches ? "h4" : "h5"}`}>{title}</h2>

        {!checkPath && (
          <CustomButton variant="bordered" height={"h-9"} rounded="rounded-xl" element="Link" ratio={"aspect-auto"} ariaLabel="مشاهده همه" to={path}>
            مشاهده همه
            <ArrowLeft className="size-5 stroke-primary" />
          </CustomButton>
        )}
      </div>

      <div className="w-full BodyPadding !pl-0">
        <Swiper
          dir="rtl"
          id="productSwiper"
          className="mySwiper w-full h-full mt-6"
          breakpoints={{
            0: {
              slidesPerView: "auto",
              spaceBetween: 24,
            },
            501: {
              slidesPerView: "auto",
              spaceBetween: 24,
            },
            1450: {
              slidesPerView: "auto",
              spaceBetween: 0,
            },
          }}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <SwiperSlide className={`!w-fit ${index === 3 && "ml-4 xs:ml-6 lg:ml-12 xl:ml-27 2xl:ml-32"}`} key={index}>
                  <ProductCardSkeleton />
                </SwiperSlide>
              ))
            : sortedProducts?.map((product, index) => (
                <SwiperSlide className={`!w-fit ${index === sortedProducts?.length - 1 && "ml-4 xs:ml-6 lg:ml-12 xl:ml-27 2xl:ml-32"}`} key={product.id}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductSection;
