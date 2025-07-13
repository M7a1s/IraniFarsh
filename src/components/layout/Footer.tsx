import type { ReactElement } from "react";
import eNamad from "@/assets/image/eNamad.webp";
import { Link, useLocation } from "react-router-dom";
import { Social, navFooter } from "@/utils/utils";
import { CreativeCommons } from "iconsax-react";

const Footer = (): ReactElement | null => {
  const location = useLocation();

  if (location.pathname.startsWith("/auth")) {
    return null;
  }
  return (
    <footer className="w-full min-h-96 bg-neutral2 border-t border-neutral6 flex flex-col items-center">
      <div className="flex flex-col-reverse gap-y-10 lg:flex-row justify-between items-start py-6 px-3 xs:px-6 w-full">
        <div className="flex flex-col gap-y-8 lg:gap-y-6 lg:w-[500px]">
          <Link to="/" className="h4 text-primary">
            ایرانی فرش
          </Link>

          <p className="Body-XS text-neutral10 w-full">با ایرانی فرش همراه باشید و از زیبایی و شگفتی های فرش های متنوع و با کیفیت ما لذت ببرید. خرید آسان، تحویل سریع و خدمات پس از فروش حرفه ای، تنها چندی از ویژگی های خرید از ماست. با ایرانی فرش یک خرید آسان و لذت بخش را تجربه کنید.</p>

          <div className="w-full flex justify-between items-center">
            <div className="space-y-4">
              <a href="tel:0212544" className="Body-S text-neutral10 block">
                تلفن پشتیبانی: 0212544
              </a>

              <div className="flex items-center gap-x-6">
                {Social.map((e, index) => (
                  <a key={index} href={e.path} aria-label={e.Label} className="group">
                    <e.icon className="size-7 stroke-neutral10 group-hover:stroke-primary" />
                  </a>
                ))}
              </div>
            </div>

            <Link to="/">
              <img src={eNamad} alt="Logo" />
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-start gap-x-20">
          {navFooter.map((e, index) => (
            <div key={index} className="space-y-4">
              <strong className="h6 text-neutral10 block">{e.title}</strong>

              <ul className="space-y-4">
                {e.links.map((i, idx) => (
                  <li className="block group" key={idx}>
                    <Link className="Body-XS text-neutral9 group-hover:text-primary" to={i.path}>
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <hr className="w-full border border-neutral9" />

      <address className="flex items-center gap-x-2 py-3" aria-label="حقوق وبسایت">
        <CreativeCommons className="size-6 stroke-neutral10" />
        <p className="text-sm not-italic font-semibold text-neutral10">تمامی حقوق این وبسایت متعلق به ایرانی فرش می‌باشد</p>
      </address>
    </footer>
  );
};

export default Footer;
