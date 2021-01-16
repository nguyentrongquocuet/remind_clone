import React, { useReducer } from "react";
import TextField from "../../../shared/Elements/TextField";
import Button from "../../../shared/Elements/Button";
import "./Filter.scss";
import ROLE from "../../../shared/Util/ROLE";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, ...action.payload };
    case "CLEAR_FILTER":
      return { nameQuery: state.nameQuery };
    case "SET_NAME_QUERY":
      return { ...state, nameQuery: action.payload };
  }
};

// filterField: {
//   field: string,
//   conditions: array
// }

const Filter = ({ onFilter, filterField }) => {
  const [filterData, setFilterData] = useReducer(reducer, {
    filterField: null,
    filterCon: null,
    nameQuery: null,
  });
  const submitHandler = (e) => {
    e.preventDefault();
    onFilter({
      ...filterData,
      nameQuery: e.target.elements.searchquery.value.trim() || null,
    });

    setFilterData({
      type: "SET_NAME_QUERY",
      payload: e.target.elements.searchquery.value || null,
    });
  };

  const resetHandler = (e) => {
    onFilter({});
  };
  return (
    <form
      className="filter-form"
      onSubmit={submitHandler}
      onReset={resetHandler}
    >
      <div className="actions">
        <TextField name="searchquery" placeholder="Search" />
        {filterField && (
          <div
            className="filter"
            onClick={(e) => {
              document.getElementById("check-filter").click();
            }}
          >
            <p>
              {filterData.filterField
                ? ROLE[filterData.filterCon] + "s"
                : "Select Role"}
            </p>
            <input
              type="checkbox"
              style={{ display: "none" }}
              id="check-filter"
            />
            <div className="filter-roles">
              <span
                onClick={(e) => {
                  setFilterData({
                    type: "CLEAR_FILTER",
                    payload: {
                      filterField: filterField,
                      filterCon: 0,
                    },
                  });
                }}
              >
                All
              </span>
              {filterField.conditions.map((c, i) => {
                return (
                  <span
                    key={"field " + i}
                    onClick={(e) => {
                      setFilterData({
                        type: "SET_FILTER",
                        payload: {
                          filterField: filterField.field,
                          filterCon: c.condition,
                        },
                      });
                    }}
                  >
                    {c.name}
                  </span>
                );
              })}
              {/* <span
                onClick={(e) => {
                  setFilterData({
                    type: "CLEAR_FILTER",
                    payload: {
                      filterField: filterField,
                      filterCon: 0,
                    },
                  });
                }}
              >
                Everyone
              </span>
              <span
                onClick={(e) => {
                  setFilterData({
                    type: "SET_FILTER",
                    payload: {
                      filterField: "role",
                      filterCon: 0,
                    },
                  });
                }}
              >
                Teachers
              </span>
              <span
                onClick={(e) => {
                  setFilterData({
                    type: "SET_FILTER",
                    payload: {
                      filterField: "role",
                      filterCon: 1,
                    },
                  });
                }}
              >
                Students
              </span>
              <span
                onClick={(e) => {
                  setFilterData({
                    type: "SET_FILTER",
                    payload: {
                      filterField: "role",
                      filterCon: 2,
                    },
                  });
                }}
              >
                Parents
              </span> */}
            </div>
          </div>
        )}

        <Button size="small" type="submit" className="filter-form--submit">
          Apply
        </Button>
        <Button
          size="small"
          type="reset"
          style={{ color: "var(--danger)" }}
          className="filter-form--submit reset"
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

export default Filter;
