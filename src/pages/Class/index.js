import React, { Suspense, useEffect, useContext, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Context } from "../../shared/Util/context";

import ClassService from "../../services/ClassService";
import Loading from "../../shared/components/Loading";
import Skeleton from "@material-ui/lab/Skeleton";
import LoadingPage from "../../shared/components/loadingpage/LoadingPage";
import "./Class.scss";

const ClassSidebar = React.lazy(() => import("./Sidebar"));
const ClassMain = React.lazy(() => import("./Main"));

const Class = () => {
  const { globalState, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const { classId } = useParams();
  useEffect(() => {
    ClassService.getClass()
      .then((data) => {
        console.log("classDAta", data.data);
        dispatch({
          type: "SET_CLASS_DATA",
          payload: data.data,
        });
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        // setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert(error);
      });
  }, []);
  console.log("HOURS", new Date().getHours());
  return (
    <>
      {!loading ? (
        <>
          <div className="main">
            <Suspense
              fallback={<Skeleton variant="rect" className="class__sidebar" />}
            >
              <ClassSidebar loading={loading} />
            </Suspense>
            {classId ? (
              <Suspense
                fallback={
                  <Loading
                    variant="rect"
                    className="main__main skeleton-full"
                  />
                }
              >
                <ClassMain loading={loading} started={started} />
              </Suspense>
            ) : (
              <Suspense
                fallback={<Skeleton variant="rect" className="skeleton-full" />}
              >
                <div
                  className="main_main shadow--left"
                  style={{
                    flexGrow: 1,
                    backgroundImage: `url(${window.location.origin}/getstarted.jpg)`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></div>
              </Suspense>
            )}

            {/* // GETTING STARTED PAGE */}
          </div>
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
};

export default Class;
