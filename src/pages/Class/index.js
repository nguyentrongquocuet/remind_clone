import React, {
  Suspense,
  useEffect,
  useContext,
  useState,
  useReducer,
} from "react";
import { useParams, useHistory } from "react-router-dom";
import { Context } from "../../shared/Util/context";
import RealTimeService from "../../services/RealTimeService";
import ClassService from "../../services/ClassService";
import Loading from "../../shared/components/Loading";
import Skeleton from "@material-ui/lab/Skeleton";
import LoadingPage from "../../shared/components/loadingpage/LoadingPage";
import ModalSubject from "../../shared/Util/ModalSubject";
import ImagePreview from "./Modal/ImagePreview";
import Modal from "../../shared/Elements/Modal";
import popupSubject from "../../shared/Util/PopupSubject";
import { Popper } from "@material-ui/core";
import PeopleInfo from "./Modal/PeopleInfo";
import SchedulePreview from "./Modal/SchedulePreview";
import "./Class.scss";
const UserSetting = React.lazy(() => import("shared/components/UserSetting"));
const CreateAnnouncement = React.lazy(() =>
  import("./Modal/CreateAnnouncement")
);
const InviteToClass = React.lazy(() => import("./Modal/InviteToClass"));
const ClassSidebar = React.lazy(() => import("./Sidebar"));
const ClassMain = React.lazy(() => import("./Main"));
const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_PREVIEW_IMAGE":
      return { ...state, previewImage: action.payload };
    case "TOGGLE_CREATE_ANNOUNCEMENT":
      return {
        ...state,
        createAnnouncementMode: state.createAnnouncementMode
          ? null
          : action.payload,
      };
    case "TOGGLE_PREVIEW_SCHEDULE":
      return { ...state, previewSchedule: action.payload };
    case "TOGGLE_INVITE":
      return { ...state, inviteMode: action.payload };
    case "TOGGLE_CONNECT_CHILD":
      return { ...state, connectChildMode: action.payload };
    case "TOGGLE_USER_SETTING":
      return { ...state, settingMode: action.payload };
    default:
      return state;
  }
};

const Class = () => {
  const { globalState, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [modalState, modalDispatch] = useReducer(reducer, {
    previewImage: false,
    createAnnouncementMode: false,
    previewSchedule: false,
    inviteMode: false,
    connectChildMode: false,
    settingMode: false,
  });
  const {
    previewImage,
    createAnnouncementMode,
    previewSchedule,
    inviteMode,
    settingMode,
  } = modalState;
  console.log("CHECK_MODAL", settingMode);
  const { classId } = useParams();
  const history = useHistory();
  useEffect(() => {
    if (!loading && classId && !globalState.classData[classId]) {
      history.push("/classes");
    }
  }, [classId, loading]);
  useEffect(() => {
    ModalSubject.subscribe((data) => {
      switch (data.type) {
        case "PREVIEW_IMAGE":
          modalDispatch({
            type: "TOGGLE_PREVIEW_IMAGE",
            payload: data.data,
          });
          break;
        case "CREATE_ANNOUNCEMENT":
          modalDispatch({
            type: "TOGGLE_CREATE_ANNOUNCEMENT",
            payload: { ...data.data },
          });
          break;
        case "PREVIEW_SCHEDULE":
          modalDispatch({
            type: "TOGGLE_PREVIEW_SCHEDULE",
            payload: data.data.schedules,
          });
          break;
        case "INVITE_PEOPLE":
          modalDispatch({
            type: "TOGGLE_INVITE",
            payload: true,
          });
          break;
        case "CONNECT_CHILD":
          modalDispatch({
            type: "TOGGLE_CONNECT_CHILD",
            payload: true,
          });
          break;
        case "USER_SETTING":
          modalDispatch({
            type: "TOGGLE_USER_SETTING",
            payload: true,
          });
          break;
        case "VIEW_PEOPLE":
          setAnchorEl(data.data.event.currentTarget);
          setUserId(data.data.userId);
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
          type: "WARN",
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
          globalState.classData[cId] &&
          data.senderId !== globalState.userData.id &&
          (!classId || cId != classId)
        ) {
          dispatch({ type: "SET_UNREAD", id: cId });
        }
      }
    });
    return () => sub.unsubscribe();
  }, [globalState.classData, classId]);

  //test poper
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [userId, setUserId] = useState(null);
  return (
    <>
      <Popper
        className="app-popper"
        placement="right-end"
        open={open}
        anchorEl={anchorEl}
      >
        <PeopleInfo
          onClose={(e) => {
            setAnchorEl(null);
          }}
          id={userId}
        />
      </Popper>
      {!loading ? (
        <>
          <div className="main">
            <Suspense
              fallback={<Skeleton variant="rect" className="class__sidebar" />}
            >
              <ClassSidebar loading={loading} />
            </Suspense>

            {settingMode && (
              <Suspense fallback={<Loading />}>
                <Modal
                  open={settingMode}
                  classNames={{
                    wrapper: "center",
                    content: "form__modal invite",
                  }}
                  onClose={(e) => {
                    modalDispatch({
                      type: "TOGGLE_USER_SETTING",
                    });
                  }}
                >
                  <UserSetting />
                </Modal>
              </Suspense>
            )}
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
                    onClose={(e) =>
                      modalDispatch({
                        type: "TOGGLE_PREVIEW_IMAGE",
                      })
                    }
                    previewObject={previewImage}
                  />
                )}

                {createAnnouncementMode && !loading && (
                  <Modal
                    open={Boolean(createAnnouncementMode)}
                    onClose={(e) => {
                      popupSubject.next({
                        type: "CONFIRM",
                        message:
                          "Are you sure you want to discard this announcement?",
                        onConfirm: (e) =>
                          modalDispatch({
                            type: "TOGGLE_CREATE_ANNOUNCEMENT",
                          }),
                        onCancel: null,
                      });
                    }}
                    classNames={{ wrapper: "center", content: "form__modal" }}
                  >
                    <CreateAnnouncement
                      onDone={(message) => {
                        // popupSubject.next({
                        //   showTime: 5,
                        //   message: message || "You've created a schedule",
                        //   type: "SUCCESS",
                        // });
                        modalDispatch({
                          type: "TOGGLE_CREATE_ANNOUNCEMENT",
                        });
                      }}
                      {...createAnnouncementMode}
                    />
                  </Modal>
                )}
                {inviteMode && (
                  <Modal
                    open={Boolean(inviteMode)}
                    onClose={(e) =>
                      modalDispatch({
                        type: "TOGGLE_INVITE",
                      })
                    }
                    closeButton={false}
                    classNames={{
                      wrapper: "center",
                      content: "form__modal invite",
                    }}
                  >
                    <InviteToClass
                      classId={classId}
                      onDone={(e) =>
                        modalDispatch({
                          type: "TOGGLE_INVITE",
                        })
                      }
                      onClose={(e) =>
                        modalDispatch({
                          type: "TOGGLE_INVITE",
                        })
                      }
                    />
                  </Modal>
                )}
                {previewSchedule && (
                  <Modal
                    onClose={(e) =>
                      modalDispatch({
                        type: "TOGGLE_PREVIEW_SCHEDULE",
                      })
                    }
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
                  className="main_main shadow--left getting-started"
                  style={{
                    flexGrow: 1,
                    backgroundImage: `url(${window.location.origin}/getstarted.jpg)`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                >
                  <span className="getstart">GET STARTED</span>
                  {globalState.userData.role === 0 ? (
                    <p>
                      <span
                        onClick={(e) =>
                          ModalSubject.next({ type: "CREATE_CLASS" })
                        }
                      >
                        Create a class
                      </span>{" "}
                      to stay connected with your clubs, teams, organizations,
                      and more!
                    </p>
                  ) : (
                    <p>
                      <span
                        onClick={(e) =>
                          ModalSubject.next({ type: "JOIN_CLASS" })
                        }
                      >
                        Join a class
                      </span>{" "}
                      to stay connected with your clubs, teams, organizations,
                      and more!
                    </p>
                  )}
                  {globalState.userData.role === 2 && (
                    <p>
                      <span
                        onClick={(e) => {
                          ModalSubject.next({ type: "CONNECT_CHILD" });
                        }}
                      >
                        Connect
                      </span>{" "}
                      to connect to your children!
                    </p>
                  )}
                </div>
              </Suspense>
            )}
          </div>
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
};

export default Class;
