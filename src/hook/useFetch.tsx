import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getPersianErrorMessage } from "@/utils/error";

type ApiResponse<T> = {
  data: T;
  total?: number;
};

const useFetch = <T = unknown,>(queryKey: string, url: string | null, otherHeader = {}): UseQueryResult<ApiResponse<T>, Error> => {
  return useQuery<ApiResponse<T>, Error>({
    queryKey: [queryKey, url],
    enabled: !!url,
    queryFn: async () => {
      try {
        if (!url) throw new Error("URL is required");
        const response = await fetch(url, {
          headers: {
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            Accept: "application/json",
            ...otherHeader,
          },
        });

        if (!response.ok) {
          const errorMessage = getPersianErrorMessage(response.status);
          throw new Error(errorMessage);
        }

        const contentRange = response.headers.get("content-range");
        let total;
        if (contentRange) {
          const parts = contentRange.split("/");
          if (parts.length === 2) {
            total = parseInt(parts[1], 10);
          }
        }

        const data = (await response.json()) as T;

        return { data, total };
      } catch (err: unknown) {
        console.log(queryKey);
        if (err instanceof Error) {
          if (err.name === "TypeError") {
            throw new Error("ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.");
          }
          throw new Error(err.message || "خطای ناشناخته‌ای رخ داده است.");
        }

        throw new Error("خطای ناشناخته‌ای رخ داده است.");
      }
    },
  });
};

export default useFetch;
