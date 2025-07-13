import { useState, type ReactElement } from "react";
import BlogCard from "@/components/ui/BlogCard";
import useFetch from "@/hook/useFetch";
import type { BlogType } from "@/utils/type";
import BlogCardSkeleton from "@/components/ui/skeleton/BlogCardSkeleton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Errorui from "@/components/ui/Errorui";
import CustomButton from "@/components/common/CustomButton";

const Blog = (): ReactElement => {
  const [limit, setLimit] = useState(6);

  const { data, isError, isLoading, refetch } = useFetch<BlogType[] | undefined>("product", `${import.meta.env.VITE_API_URL}/blog?limit=${limit}`, { Prefer: "count=exact" });

  const blogData = data?.data ?? [];
  const total = data?.total ?? 0;

  const matches = useMediaQuery("(min-width: 1190px)");
  const matches2 = useMediaQuery("(min-width: 600px)");

  return (
    <section className="BodyPadding w-full flex flex-col gap-y-3">
      <h1 className="ResponsiveFontSize">وبلاگ</h1>

      {isError ? (
        <Errorui title="خطا در بارگزاری مقالات" className="mt-5" onClick={() => refetch()} />
      ) : (
        <div className="flex flex-col items-center gap-y-10 w-full">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <div className={`flex flex-col gap-10 items-center ${matches ? `${index === 0 ? "flex-row" : " flex-row-reverse"}` : "flex-col"} ${!matches2 && "w-full"}`} key={index}>
                <BlogCardSkeleton size={"Big"} />
                <div className={`flex ${matches2 ? "flex-row" : "flex-col w-full"} items-center gap-10`}>
                  <BlogCardSkeleton size={"small"} />
                  <BlogCardSkeleton size={"small"} />
                </div>
              </div>
            ))
          ) : (
            <>
              {blogData && blogData.length > 0 ? (
                <>
                  {blogData.reduce<ReactElement[]>((acc, _, index) => {
                    if (index % 3 !== 0) return acc;

                    const group = blogData.slice(index, index + 3);
                    const [big, small1, small2] = group;
                    const isEven = Math.floor(index / 3) % 2 === 0;

                    acc.push(
                      <div key={big.id} className={`flex gap-10 justify-between items-center ${matches ? `${isEven ? "flex-row" : "flex-row-reverse"}` : "flex-col"}`}>
                        <BlogCard size="Big" id={big.id} title={big.title} image={big.image} />
                        <div className={`flex ${matches2 ? "flex-row" : "flex-col"} ${!matches && "w-full"} items-center gap-10`}>
                          {small1 && <BlogCard size="small" id={small1.id} title={small1.title} image={small1.image} />}
                          {small2 && <BlogCard size="small" id={small2.id} title={small2.title} image={small2.image} />}
                        </div>
                      </div>
                    );

                    return acc;
                  }, [])}

                  {blogData && blogData.length > 0 && blogData.length < total && (
                    <CustomButton variant="filled" width="w-fit" height="h-12" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="مشاهده بیشتر" onClick={() => setLimit((prev) => prev + 2)}>
                      مشاهده بیشتر
                    </CustomButton>
                  )}
                </>
              ) : (
                <div>هیچ مطلبی موجود نیست.</div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default Blog;
