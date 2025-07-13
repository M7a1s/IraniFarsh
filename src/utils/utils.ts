import { Home, Box, Blogger, Call, Instagram, Send2 } from "iconsax-react";

export const navHeader = [
  {
    path: "/",
    label: "صفحه اصلی",
    icon: Home,
  },
  {
    path: "/productlist",
    label: "محصولات",
    icon: Box,
  },
  {
    path: "/blog",
    label: "وبلاگ",
    icon: Blogger,
  },
  {
    path: "/contact-us",
    label: "تماس با ما",
    icon: Call,
  },
] as const;

export const Social = [
  {
    icon: Send2,
    Label: "تلگرام",
    path: "https://web.telegram.org",
  },
  {
    icon: Instagram,
    Label: "اینستاگرام",
    path: "https://www.instagram.com/",
  },
] as const;

export const navFooter = [
  {
    title: "فرش ها",
    links: [
      {
        label: "فرش های دست بافت",
        path: "",
      },
      {
        label: "فرش های ماشینی",
        path: "",
      },
      {
        label: "فرش های لوکس",
        path: "",
      },
    ],
  },
  {
    title: "دسترسی سریع",
    links: navHeader,
  },
] as const;

export const isPersian = (text: string) => {
  return /[\u0600-\u06FF]/.test(text);
};

export const setDocumentTitle = (title?: string) => {
  if (title) {
    document.title = `ایرانی فرش - ${title}`;
  } else {
    document.title = "ایرانی فرش";
  }
};
