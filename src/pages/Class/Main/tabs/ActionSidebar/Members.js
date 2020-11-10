import React, { useCallback, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import "./Members.scss";
const sort = (field = "id", desc = -1) => {
  if (desc === 0) desc = 1;
  return (a, b) => {
    if (a[field] > b[field]) return -desc * 1;
    if (a[field] < b[field]) return -desc * -1;
    return 0;
  };
};
const Members = (props) => {
  const [sortOptions, setSortOptions] = useState({ field: "name", desc: -1 });
  const setSortField = useCallback((field) => {
    if (field == sortOptions.field) {
      setSortOptions((prev) => {
        return { ...prev, desc: 0 - prev.desc };
      });
    } else {
      setSortOptions({ field: field, desc: -1 });
    }
  });
  return (
    <div>
      <Table className="group__members__table sticky">
        <TableHead>
          <TableRow>
            <TableCell onClick={() => setSortField("name")}>
              Name{" "}
              {sortOptions.field == "name" && (
                <ChevronLeftIcon
                  className={`chevron ${sortOptions.desc > 0 ? "up" : "down"}`}
                />
              )}
            </TableCell>
            <TableCell onClick={() => setSortField("joinAt")} align="center">
              Date joined{" "}
              {sortOptions.field == "joinAt" && (
                <ChevronLeftIcon
                  className={`chevron ${sortOptions.desc > 0 ? "up" : "down"}`}
                />
              )}
            </TableCell>
            <TableCell onClick={() => setSortField("role")} align="center">
              Role
              {sortOptions.field == "role" && (
                <ChevronLeftIcon
                  className={`chevron ${sortOptions.desc > 0 ? "up" : "down"}`}
                />
              )}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <TableContainer component={Paper}>
        <Table className="group__members__table" aria-label="caption table">
          <TableBody>
            {Object.values(props.people)
              .sort(sort(sortOptions.field, sortOptions.desc))
              .map((member) => (
                <TableRow key={member.id}>
                  <TableCell align="left">{member.name}</TableCell>
                  <TableCell align="left">{member.joinAt}</TableCell>
                  <TableCell align="left">
                    {member.role == 0
                      ? "Student"
                      : member.role == 1
                      ? "Teacher"
                      : "Parent"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Members;
