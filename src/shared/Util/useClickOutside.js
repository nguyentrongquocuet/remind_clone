import { useEffect } from "react";

const useClickOutside = (ref, callback, ...args) => {
  const handle = (e) => {
    console.log("CLICK", e.target, ref);
    if (
      ref.current &&
      document.contains(ref.current) &&
      !ref.current.contains(e.target)
    ) {
      // e.stopPropagation();
      console.log("CONTAIN", e.target);
      callback(...args);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  });
};

export default useClickOutside;
