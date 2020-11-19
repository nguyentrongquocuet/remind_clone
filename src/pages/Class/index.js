import React, { Suspense, useEffect, useContext, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Context } from "../../shared/Util/context";
import RealTimeService from "../../services/RealTimeService";

import ClassService from "../../services/ClassService";
import Loading from "../../shared/components/Loading";
import Skeleton from "@material-ui/lab/Skeleton";
import LoadingPage from "../../shared/components/loadingpage/LoadingPage";
import ModalSubject from "../../shared/Util/ModalSubject";
import "./Class.scss";
import ImagePreview from "./Modal/ImagePreview";
const ClassSidebar = React.lazy(() => import("./Sidebar"));
const ClassMain = React.lazy(() => import("./Main"));
const Class = () => {
  const { globalState, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [previewObject, setPreviewObject] = useState(false);
  const { classId } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!loading && classId && !globalState.classData[classId]) {
      history.push("/classes");
    }
  }, [classId, loading]);
  useEffect(() => {
    ModalSubject.asObservable().subscribe((data) => {
      setPreviewObject(data);
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
    const sub = RealTimeService.IOSubject.subscribe((data) => {
      const id = data.roomId;
      let cId;
      for (const classs of Object.values(globalState.classData)) {
        console.log("check-classData", classs);
        if (classs.roomId == id) cId = classs.classId;
      }
      if (!classId || cId != classId) {
        console.log("check-classId", classId, cId);
        dispatch({ type: "SET_UNREAD", id: cId });
      }
    });
    return () => sub.unsubscribe();
  }, [globalState.classData, classId]);
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
                <ClassMain loading={loading} />
                {previewObject && (
                  <ImagePreview
                    onClose={(e) => setPreviewObject(null)}
                    previewObject={previewObject}
                  />
                )}
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
