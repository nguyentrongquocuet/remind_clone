import React, { Suspense, useEffect, useContext, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import io from "socket.io-client";

import ClassService from "../../services/ClassService";
import Loading from "../../shared/components/Loading";
import Skeleton from "@material-ui/lab/Skeleton";
import { Context } from "../../shared/Util/context";
import "./Class.scss";
import LoadingPage from "../../shared/components/loadingpage/LoadingPage";
const ClassSidebar = React.lazy(() => import("./Sidebar"));
const ClassMain = React.lazy(() => import("./Main"));

const Class = () => {
  const { globalState, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const { classId } = useParams();
  const history = useHistory();
  useEffect(() => {
    const ioC = io.connect("http://localhost:5000");
    ioC.on("hello", (str) => {
      // alert(str);
    });
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
  useEffect(() => {
    if (globalState.classData) {
      if (globalState.classData.length === 0) {
        setStarted(true);
      } else {
        for (const classs of globalState.classData) {
          // if(globalState.)
        }
      }
    }
  }, [globalState.classData]);
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
                  <Skeleton
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
