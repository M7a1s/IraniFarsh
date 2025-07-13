import { useContext, useEffect, useMemo, useState, type ReactElement } from "react";
import useFetch from "@/hook/useFetch";
import { AuthContext } from "@/context/AuthProvider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import type { ProductType } from "@/utils/type";
import Spinner from "@/components/ui/Spinner";
import Errorui from "@/components/ui/Errorui";

type OrderType = {
  address: string;
  id: string;
  postalCode: string;
  productCount: number;
  productId: string;
  userId: string;
};

const DashboardOrder = (): ReactElement => {
  const Auth = useContext(AuthContext);

  const { data, isLoading, isError, refetch } = useFetch("getOrders", `${import.meta.env.VITE_API_URL}/orders?userId=eq.${Auth?.userData?.id}`);
  const Orders: OrderType[] = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const [productsUrl, setProductsUrl] = useState<string | null>(null);

  useEffect(() => {
    if (Orders && Orders.length > 0) {
      const ids = Orders.map((o) => o.productId).join(",");
      setProductsUrl(`${import.meta.env.VITE_API_URL}/products?id=in.(${ids})`);
    }
  }, [Orders]);

  const { data: dataProducts, isLoading: loadingProducts, isError: errorProducts, refetch: dataProductsRefetch } = useFetch<ProductType[] | null>("getProducts", productsUrl);

  const Products: ProductType[] = Array.isArray(dataProducts?.data) ? dataProducts.data : [];

  const findProductName = (id: string) => Products.find((p) => p.id === id)?.title || "نامشخص";

  if (isLoading || loadingProducts) {
    return <Spinner />;
  }

  if (isError || (Orders && Orders.length > 0 && errorProducts)) {
    return <Errorui title="خطا در بارگزاری محصولات" onClick={() => (isError ? refetch() : dataProductsRefetch())} />;
  }

  return (
    <>
      {Orders && Orders.length > 0 ? (
        <TableContainer component={Paper} sx={{ boxShadow: "none", border: "solid 1px var(--color-neutral5)", borderRadius: "8px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="Orders table">
            <TableHead>
              <TableRow>
                <TableCell align="right">نام محصول</TableCell>
                <TableCell align="right">ادرس</TableCell>
                <TableCell align="right">کد پستی</TableCell>
                <TableCell align="right">تعداد</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Orders.map((order) => (
                <TableRow key={order.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell align="right">{findProductName(order.productId)}</TableCell>
                  <TableCell align="right">{order.address}</TableCell>
                  <TableCell align="right">{order.postalCode}</TableCell>
                  <TableCell align="right">{order.productCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p className="text-neutral10">شما هیچ سفارشی ندارید</p>
      )}
    </>
  );
};

export default DashboardOrder;
