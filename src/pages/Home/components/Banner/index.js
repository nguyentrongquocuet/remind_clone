import React from "react";
import "./Banner.css";
const Banner = (props) => {
  return (
    <div className="banner__wrapper">
      <div style={props.style.banner} className="banner">
        <div style={props.style.content} className="banner__content">
          <header className="banner__header">{props.header}</header>
          <br />
          <main className="banner__main">{props.main}</main>
        </div>
      </div>
    </div>
  );
};

export default Banner;
