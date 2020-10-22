import React from "react";
import Header from "../../shared/components/Header";
import Banner from "./components/Banner";
import Content from "./components/Content";
import Button from "../../shared/Elements/Button";
import "./Home.css";
const Home = () => {
  return (
    <div className="home__wrapper">
      <div className="home">
        <Header />
        <Banner
          style={{
            banner: {
              backgroundImage: `url(${window.location.origin}/banner.jpg)`,
              backgroundOrigin: "border-box",
              backgroundPosition: "bottom left",
              backgroundSize: "cover",
            },
          }}
          header={
            <p className="banner__slogan">
              Reach students and parents <span>where they are</span>
            </p>
          }
          main={
            <React.Fragment>
              <p className="banner__content__slogan">
                Communication for the school, home, and everywhere in between.
              </p>
              <br />
              <Button
                to="/signup"
                className="banner__signup"
                style={{ padding: "1em 6em" }}
              >
                Signup
              </Button>
            </React.Fragment>
          }
        ></Banner>
        <Content />
      </div>
    </div>
  );
};

export default Home;
