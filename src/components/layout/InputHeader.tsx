import { useState, useEffect } from "react";
import { SearchNormal1 } from "iconsax-react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ProductType } from "@/utils/type";

type InputHeaderType = {
  matches2: boolean;
};

const fetchProducts = async (value: string) => {
  if (!value.trim()) return [];

  const url = `${import.meta.env.VITE_API_URL}/products?title=ilike.*${value}*&select=*`;

  const response = await fetch(url, {
    headers: {
      apikey: import.meta.env.VITE_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error((await response.text()) || "Failed to fetch products");
  }

  return (await response.json()) as ProductType[];
};

const InputHeader: React.FC<InputHeaderType> = ({ matches2 }) => {
  const [value, setValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  const {
    data: products = [],
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchProducts", debouncedValue],
    queryFn: () => fetchProducts(debouncedValue),
    enabled: debouncedValue.trim().length > 0,
    staleTime: 1000 * 30,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    setValue("");
  }, [location.pathname]);

  return (
    <div className={`relative ${matches2 ? "w-[439px] mr-6" : "w-full"}`}>
      {!value.length && (
        <div className="absolute top-1/2 -translate-y-1/2 right-3 z-[991] flex items-center gap-x-2 pointer-events-none">
          <SearchNormal1 className="size-6 stroke-neutral10" />
          <label htmlFor="searchItem" className="text-neutral10">
            جستجو فرش
          </label>
        </div>
      )}

      <input id="searchItem" type="text" className="w-full h-12 bg-neutral4 px-3 rounded-xl text-neutral10 font-medium" onChange={handleChange} value={value} />

      {(isFetching || products.length > 0 || isError || (!isFetching && !isError && debouncedValue.trim().length > 0 && products.length === 0)) && (
        <div className="w-full max-h-80 bg-white shadow-2xl border border-neutral6 absolute top-14 backdrop-blur-md rounded-xl left-0 z-[999] overflow-y-auto">
          {isFetching && <div className="p-4 text-neutral10">در حال جستجو...</div>}

          {isError && <div className="p-4 text-red-600">خطا: {(error as Error).message}</div>}

          {!isFetching &&
            !isError &&
            products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="block w-full p-3 min-h-10 hover:bg-primary/20 border-b group border-neutral6">
                {product.title}
              </Link>
            ))}

          {!isFetching && !isError && products.length === 0 && debouncedValue.trim().length > 0 && <div className="p-4 text-neutral10">نتیجه‌ای یافت نشد.</div>}
        </div>
      )}
    </div>
  );
};

export default InputHeader;
