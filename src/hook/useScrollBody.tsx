import { useEffect, useState } from "react";

const useBodyScrollLock = () => {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    document.body.style.touchAction = locked ? "none" : "";
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [locked]);

  return { isScrollLocked: locked, setIsScrollLocked: setLocked };
};

export default useBodyScrollLock;
