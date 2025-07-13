import Banner from "@/assets/image/Banner.webp";
import CustomButton from "@/components/common/CustomButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Categories from "@/components/home/Categories";
import ProductSection from "@/components/home/ProductSection";
import type { ReactElement } from "react";

const Home = (): ReactElement => {
  const matches = useMediaQuery("(min-width: 580px)");
  return (
    <>
      <section className="w-full BodyPadding flex flex-col-reverse 2xl:flex-row gap-y-10 md:gap-y-20 justify-between items-center" aria-labelledby="hero-title">
        <div className="flex flex-col items-center gap-y-6 sm:w-[600px]">
          <h1 id="hero-title" className={`${matches ? "h2" : "h5"}`}>
            خرید راحت فرش، در <span className="text-primary">ایرانی فرش</span>
          </h1>

          <strong className={`${matches ? "Body-MD" : "Body-XS"} text-center`}>با ایـــرانی فرش در سریع ترین زمان ممکن فرش خودت رو سفارش بده و از تنوع بی نظیر فرش ها لذت ببر.</strong>

          <div className={`flex items-center justify-center ${matches ? "gap-x-10" : "gap-x-3"}`}>
            <CustomButton variant="bordered" height={matches ? "h-14" : "h-9"} rounded="rounded-xl" element="Link" ratio={"aspect-auto"} ariaLabel="عضویت در باشگاه مشتریان" to="/club">
              عضویت در باشگاه مشتریان
            </CustomButton>

            <CustomButton variant="filled" height={matches ? "h-14" : "h-9"} rounded="rounded-xl" element="Link" ratio={"aspect-auto"} ariaLabel="محصولات ویژه ایرانی فرش" to="/special-products">
              محصولات ویژه ایرانی فرش
            </CustomButton>
          </div>
        </div>

        <img src={Banner} alt="بنر تبلیغاتی خرید فرش با تخفیف ویژه" />
      </section>

      <Categories ArrayMap="CategoriesArrFirst" />
      <ProductSection title="فرش های دستبافت" path="/productlist" urlFetch={`${import.meta.env.VITE_API_URL}/products?type=eq.${encodeURIComponent("دستبافت")}&limit=4&order=price.desc`} />
      <Categories ArrayMap="CategoriesArrSecond" />
      <ProductSection title="فرش های ماشینی" path="/productlist" urlFetch={`${import.meta.env.VITE_API_URL}/products?type=eq.${encodeURIComponent("ماشینی")}&limit=4&order=price.desc`} />
    </>
  );
};

export default Home;
