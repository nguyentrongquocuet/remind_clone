import React, { useContext, useEffect, Suspense } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Context } from "../../shared/Util/context";
import Loading from "../../shared/components/Loading";
import Header from "../../shared/components/Header";
import Banner from "./components/Banner";
import Content from "./components/Content";
import Button from "../../shared/Elements/Button";
import UserService from "../../services/UserService";
import "./Home.scss";
import PopupSubject from "../../shared/Util/PopupSubject";
const Modal = React.lazy(() => import("../../shared/Elements/Modal"));

const SignUpForm = React.lazy(() =>
  import("../../shared/components/SignUpForm")
);

const Home = () => {
  let location = useLocation();
  const { dispatch, globalState } = useContext(Context);
  useEffect(() => {
    if (location.search === "?signup=true") {
      dispatch({ type: "TOGGLE_SIGNUP" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {}, []);

  const signUpSuccessHandler = async (data) => {
    // setMode();
    console.log(data);
    try {
      const authData = await UserService.login({
        email: data.email,
        password: data.password,
      });
      dispatch({
        1: {
          type: "SET_TOKEN",
          payload: authData.data.token,
        },
        2: {
          type: "SET_USER_DATA",
          payload: authData.data.userData,
        },
        3: {
          type: "LOGIN_SUCCESS",
        },
      });
      // login(authData.data);
      // history.push("/classes/1");
    } catch (error) {
      if (error.response) {
        PopupSubject.next({
          type: "ERROR",
          message: error.response ? error.response.data : "Some errors occured",
          showTime: 5,
        });
      }
    }
  };
  return (
    <div className="home__wrapper">
      <Suspense fallback={<Loading />}>
        <Modal
          classNames={{ wrapper: "center", content: "form__modal" }}
          open={globalState.toggleSignup || false}
          onClose={(e, r) => {
            dispatch({ type: "TOGGLE_SIGNUP" });
          }}
        >
          <div className="signupform__wrapper">
            <Suspense fallback={<Loading />}>
              <SignUpForm
                onSuccess={(data) => {
                  signUpSuccessHandler(data);
                }}
                header={<h1 className="form__header">SignUp</h1>}
              />
            </Suspense>
          </div>
        </Modal>
      </Suspense>
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
                onClick={() => dispatch({ type: "TOGGLE_SIGNUP" })}
                color="primary"
              >
                Signup
              </Button>
            </React.Fragment>
          }
        />
      </div>
    </div>
  );
};

export default Home;
