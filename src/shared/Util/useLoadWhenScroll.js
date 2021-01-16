import { useRef, useCallback, useEffect } from "react";
const useLoadWhenScroll = (cb = () => {}, position = 1) => {
  const ref = useRef();
  const checkOnScroll = useCallback(
    (e) => {
      if (
        e.currentTarget.scrollHeight * position ===
        e.currentTarget.scrollTop + e.currentTarget.clientHeight
      ) {
        cb();
      }
      // console.dir(e.currentTarget);
    },
    [cb]
  );
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("scroll", checkOnScroll);
    }
    return () => {
      ref.current && ref.current.removeEventListener("scroll", checkOnScroll);
    };
  }, [ref.current, checkOnScroll]);

  return ref;
};
export default useLoadWhenScroll;
