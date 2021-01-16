import React, { useMemo } from "react";
import "./HeadData.scss";
const HeadData = ({ headers, actions, onSort, sortData }) => {
  const heads = useMemo(() => {
    return headers;
  }, [headers]);

  return (
    <tr className="row-data head">
      {heads &&
        heads.map((h, i) => {
          return (
            <th
              user-sort-field={h}
              key={`head${i}`}
              onClick={onSort}
              className={`row-data__head ${h} ${
                sortData.sortBy === h
                  ? sortData.desc
                    ? "sorting desc"
                    : "sorting"
                  : ""
              }`}
            >
              <span className="row-data__head__text">
                {h.split(/([A-Z]\w+)/g).join(" ")}
              </span>
            </th>
          );
        })}
      {actions && <th className={`row-data__head action`}>Actions</th>}
    </tr>
  );
};

export default HeadData;
