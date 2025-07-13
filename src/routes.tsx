import React from "react";

const Home = React.lazy(() => import("@/routes/Home"));
const Auth = React.lazy(() => import("@/routes/Auth"));
const Blog = React.lazy(() => import("@/routes/Blog"));
const BlogContent = React.lazy(() => import("@/routes/BlogContent"));
const Cart = React.lazy(() => import("@/routes/Cart"));
const ContactUs = React.lazy(() => import("@/routes/ContactUs"));
const Dashboard = React.lazy(() => import("@/routes/Dashboard"));
const Product = React.lazy(() => import("@/routes/Product"));
const ProductList = React.lazy(() => import("@/routes/ProductList"));

export const getAppRoutes = () => [
  {
    title: "خانه",
    path: "/",
    component: <Home />,
  },
  {
    title: "حساب کاربری",
    path: "/auth/:method",
    component: <Auth />,
  },
  {
    title: "وبلاگ",
    path: "/blog",
    component: <Blog />,
  },
  {
    title: "وبلاگ",
    path: "/blogcontent/:id",
    component: <BlogContent />,
  },
  {
    title: "سبد خرید",
    path: "/cart",
    component: <Cart />,
  },
  {
    title: "تماس با ما",
    path: "/contact-us",
    component: <ContactUs />,
  },
  {
    title: "پنل کاربری",
    path: "/dashboard/:path",
    component: <Dashboard />,
  },
  {
    title: "لیست محصولات",
    path: "/productlist",
    component: <ProductList />,
  },
  {
    title: "لیست محصول",
    path: "/product/:id",
    component: <Product />,
  },
];
