import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../shared/components/Loading";
import "./InfoCard.scss";
const InfoCard = ({
  className,
  icon,
  data,
  text,
  footerText,
  path,
  onClick,
  unavailable,
}) => {
  const history = useHistory();
  const onDirect = useCallback(
    (e) => (path ? history.push("/admin/" + path) : null),
    []
  );
  const clickHandler = onClick || onDirect;
  return data ? (
    <div
      onClick={clickHandler}
      title={text}
      className={`admin-info-card ${className || ""}`}
    >
      <div className="admin-info-card__content">
        <img
          className="admin-info-card__content__icon medium"
          src={`/assets/Admin/${icon}`}
          alt={text}
        />
        <div className="admin-info-card__content__info">
          <span className="admin-info-card__content__info__text">{text}</span>
          <span className="admin-info-card__content__info__amount">
            {data.amount || "(coming soon)"}
          </span>
        </div>
      </div>
      <hr />
      <div className="admin-info-card__footer">
        <p>{footerText}</p>
      </div>
    </div>
  ) : !unavailable ? (
    <Loading />
  ) : null;
};

export default InfoCard;
