import { useState, useEffect, type ReactElement, useMemo } from "react";
import { ArrowDown2, Sort } from "iconsax-react";
import Slider from "@mui/material/Slider";
import CustomRadio from "@/components/common/CustomRadio";
import CustomCheckBox from "@/components/common/CustomCheckBox";
import useFetch from "@/hook/useFetch";
import type { ProductType } from "@/utils/type";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/skeleton/ProductCardSkeleton";
import useMediaQuery from "@mui/material/useMediaQuery";
import CustomButton from "@/components/common/CustomButton";
import { filterpriceArr, sizeArr, typeArr, CarpetBrands, shapeArr, rateArr, performanceArr } from "@/utils/filterOption";
import Drawer from "@mui/material/Drawer";
import Errorui from "@/components/ui/Errorui";

type FilterFormData = {
  priceRange: [number, number];
  filterprice: string;
  size: string;
  type: string;
  company: string[];
  shape: string;
  rate: string;
  performance: string;
};

const ProductList = (): ReactElement => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const matches = useMediaQuery("(min-width:736px)");
  const matches2 = useMediaQuery("(min-width:450px)");
  const matches3 = useMediaQuery("(min-width:665px)");

  const AllFilter: FilterFormData = {
    priceRange: [0, 500000000],
    filterprice: "",
    size: "",
    type: "",
    company: [],
    shape: "",
    rate: "",
    performance: "",
  };

  const methods = useForm<FilterFormData>({
    defaultValues: AllFilter,
  });

  const watchedValues = useWatch({
    control: methods.control,
  });

  const [limit, setLimit] = useState(4);
  const { data, isLoading, isError, refetch } = useFetch<ProductType[]>("Product", `${import.meta.env.VITE_API_URL}/products?limit=${limit}&order=price.asc`, { Prefer: "count=exact" });

  const products = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    if (watchedValues.priceRange) {
      const [minPrice, maxPrice] = watchedValues.priceRange;
      filtered = filtered.filter((product) => product.price >= minPrice && product.price <= maxPrice);
    }

    if (watchedValues.filterprice) {
      if (watchedValues.filterprice === "گران ترین") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (watchedValues.filterprice === "ارزان ترین") {
        filtered.sort((a, b) => a.price - b.price);
      }
    }

    if (watchedValues.size) {
      filtered = filtered.filter((product) => product.size === watchedValues.size);
    }

    if (watchedValues.type) {
      filtered = filtered.filter((product) => product.type === watchedValues.type);
    }

    if (watchedValues.company && Array.isArray(watchedValues.company) && watchedValues.company.length > 0) {
      filtered = filtered.filter((product) => watchedValues.company!.includes(product.company));
    }

    if (watchedValues.shape) {
      filtered = filtered.filter((product) => product.feature.shape === watchedValues.shape);
    }

    if (watchedValues.rate) {
      const [minRate, maxRate] = watchedValues.rate.split(" - ").map(Number);
      filtered = filtered.filter((product) => product.rate.rate >= minRate && product.rate.rate <= maxRate);
    }

    if (watchedValues.performance) {
      filtered = filtered.filter((product) => product.rate.performance === watchedValues.performance);
    }

    return filtered;
  }, [products, watchedValues.priceRange, watchedValues.filterprice, watchedValues.size, watchedValues.type, watchedValues.company, watchedValues.shape, watchedValues.rate, watchedValues.performance]);

  const handleToogle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const onSubmit = (products: FilterFormData) => {
    console.log("Filter data:", products);
  };

  const filterArray = [
    {
      name: "قیمت",
      enName: "price",
      children: (
        <div className="mx-auto flex flex-col items-center w-[95%]">
          <div className="w-full flex justify-between items-center pb-2">
            <p>{watchedValues.priceRange?.[1]?.toLocaleString() || "500,000,000"}</p>
            <p>{watchedValues.priceRange?.[0]?.toLocaleString() || "0"}</p>
          </div>
          <Slider
            sx={{
              width: "95%",
              ".css-1xcmt9q-MuiSlider-thumb": {
                backgroundColor: "var(--color-primary)",
              },
              ".css-xvk2i-MuiSlider-track": {
                backgroundColor: "var(--color-primary)",
                borderColor: "var(--color-primary)",
              },
              ".css-1asissc-MuiSlider-valueLabel": {
                display: "none !important",
                all: "unset",
              },
              ".MuiSlider-valueLabelLabel": {
                color: "var(--color-black)",
              },
              ".css-1xcmt9q-MuiSlider-thumb:hover": {
                boxShadow: "0px 0px 0px 8px rgba(0, 0, 0, 0.16)",
              },
              ".css-1xcmt9q-MuiSlider-thumb.Mui-active": {
                boxShadow: "0px 0px 0px 8px rgba(0, 0, 0, 0.16)",
              },
            }}
            getAriaLabel={() => "Minimum distance"}
            value={watchedValues.priceRange || [0, 500000000]}
            onChange={(_, newValue) => methods.setValue("priceRange", newValue as [number, number])}
            valueLabelDisplay="auto"
            disableSwap
            step={10000000}
            min={0}
            max={500000000}
          />
        </div>
      ),
    },
    {
      name: "فیلتر",
      enName: "filterprice",
      children: (
        <>
          {filterpriceArr.map((e, index) => (
            <CustomRadio title={e} name="filterprice" value={e} key={index} />
          ))}
        </>
      ),
    },
    {
      name: "سایز",
      enName: "size",
      children: (
        <>
          {sizeArr.map((e, index) => (
            <CustomRadio title={e} name="size" value={e} key={index} />
          ))}
        </>
      ),
    },
    {
      name: "نوع",
      enName: "type",
      children: (
        <>
          {typeArr.map((e, index) => (
            <CustomRadio title={e} name="type" value={e} key={index} />
          ))}
        </>
      ),
    },
    {
      name: "برند",
      enName: "company",
      children: (
        <>
          {CarpetBrands.map((e, index) => (
            <CustomCheckBox title={e} name="company" value={e} key={index} />
          ))}
        </>
      ),
    },
    {
      name: "شکل",
      enName: "shape",
      children: (
        <>
          {shapeArr.map((e, index) => (
            <CustomRadio title={e} name="shape" value={e} key={index} />
          ))}
        </>
      ),
    },
    {
      name: "امتیاز",
      enName: "rate",
      children: (
        <>
          {rateArr.map((e, index) => (
            <CustomRadio title={e} name="rate" value={e} key={index} />
          ))}
        </>
      ),
    },
    {
      name: "عملکرد",
      enName: "performance",
      children: (
        <>
          {performanceArr.map((e, index) => (
            <CustomRadio title={e} name="performance" value={e} key={index} />
          ))}
        </>
      ),
    },
  ];

  const [openFilterBar, setPpenFilterBar] = useState<boolean>(false);

  const gridClassName = `grid ${matches ? "grid-cols-[repeat(auto-fit,minmax(288px,auto))] flex-1 justify-between" : matches3 ? "grid-cols-[auto_auto] justify-between" : "grid-cols-[auto] justify-center"} w-full items-center gap-10`;

  useEffect(() => {
    if (openFilterBar && openIndex !== null) {
      setOpenIndex(null);
    }
  }, [openFilterBar, openIndex]);

  const childDrawer = () => {
    return (
      <>
        {filterArray.map((e, index) => (
          <div className={`flex flex-col items-center w-full py-2 ${openIndex === index && "border border-neutral5 rounded-2xl"}`} key={index}>
            <button type="button" onClick={() => handleToogle(index)} className={`w-full flex justify-between items-center px-2 ${openIndex === index && "border-b border-b-neutral5 pb-2"}`}>
              <p>{e.name}</p>
              <div>
                <ArrowDown2 className={`size-6 duration-150 stroke-black ${openIndex === index && "rotate-180"}`} />
              </div>
            </button>

            {openIndex === index && <div className="w-[95%] flex flex-col items-start gap-y-4 mt-3 px-2 pb-1">{e.children}</div>}
          </div>
        ))}

        <div className="w-full h-14 mt-auto">
          <CustomButton variant="filled" width="w-full" height="h-14" rounded="rounded-xl" element="button" ratio={"aspect-auto"} ariaLabel="حذف فیلتر" onClick={() => methods.reset(AllFilter)}>
            حذف فیلتر
          </CustomButton>
        </div>
      </>
    );
  };

  return (
    <FormProvider {...methods}>
      <section className={`BodyPadding w-full flex flex-col ${!matches && "items-center"} gap-y-6`}>
        <h1 className="ResponsiveFontSize">لیست محصولات</h1>

        <div className={`w-full flex ${matches ? "flex-row" : "flex-col gap-y-6"} items-start gap-x-20`}>
          {matches ? (
            <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="flex h-[500px] rounded-2xl w-80 flex-col gap-y-2 overflow-y-auto border border-neutral5 bg-white shadow-2xl p-2">{childDrawer()}</div>
            </form>
          ) : (
            <Drawer
              sx={{
                ".css-y7ab46-MuiPaper-root-MuiDrawer-paper": {
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "8px",
                  overflowY: "auto",
                  border: "solid 1px var(--color-neutral5)",
                  borderRight: "none",
                  width: `${matches2 ? "320px" : "280px"}`,
                  borderRadius: "20px 0 0 20px",
                  height: "100%",
                  padding: "8px",
                },
              }}
              anchor="right"
              open={openFilterBar}
              onClose={() => setPpenFilterBar(false)}
            >
              {childDrawer()}
            </Drawer>
          )}

          {!matches && (
            <button type="button" onClick={() => setPpenFilterBar(true)} className={`h-13 border border-neutral5 flex justify-center items-center rounded-xl ${matches3 ? "w-13" : "mx-auto w-72"}`}>
              <Sort className="size-8 stroke-black" />
            </button>
          )}

          {isError ? (
            <Errorui title="خطا در بارگزاری محصولات" onClick={() => refetch()} />
          ) : (
            <>
              {isLoading ? (
                <div className={gridClassName}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <>
                  {filteredProducts && filteredProducts.length > 0 ? (
                    <div className="w-full flex flex-col items-center gap-y-10">
                      <div className={gridClassName}>
                        {filteredProducts.map((product, index) => (
                          <ProductCard {...product} key={index} />
                        ))}
                      </div>

                      {filteredProducts.length > 0 && limit < total && (
                        <CustomButton
                          variant="filled"
                          width="w-fit"
                          height="h-12"
                          rounded="rounded-xl"
                          element="button"
                          ratio={"aspect-auto"}
                          ariaLabel="مشاهده بیشتر"
                          onClick={() => {
                            setLimit((prev) => prev + 4);
                            methods.reset(AllFilter);
                          }}
                        >
                          مشاهده بیشتر
                        </CustomButton>
                      )}
                    </div>
                  ) : (
                    <Errorui title="فرشی با فیلترهای انتخابی یافت نشد" btnLabel="حذف فیلتر" onClick={() => methods.reset(AllFilter)} />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </FormProvider>
  );
};

export default ProductList;
