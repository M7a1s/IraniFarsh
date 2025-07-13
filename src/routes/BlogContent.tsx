import { useEffect, useState, type ReactElement } from "react";
import { Navigate, useParams } from "react-router-dom";
import useFetch from "@/hook/useFetch";
import type { BlogType } from "@/utils/type";
import createDOMPurify from "dompurify";
import { setDocumentTitle } from "@/utils/utils";

const BlogContent = (): ReactElement => {
  const { id } = useParams();

  const { data, isError, isLoading } = useFetch<BlogType[] | undefined>("product", `${import.meta.env.VITE_API_URL}/blog?id=eq.${id}`);

  const dataBlog: BlogType | undefined = data?.data?.[0];

  const [cleanHtml, setCleanHtml] = useState<string>("");

  useEffect(() => {
    if (dataBlog?.title) {
      setDocumentTitle(dataBlog?.title);
    }
  }, [dataBlog?.title]);

  useEffect(() => {
    if (typeof window !== "undefined" && dataBlog?.content) {
      const DOMPurify = createDOMPurify(window);
      setCleanHtml(DOMPurify.sanitize(dataBlog.content));
    } else {
      setCleanHtml("");
    }
  }, [dataBlog?.content]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-y-5 BodyPadding">
        <div className="h-10 w-32 bg-neutral3 rounded-2xl"></div>

        <div className="w-full overflow-hidden rounded-3xl max-h-[461px] bg-neutral3 aspect-video"></div>
      </div>
    );
  }

  if (isError || !dataBlog) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <section className="w-full flex flex-col gap-y-5 BodyPadding">
      <h1 className="ResponsiveFontSize">{dataBlog?.title}</h1>
      <div className="w-full overflow-hidden rounded-3xl max-h-[461px] aspect-video">
        <img src={dataBlog?.image} alt={dataBlog?.title} className="w-full h-full object-cover" />
      </div>

      <div dangerouslySetInnerHTML={{ __html: cleanHtml }}></div>
    </section>
  );
};

export default BlogContent;
