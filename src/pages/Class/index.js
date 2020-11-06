import React, { Suspense, useEffect, useContext, useState } from "react";
import io from "socket.io-client";
import ClassService from "../../services/ClassService";
import ClassMain from "./Main";
import { Context } from "../../shared/Util/context";
import { useParams, useHistory } from "react-router-dom";

import Loading from "../../shared/components/Loading";
import Skeleton from "@material-ui/lab/Skeleton";
import "./Class.scss";
const ClassSidebar = React.lazy(() => import("./Sidebar"));

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
    ClassService.getClass(globalState.token)
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
              <ClassMain loading={loading} started={started} />
            ) : (
              <div
                className="main_main shadow--left"
                style={{
                  flexGrow: 1,
                  backgroundImage: `url(${window.location.origin}/getstarted.jpg)`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                No Id
              </div>
            )}

            {/* // GETTING STARTED PAGE */}
          </div>
        </>
      ) : (
        <Skeleton variant="rect" />
      )}
    </>
  );
};

export default Class;
