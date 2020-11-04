import { useEffect, useRef, useState } from "react";

const useLazy = (handler, options) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { ...options }
    );
    if (ref.current) io.observe(ref.current);
    return () => ref.current && io.unobserve(ref.current);
  }, [ref, visible]);

  return [ref, visible];
};

export default useLazy;
