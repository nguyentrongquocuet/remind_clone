import React, { useContext, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

import Header from "../../shared/components/Header";
import Banner from "./components/Banner";
import Content from "./components/Content";
import Button from "../../shared/Elements/Button";
import { Context } from "../../shared/Util/context";
import "./Home.css";
import Modal from "../../shared/Elements/Modal";
import SignUpForm from "../../shared/components/SignUpForm";
const Home = () => {
  let location = useLocation();
  const setMode = () => setSignUp((prev) => !prev);
  const { setSignUp, isInSignUpMode } = useContext(Context);
  useEffect(() => {
    if (location.search === "?signup=true") {
      setMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const signUpSuccessHandler = () => {
    setMode();
  };
  return (
    <div className="home__wrapper">
      <Modal
        className={{ wrapper: "authform center" }}
        style={{ wrapper: { position: "absolute" } }}
        open={isInSignUpMode}
        onClose={(e, r) => {
          setMode();
        }}
      >
        <SignUpForm
          onSuccess={() => {
            signUpSuccessHandler();
          }}
          header={<h1 className="form__header">SignUp</h1>}
        />
      </Modal>

      <div className="home">
        <Header />
        <Banner
          style={{
            banner: {
              backgroundImage: `url(${window.location.origin}/banner.jpg)`,
              backgroundOrigin: "border-box",
              backgroundPosition: "center bottom",
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
                className="banner__signup"
                style={{ color: "black", padding: "1em 6em" }}
                onClick={setMode}
                default
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
