import React, { useMemo } from "react";
import HeadData from "./HeadData";
import RowData from "./RowData";
import "./Table.scss";
const Table = ({
  classData,
  userData,
  data,
  actions,
  onAction,
  onSort = () => {},
  sortData = { sortBy: null },
}) => {
  const headers = useMemo(() => {
    if (data && data[0]) return Object.keys(data[0]);
    return [];
  }, []);
  return (
    <table className="table-data">
      <tbody>
        <HeadData
          onSort={onSort}
          headers={headers}
          actions={Boolean(actions)}
          sortData={sortData}
        />
        {data.map((d, i) => {
          return (
            <RowData
              onAction={onAction}
              actions={actions}
              key={`key ${d.classId} ${d.createAt}`}
              classData={classData}
              userData={userData}
              data={d}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
