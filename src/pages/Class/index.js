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
import CreateAnnouncement from "./Modal/CreateAnnouncement";
import Modal from "../../shared/Elements/Modal";
import popupSubject from "../../shared/Util/PopupSubject";
import SchedulePreview from "./Modal/SchedulePreview";
const ClassSidebar = React.lazy(() => import("./Sidebar"));
const ClassMain = React.lazy(() => import("./Main"));
const Class = () => {
  const { globalState, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(false);
  const [createAnnouncementMode, toggleAnnouncement] = useState(null);
  const [previewSchedule, setPreviewSchedule] = useState(null);
  const { classId } = useParams();
  const history = useHistory();
  useEffect(() => {
    if (!loading && classId && !globalState.classData[classId]) {
      history.push("/classes");
    }
  }, [classId, loading]);
  useEffect(() => {
    ModalSubject.asObservable().subscribe((data) => {
      switch (data.type) {
        case "PREVIEW_IMAGE":
          setPreviewImage(data.data);
          break;
        case "CREATE_ANNOUNCEMENT":
          toggleAnnouncement((prev) => {
            if (!prev) return { ...data.data };
            else return null;
          });
          break;
        case "PREVIEW_SCHEDULE":
          setPreviewSchedule(data.data.schedules);
        default:
          break;
      }
    });
    ClassService.getClass()
      .then((data) => {
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
        popupSubject.next({
          showTime: 5,
          message: error.response ? error.response.data : "Some errors occured",
          type: "ERROR",
        });
      });
    return () => () => ModalSubject.unsubscribe();
  }, []);
  useEffect(() => {
    const sub = RealTimeService.IOSubject.subscribe((data) => {
      if (data.type === "MESSAGES") {
        const id = data.payload.roomId;
        let cId;
        for (const classs of Object.values(globalState.classData)) {
          if (classs.roomId == id) cId = classs.classId;
        }
        if (
          data.senderId !== globalState.userData.id &&
          (!classId || cId != classId)
        ) {
          dispatch({ type: "SET_UNREAD", id: cId });
        }
      }
    });
    return () => sub.unsubscribe();
  }, [globalState.classData, classId]);
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
                {previewImage && (
                  <ImagePreview
                    onClose={(e) => setPreviewImage(null)}
                    previewObject={previewImage}
                  />
                )}
                {createAnnouncementMode && !loading && (
                  <Modal
                    open={Boolean(createAnnouncementMode)}
                    onClose={(e) => toggleAnnouncement(null)}
                    classNames={{ wrapper: "center", content: "form__modal" }}
                  >
                    <CreateAnnouncement
                      onDone={(message) => {
                        popupSubject.next({
                          showTime: 5,
                          message: message || "You've created a schedule",
                          type: "SUCCESS",
                        });
                        toggleAnnouncement(null);
                      }}
                      {...createAnnouncementMode}
                    />
                  </Modal>
                )}
                {previewSchedule && (
                  <Modal
                    onClose={(e) => setPreviewSchedule(null)}
                    open={Boolean(previewSchedule)}
                    classNames={{
                      wrapper: "schedule-preview-modal center",
                      content: "form__modal",
                    }}
                  >
                    <SchedulePreview schedules={previewSchedule} />
                  </Modal>
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
