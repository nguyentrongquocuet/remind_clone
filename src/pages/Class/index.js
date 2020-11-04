import React, { Suspense, useEffect, useContext, useState } from "react";
import io from "socket.io-client";
import ClassService from "../../services/ClassService";
import ClassMain from "./Main";
import { Context } from "../../shared/Util/context";
import { useParams, useHistory } from "react-router-dom";

import "./Class.scss";
import Loading from "../../shared/components/Loading";

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
      alert(str);
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
            <Suspense fallback={<div>LOADING SIDEBAR</div>}>
              <ClassSidebar loading={loading} />
            </Suspense>
            <ClassMain loading={loading} started={started} />
            {/* // GETTING STARTED PAGE */}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Class;
