import React from "react";
import Loading from "../Loading";

import "./Sidebar.scss";

const Sidebar = ({ isLoading, header, parts, classNames }) => {
  // const [isLoading, setIsLoading] = useState(true);
  // setTimeout(() => setIsLoading(false), 5000);
  return (
    <aside className={`${classNames ? classNames.wrapper : ""}`}>
      <header className={`${classNames ? classNames.header : ""} `}>
        {header}
      </header>
      <main className={`sidebar__main__scroll ${isLoading ? "loading" : ""}`}>
        {isLoading ? <Loading /> : parts}
      </main>
    </aside>
  );
};

export default Sidebar;
