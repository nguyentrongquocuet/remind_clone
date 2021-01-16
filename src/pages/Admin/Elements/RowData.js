import { Avatar } from "@material-ui/core";
import moment from "moment";
import React, { useMemo } from "react";
import ROLE from "../../../shared/Util/ROLE";
import "./RowData.scss";
const imageField = ["avatar", "image"];
const roleField = ["role"];
const timeField = ["createAt", "lastUpdate"];
const RowData = ({ classData, userData, data, actions, onAction }) => {
  const mData = useMemo(() => data, []);
  // const mData = data;

  if (userData)
    return (
      <tr className="row-data">
        {Object.keys(mData).map((k, i) => {
          return (
            <td key={k + i} className="row-data__cell">
              {imageField.includes(k) ? (
                <Avatar
                  src={mData[k]}
                  alt={mData.name || mData.firstName + mData.lastName}
                  className={`row-data__cell__${k} small`}
                />
              ) : (
                <span
                  className={`row-data__cell__text ${k} break-word-ellipsis`}
                >
                  {timeField.includes(k)
                    ? moment(mData[k]).format("YYYY MM DD")
                    : roleField.includes(k)
                    ? ROLE[mData[k]] || "Unset"
                    : mData[k]}
                </span>
              )}
            </td>
          );
        })}
        {actions && (
          <td className="row-data__cell action">
            {Object.entries(actions).map((entry, index) => {
              const { icon, name, action } = entry[1];
              return (
                <span
                  className="row-data__cell action"
                  alt={name}
                  title={name}
                  user-action={action}
                  user-id={data.id}
                  onClick={onAction}
                  key={index + entry[0]}
                >
                  {icon}
                </span>
              );
            })}
          </td>
        )}
      </tr>
    );
  return (
    <tr className="row-data">
      {Object.keys(mData).map((k, i) => {
        return (
          <td key={k + i} className="row-data__cell">
            {imageField.includes(k) ? (
              <Avatar
                src={mData[k]}
                alt={mData.name || mData.firstName + mData.lastName}
                className={`row-data__cell__${k} small`}
              />
            ) : (
              <span className={`row-data__cell__text ${k} break-word-ellipsis`}>
                {timeField.includes(k)
                  ? moment(mData[k]).format("YYYY MM DD")
                  : roleField.includes(k)
                  ? ROLE[mData[k]] || "Unset"
                  : mData[k]}
              </span>
            )}
          </td>
        );
      })}
      {actions && (
        <td className="row-data__cell action">
          {Object.entries(actions).map((entry, index) => {
            const { icon, name, action } = entry[1];
            return (
              <span
                className="row-data__cell action"
                alt={name}
                title={name}
                class-action={action}
                class-id={data.classId}
                onClick={onAction}
                key={index + entry[0]}
              >
                {icon}
              </span>
            );
          })}
        </td>
      )}
    </tr>
  );
};

export default RowData;
