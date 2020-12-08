import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import "./InfoCard.scss";
const InfoCard = ({
  className,
  icon,
  amount,
  text,
  footerText,
  path,
  onClick,
}) => {
  const history = useHistory();
  const onDirect = useCallback(
    (e) => (path ? history.push("/admin/" + path) : null),
    []
  );
  const clickHandler = onClick || onDirect;
  return (
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
            {amount}
          </span>
        </div>
      </div>
      <hr />
      <div className="admin-info-card__footer">
        <p>{footerText}</p>
      </div>
    </div>
  );
};

export default InfoCard;
