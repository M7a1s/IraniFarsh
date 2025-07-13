import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { Link } from "react-router-dom";

type BlogCardType = {
  size: "Big" | "small";
  id: string;
  title: string;
  image: string;
};

const BlogCard: React.FC<BlogCardType> = ({ size, id, title, image }) => {
  const [errorImage, setErrorImage] = useState<boolean>(false);
  const [activeHover, setActiveHover] = useState<boolean>(false);
  const matches = useMediaQuery("(min-width: 600px)");
  return (
    <article className={`${matches ? `${size === "Big" ? "w-[560px]" : "w-67"}` : "w-full"} cursor-pointer h-85 bg-primary/20 rounded-3xl overflow-hidden relative`} onMouseEnter={() => setActiveHover(true)} onMouseLeave={() => setActiveHover(false)} onTouchStart={() => setActiveHover(true)} onTouchEnd={() => setActiveHover(false)}>
      <Link className="w-full h-full" to={`/blogcontent/${id}`}>
        <div className={`w-full h-full ${errorImage && "flex justify-center items-center"}`}>{errorImage ? <p className="text-primary h1">ایرانی فرش</p> : <img onError={() => setErrorImage(true)} src={image} alt={title} className={`w-full h-full object-cover duration-300 ${activeHover ? "scale-120" : "scale-100"}`} />}</div>
        <div className={`pointer-events-none w-full h-full absolute top-0 left-0 pb-5 px-5 flex flex-col justify-end items-start gap-y-3 bg-[linear-gradient(180deg,transparent_0,rgba(18,18,18,0.16)_51%,rgba(18,18,18,0.64)_72%,rgba(18,18,18,1)_100%)] duration-300 ${activeHover && "bg-black/50"}`}>
          <p className={`${matches ? `${size === "Big" ? "h5" : "h6"}` : "h6"} text-white duration-300 ${activeHover ? "translate-y-0" : "translate-y-14"}`}>{title}</p>
          <div className={`border border-white text-white w-fit py-2 px-4 rounded-xl duration-300 ${activeHover ? "translate-y-0" : "translate-y-20"}`}>خواندن مقاله</div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
