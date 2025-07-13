import One from "@/assets/image/Categories/1.webp";
import Tow from "@/assets/image/Categories/2.webp";
import Three from "@/assets/image/Categories/3.webp";
import Four from "@/assets/image/Categories/4.webp";
import Five from "@/assets/image/Categories/5.webp";
import Six from "@/assets/image/Categories/6.webp";
import Seven from "@/assets/image/Categories/7.webp";
import Eight from "@/assets/image/Categories/8.webp";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import useMediaQuery from "@mui/material/useMediaQuery";

const CategoriesArrFirst = [
  {
    image: One,
    title: "فرش های جدید",
    labelSee: "فرش جدید",
    className: "row-span-2 col-start-3 row-start-1",
    positionClassName: "right-6 top-45",
  },
  {
    image: Tow,
    title: "فرش های رنگارنگ",
    labelSee: "فرش رنگارنگ",
    className: "row-span-2 col-start-2 row-start-1",
    positionClassName: "right-6 top-45",
  },
  {
    image: Three,
    title: "پادری دستبافت",
    labelSee: "پادری",
    className: "",
    positionClassName: "right-4 top-8",
  },
  {
    image: Four,
    title: "موکت اتاق",
    labelSee: "موکت",
    className: "col-start-1 row-start-2",
    positionClassName: "right-4 top-8",
  },
] as const;

const CategoriesArrSecond = [
  {
    image: Five,
    title: "فرش مدرن فانتزی",
    labelSee: "فرش مدرن",
    className: "row-span-2 col-start-3 row-start-1",
    positionClassName: "right-6 top-45",
  },
  {
    image: Six,
    title: "فرش دستبافت تبریز",
    labelSee: "فرش تبریز",
    className: "row-span-2 col-start-2 row-start-1",
    positionClassName: "right-6 top-45",
  },
  {
    image: Seven,
    title: "قالیچه دستبافت",
    labelSee: "قالیچه دستبافت",
    className: "",
    positionClassName: "right-4 top-8",
  },
  {
    image: Eight,
    title: "قالیچه ماشینی",
    labelSee: "قالیچه ماشینی",
    className: "col-start-1 row-start-2",
    positionClassName: "right-4 top-8",
  },
] as const;

type CategoryOption = {
  ArrayMap: "CategoriesArrFirst" | "CategoriesArrSecond";
};

const Categories: React.FC<CategoryOption> = ({ ArrayMap }) => {
  const matches = useMediaQuery("(min-width: 1000px)");
  const Selected = ArrayMap === "CategoriesArrFirst" ? CategoriesArrFirst : CategoriesArrSecond;
  return (
    <section aria-labelledby="categories" dir="ltr" className={`w-full h-72 ${matches ? "grid grid-cols-3 grid-rows-2 gap-6 BodyPadding" : "BodyPadding !pl-0"}`}>
      <h2 className="sr-only">دسته‌بندی فرش‌ها</h2>

      {matches ? (
        Selected.map((e, index) => (
          <div dir="rtl" className={`${e.className} relative overflow-hidden rounded-2xl group`} key={index}>
            <Link to="/productlist" className="w-full h-full">
              <img src={e.image} alt={e.title} className="w-full h-full -z-10 object-cover pointer-events-none group-hover:scale-110 duration-300" />
              <div className="w-full h-full absolute inset-0 bg-black/50 group-hover:bg-black/70 duration-300 pointer-events-none"></div>
              <div className={`absolute w-full ${e.positionClassName} z-20 space-y-2`}>
                <p className="h5 text-white">{e.title}</p>
                <span className="flex w-fit items-center px-4 h-12 border border-white text-white h6 rounded-xl">مشاهده و خرید {e.labelSee}</span>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <Swiper
          dir="rtl"
          className="mySwiper w-full h-full"
          breakpoints={{
            0: {
              slidesPerView: 1.038,
            },
            501: {
              slidesPerView: "auto",
            },
          }}
        >
          {Selected.map((e, index) => (
            <SwiperSlide className="!w-[calc(100%-1rem)] xs:!w-[391px] !h-full pl-2 xs:pl-6 xs:pr-6" key={index}>
              <div className={"w-full h-full relative overflow-hidden rounded-2xl group"} key={index}>
                <Link to="/productlist" className="w-full h-full">
                  <img src={e.image} alt={e.title} className="w-full h-full -z-10 object-cover pointer-events-none group-hover:scale-110 duration-300" />
                  <div className="w-full h-full absolute inset-0 bg-black/50 group-hover:bg-black/70 duration-300 pointer-events-none"></div>
                  <div className={`absolute w-full right-6 top-45 z-20 space-y-2`}>
                    <p className="h5 text-white">{e.title}</p>
                    <span className="flex w-fit items-center px-4 h-12 border border-white text-white h6 rounded-xl">مشاهده و خرید {e.labelSee}</span>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default Categories;
