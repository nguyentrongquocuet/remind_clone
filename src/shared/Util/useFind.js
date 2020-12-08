import { useCallback, useEffect, useState } from "react";

const useFind = (query, flag = "i", timeout = 1000) => {
  const [q, setQ] = useState(query);
  const [reg, setReg] = useState(/.+/);
  useEffect(() => {
    const to = setTimeout(() => {
      const reg = new RegExp(q, flag);
      console.log(reg);
      setReg(reg);
    }, timeout);
    return () => clearTimeout(to);
  }, [q]);

  const setQuery = useCallback((e) => setQ(e.target.value), []);
  return [setQuery, reg];
};
export default useFind;
