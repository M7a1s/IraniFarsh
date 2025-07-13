import useMediaQuery from "@mui/material/useMediaQuery";

type BlogCardSkeletonType = {
  size: "Big" | "small";
};

const BlogCardSkeleton: React.FC<BlogCardSkeletonType> = ({ size }) => {
  const matches = useMediaQuery("(min-width: 600px)");

  return (
    <article className={`${matches ? `${size === "Big" ? "w-[560px]" : "w-67"}` : "w-full"} h-85 bg-neutral3 rounded-3xl overflow-hidden relative animate-pulse`}>
      <div className="w-full h-full">
        <div className="w-full h-full bg-neutral4"></div>

        <div className={`pointer-events-none w-full h-full absolute top-0 left-0 pb-5 px-5 flex flex-col justify-end items-start gap-y-3 bg-gradient-to-t from-black/80 to-transparent`}>
          <div className={`${matches ? `${size === "Big" ? "h-6" : "h-5"}` : "h-5"} w-3/4 bg-neutral7 rounded`}></div>

          {/* Button placeholder */}
          <div className={`border border-neutral1 bg-transparent w-32 h-10 rounded-xl`}></div>
        </div>
      </div>
    </article>
  );
};

export default BlogCardSkeleton;
