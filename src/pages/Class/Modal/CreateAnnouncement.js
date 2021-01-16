import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import moment from "moment";
import { Context } from "../../../shared/Util/context";
import TextField from "../../../shared/Elements/TextField";
import { Avatar } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import Checkbox from "@material-ui/core/Checkbox";
import CancelIcon from "@material-ui/icons/Cancel";

import Popper from "../../../shared/Elements/Popper";
import Button from "../../../shared/Elements/Button";
import AttachFilePreview from "../../../shared/Elements/AttachFilePreview";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import MessageService from "../../../services/MessageService";
import DateTimePicker from "../../../shared/Elements/DateTimePicker";
import PopupSubject from "../../../shared/Util/PopupSubject";
import { ResourceService } from "services/ResourceService";
import Loading from "shared/components/Loading";
import useLoadWhenScroll from "shared/Util/useLoadWhenScroll";
import "./CreateAnnouncement.scss";

const dataReducer = (data, action) => {
  switch (action.type) {
    case "SET_DRIVE_DATA":
      return {
        ...data,
        drive: {
          ...action.payload,
          files: [...data.drive.files, ...action.payload.files],
        },
        fetching: false,
        current: "drive",
      };
    case "SET_CLASSROOM_DATA":
      return {
        ...data,
        classroom: {
          ...action.payload,
          courses: [...data.classroom.courses, ...action.payload.courses],
        },
        fetching: false,
        current: "classroom",
      };
    case "SET_FETCHING":
      return { ...data, fetching: true };
    case "CLEAR_DATA_ONLY":
      return {
        ...data,
        drive: { files: [] },
        classroom: { courses: [] },
        fetching: true,
      };
    case "CLEAR_DATA":
      return {
        drive: { files: [] },
        classroom: { courses: [] },
        fetching: true,
      };
  }
};

const OtherResource = ({ onAppend = () => {}, props }) => {
  const triggerRef = useRef();
  // const scrollRef = useRef();
  const [resourceData, setResourceData] = useReducer(dataReducer, {
    drive: { files: [] },
    classroom: { courses: [] },
    fetching: true,
  });
  const loadMoreResource = useCallback(() => {
    if (!resourceData.fetching && resourceData.current) {
      if (resourceData[resourceData.current].nextPageToken) {
        console.log("loadagain");
        console.log("loading resource", resourceData);
        setResourceData({
          type: "SET_FETCHING",
        });
        getResources[resourceData.current](
          resourceData[resourceData.current].nextPageToken
        );
      }
    }
  }, [resourceData]);
  const scrollRef = useLoadWhenScroll(loadMoreResource, 1);

  const toggleSlideLeft = (e) => {
    e.preventDefault();
    if (triggerRef.current) {
      triggerRef.current.classList.toggle("slide-left");
      if (triggerRef.current.classList.contains("slide-left")) {
        getResources[e.currentTarget.dataset.resource] &&
          getResources[e.currentTarget.dataset.resource]();
      } else {
        setResourceData({
          type: "CLEAR_DATA",
        });
      }
    }
  };

  // useEffect(() => {
  //   if (!resourceData.fetching && scrollRef.current) {
  //     scrollRef.current.addEventListener("scroll", checkOnScroll);
  //   }
  //   return () => {
  //     scrollRef.current &&
  //       scrollRef.current.removeEventListener("scroll", checkOnScroll);
  //   };
  // }, [resourceData]);

  // const checkOnScroll = (e) => {
  //   if (
  //     e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
  //     e.currentTarget.clientHeight
  //   )
  //     loadMoreResource();
  //   // console.dir(e.currentTarget);
  // };
  const getResources = {
    drive: async (nextPageToken, query, resetData = false) => {
      try {
        resetData &&
          setResourceData({
            type: "CLEAR_DATA_ONLY",
          });
        const { data } = await ResourceService.getDriveFiles(
          20,
          nextPageToken,
          query
        );
        console.log(data);
        setResourceData({ type: "SET_DRIVE_DATA", payload: data });
      } catch (error) {
        setResourceData({
          type: "CLEAR_DATA",
        });
      }
    },
    classroom: async (nextPageToken) => {
      try {
        const { data } = await ResourceService.getClassroomCourses(
          20,
          nextPageToken
        );
        console.log(data);
        setResourceData({ type: "SET_CLASSROOM_DATA", payload: data });
      } catch (error) {
        setResourceData({
          type: "CLEAR_DATA",
        });
      }
    },
  };

  const submitSearchResource = (e) => {
    e.preventDefault();
    const query = e.currentTarget.elements.query.value;
    getResources[resourceData.current](null, query, true);
  };

  const resourceView = (
    <>
      <div className="fetched-resources">
        <header>
          <form
            onSubmit={submitSearchResource}
            className="flex f-row self-f-v-c"
          >
            <TextField name="query" />
            <button style={{ all: "unset" }} type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </form>
        </header>
        <main ref={scrollRef}>
          {resourceData.drive &&
            resourceData.drive.files &&
            resourceData.drive.files.map((file) => {
              return (
                <div key={file.id} className="fetched-resource">
                  <img
                    className={file.hasThumbnail ? "small" : "tiny"}
                    src={file.hasThumbnail ? file.thumbnailLink : file.iconLink}
                    alt={file.name}
                    data-image={
                      file.hasThumbnail ? file.thumbnailLink : file.iconLink
                    }
                  />
                  <div
                    onClick={() => onAppend(file.webViewLink)}
                    className="resource-info"
                  >
                    <p>{file.name}</p>
                    <p>
                      {moment(file.modifiedTime).format("HH:MM YYYY/MM/DD")}
                    </p>
                  </div>
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-up-right-square"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
                      />
                    </svg>
                  </a>
                </div>
              );
            })}
          {resourceData.classroom &&
            resourceData.classroom.courses &&
            resourceData.classroom.courses.map((course) => {
              return (
                <div
                  title={
                    course.section || course.descriptionHeading || course.name
                  }
                  key={course.id}
                  className="fetched-resource"
                >
                  <img
                    className={course.hasThumbnail ? "small" : "tiny"}
                    src={"https://ssl.gstatic.com/classroom/favicon.png"}
                    alt={course.name}
                    data-image={"https://ssl.gstatic.com/classroom/favicon.png"}
                  />
                  <div
                    onClick={() => onAppend(course.inviteLink)}
                    className="resource-info"
                  >
                    <p>{course.name}</p>
                    <p>
                      {moment(course.modifiedTime).format("HH:MM YYYY/MM/DD")}
                    </p>
                  </div>
                  <a
                    href={course.inviteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-up-right-square"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
                      />
                    </svg>
                  </a>
                </div>
              );
            })}
          {/* <Loading className="small" /> */}
        </main>
        <div className="flex f-row self-f-v-c">
          <svg
            onClick={toggleSlideLeft}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-left-short"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
            />
          </svg>
          {resourceData.fetching && <Loading className="small" />}
        </div>
      </div>
    </>
  );

  return (
    <div className="orther-resource">
      <header>
        <h3>Other Resource</h3>
      </header>
      <main ref={triggerRef}>
        <div className="available-resource">
          <div
            onClick={toggleSlideLeft}
            data-resource="drive"
            className="from-drive"
          >
            <img className="small" src="/Assets/google-drive.svg" alt="Drive" />
            <span>Drive</span>
          </div>
          <div
            onClick={toggleSlideLeft}
            data-resource="classroom"
            className="from-classroom"
          >
            <img
              className="small"
              src="/Assets/google-classroom.svg"
              alt="Classroom"
            />
            <span>Classrom</span>
          </div>
        </div>
        {resourceView}
      </main>
    </div>
  );
};

const preventDefaults = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const objectFilter = (obj) => {
  const b = { ...obj };
  for (let c in b) {
    if (b[c] === undefined || b[c] === null) delete b[c];
  }
  return b;
};
const reducer = (state, action) => {
  let out = { ...state };
  switch (action.type) {
    case "TOGGLE_CHOOSING":
      if (state.onChoosing) return { ...state, onChoosing: null };
      out = { ...state, onChoosing: action.payload.classId };
      break;
    case "CHOOSE_TYPE":
      out = {
        ...state,
        onChoosing: null,
        classes: {
          ...state.classes,
          [action.payload.classId]: action.payload.type,
        },
        dirty: true,
      };
      break;
    case "NORMAL_CHOOSING":
      if (state.classes[action.payload.classId]) {
        out = {
          ...state,
          classes: { ...state.classes, [action.payload.classId]: null },
          dirty: true,
        };
      } else {
        out = {
          ...state,
          classes: {
            ...state.classes,
            [action.payload.classId]: action.payload.type,
          },
          dirty: true,
        };
      }
      break;
    case "SET_CONTENT":
      out = { ...state, content: action.payload.text, dirty: true };
      break;
    case "APPEND_CONTENT":
      out = {
        ...state,
        content: state.content + action.payload.text,
        dirty: true,
      };
      break;
    case "SET_FILE":
      out = { ...state, file: action.payload.file, dirty: true };
      break;
    case "TOGGLE_SCHEDULE":
      out = { ...state, schedule: !state.schedule };
      break;
    case "SET_SCHEDULE_TIME":
      const time = new Date(action.payload.time);
      time.setSeconds(0);
      const timeStr = time.toUTCString();
      out = {
        ...state,
        scheduleTime: timeStr,
        dirty: true,
      };
      break;
    default:
      break;
  }

  return { ...out, classes: { ...objectFilter(out.classes) } };
};
const CreateAnnouncement = ({
  initialClass,
  initialValues,
  onDone,
  mode = "create",
}) => {
  const initialValuesMemorized = useMemo(() => initialValues, [initialValues]);
  const { globalState } = useContext(Context);
  const [selectedClass, dispatch] = useReducer(reducer, {
    classes:
      mode !== "create"
        ? { ...initialValuesMemorized.classes }
        : initialClass
        ? {
            [initialClass]: "all",
          }
        : {},
    onChoosing: null,
    content:
      mode !== "create"
        ? initialValuesMemorized
          ? initialValuesMemorized.content
          : ""
        : "",
    scheduleTime:
      mode !== "create"
        ? initialValuesMemorized
          ? initialValuesMemorized.scheduleTime
          : null
        : null,
    file:
      mode !== "create"
        ? initialValuesMemorized
          ? initialValuesMemorized.file
          : null
        : null,
    schedule:
      mode !== "create" ? (initialValuesMemorized ? true : false) : false,
    dirty: false,
  });
  const [stage, setStage] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const toggleChooseOption = (event, classId) => {
    setAnchorEl(selectedClass.onChoosing ? null : event.currentTarget);

    dispatch({
      type: "TOGGLE_CHOOSING",
      payload: {
        classId: classId,
      },
    });
  };
  const fileHandler = async (e, file) => {
    if (file) {
      if (file.size / 1024 / 1024 > 2) {
        PopupSubject.next({
          type: "WARN",
          showTime: 5,
          message: "File too big, please choose other file less than 2MB!",
        });
      }
      dispatch({
        type: "SET_FILE",
        payload: { file: file },
      });
    } else {
      if (e.target.files[0].size / 1024 / 1024 > 2) {
        e.target.value = null;
        PopupSubject.next({
          type: "WARN",
          showTime: 5,
          message: "File too big, please choose other file less than 2MB!",
        });
      }
      if (e.target.files[0]) {
        const file = e.target.files[0];
        dispatch({
          type: "SET_FILE",
          payload: { file: file },
        });
      }
      e.target.value = null;
    }
  };

  const appendResource = (content) => {
    dispatch({
      type: "APPEND_CONTENT",
      payload: {
        text: `<a href="${content}" target="_blank">${content}</a>`,
      },
    });
  };

  const commitAnnouncement = async () => {
    const roomIds = Object.entries(selectedClass.classes)
      .map((c) => {
        return `${globalState.classData[c[0]].roomId}:${c[1]}`;
      })
      .join(",");
    console.log("check-room", roomIds);
    const announcementData = new FormData();
    //same for both edit and create
    announcementData.append("content", selectedClass.content);
    selectedClass.schedule &&
      announcementData.append("scheduleTime", selectedClass.scheduleTime);
    announcementData.append("roomIds", roomIds);
    //a little bit dif
    mode === "create" &&
    selectedClass.file &&
    selectedClass.file instanceof File
      ? announcementData.append(
          "file",
          selectedClass.file,
          selectedClass.file.name
        )
      : announcementData.append("file", selectedClass.file);
    //setId

    //HANDLE RESPONSE
    try {
      const response =
        mode === "create"
          ? await MessageService.sendAnnouncement(announcementData)
          : await MessageService.editSchedule(
              initialValues.scheduleId,
              announcementData
            );
      onDone();
      // response.data.message || mode === "create"
      //   ? `You've created a ${
      //       selectedClass.schedule ? "scheduled" : ""
      //     } announcement`
      //   : "Edit successfully"
    } catch (error) {
      PopupSubject.next({
        type: "WARN",
        message: error.response ? error.response.data : "Some errors occured",
        showTime: 5,
      });
    }
  };
  let main;
  if (!stage) {
    let open = Boolean(selectedClass.onChoosing);
    main = (
      <>
        <div className="select-announcement-target">
          <TextField
            type="input"
            variant="outlined"
            placeholder="Choose people or class"
          />
          <div className="classes-target">
            <h3>Classes</h3>
            {Object.values(globalState.classData)
              .filter(
                (classData) => classData.owner === globalState.userData.id
              )
              .map((classData) => {
                return (
                  <div
                    key={classData.classId}
                    className="announcement-target-class"
                  >
                    <Avatar
                      src={
                        classData.avatar ||
                        "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
                      }
                      className="medium "
                      alt={classData.name}
                    ></Avatar>
                    <div className="announcement-target-class-name-action">
                      <span>{classData.name}</span>
                      <span
                        onClick={(e) => {
                          toggleChooseOption(e, classData.classId);
                        }}
                        className={`toggle-choosing ${
                          selectedClass.onChoosing === classData.classId &&
                          "type-choosing"
                        }`}
                      >
                        {selectedClass.classes[classData.classId] || "All"}
                      </span>
                    </div>
                    <Checkbox
                      onChange={(e) =>
                        dispatch({
                          type: "NORMAL_CHOOSING",
                          payload: {
                            classId: classData.classId,
                            type: "all",
                          },
                        })
                      }
                      checked={Boolean(
                        selectedClass.classes[classData.classId]
                      )}
                      color="primary"
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                );
              })}
          </div>
          <Popper
            width="150px"
            className="secondary choosetype"
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            id="choose-type-popper"
          >
            <div
              onClick={(e) => {
                dispatch({
                  type: "CHOOSE_TYPE",
                  payload: {
                    classId: selectedClass.onChoosing,
                    type: "all",
                  },
                });
              }}
              className="popper__element type"
            >
              <span>All</span>
            </div>
            <div
              onClick={(e) => {
                dispatch({
                  type: "CHOOSE_TYPE",
                  payload: {
                    classId: selectedClass.onChoosing,
                    type: "student",
                  },
                });
              }}
              className="popper__element type"
            >
              <span>Student</span>
            </div>
            <div
              onClick={(e) => {
                dispatch({
                  type: "CHOOSE_TYPE",
                  payload: {
                    classId: selectedClass.onChoosing,
                    type: "parent",
                  },
                });
              }}
              className="popper__element type"
            >
              <span>Parent</span>
            </div>
          </Popper>
        </div>

        <div className="selected-announcement-target">
          <h3>Selected Classes</h3>
          {Object.entries(selectedClass.classes)
            .filter((entry) => entry[1])
            .map((classEntry, index) => {
              const [classId, type] = classEntry;
              return (
                <div
                  key={"class" + classId + "i" + index}
                  className="announcement-target-class selected"
                >
                  <Avatar
                    src={
                      globalState.classData[classId].avatar ||
                      "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
                    }
                    className="small"
                    alt={globalState.classData[classId].name}
                  ></Avatar>
                  <div className="announcement-target-class-name-action selected">
                    <span>{globalState.classData[classId].name}</span>
                    <span>{type}</span>
                  </div>
                  <CloseOutlinedIcon
                    onClick={(e) =>
                      dispatch({
                        type: "NORMAL_CHOOSING",
                        payload: {
                          classId: classId,
                        },
                      })
                    }
                    style={{ marginLeft: "auto" }}
                    color="secondary"
                  />
                </div>
              );
            })}
          <Button
            onClick={(e) => {
              setStage(true);
            }}
            className="continue"
          >
            Continue
          </Button>
        </div>
      </>
    );
  } else {
    // SEND Stage HERE
    const readyToSend =
      Object.keys(selectedClass.classes).length <= 0 ||
      (!selectedClass.content && !selectedClass.file);
    main = (
      <>
        <div className="announcement-edit-content">
          <div className="announcement-receivers">
            {Object.keys(selectedClass.classes).map((classId) => {
              return (
                <div key={classId} className="receiver">
                  <Avatar
                    src={
                      globalState.classData[classId].avatar ||
                      "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
                    }
                    className="small"
                    alt={globalState.classData[classId].name}
                  />
                  <span>{globalState.classData[classId].name}</span>
                </div>
              );
            })}
            <EditIcon
              onClick={(e) => setStage(false)}
              color="primary"
              className="edit"
            />
          </div>
          <div className="announcement-edit-content__textfield">
            <CKEditor
              editor={ClassicEditor}
              data={selectedClass.content}
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "blockQuote",
                  "link",
                  "numberedList",
                  "bulletedList",
                  "insertTable",
                  "mediaEmbed",
                  "|",
                  "undo",
                  "redo",
                ],
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                dispatch({
                  type: "SET_CONTENT",
                  payload: { text: data },
                });
              }}
            />
            <div
              className="announcement-file-preview"
              onDragEnter={(e) => {
                preventDefaults(e);
                e.currentTarget.classList.add("hightlight");
              }}
              onDragOver={(e) => {
                preventDefaults(e);
                e.currentTarget.classList.add("hightlight");
              }}
              onDragLeave={(e) => {
                preventDefaults(e);
                e.currentTarget.classList.remove("hightlight");
              }}
              onDrop={(e) => {
                preventDefaults(e);
                e.currentTarget.classList.remove("hightlight");
                if (e.dataTransfer.files.length > 0) {
                  fileHandler(null, e.dataTransfer.files[0]);
                }
              }}
            >
              <div className="announcement-edit-actions">
                <div
                  className="uploadfile"
                  onClick={(e) =>
                    document.getElementById("announcement-file-upload").click()
                  }
                >
                  <img
                    className="medium"
                    src="/Assets/uploadfile.png"
                    alt="Upload File"
                  />
                  <span>Upload A File</span>
                  <input
                    id="announcement-file-upload"
                    style={{ display: "none" }}
                    type="file"
                    onChange={fileHandler}
                  />
                </div>
              </div>
              {selectedClass.file ? (
                <div className="preview">
                  <AttachFilePreview
                    download={initialValuesMemorized}
                    visible={true}
                    supportVideo={true}
                    fileUrl={
                      selectedClass.file instanceof File
                        ? null
                        : selectedClass.file
                    }
                    file={
                      selectedClass.file instanceof File
                        ? selectedClass.file
                        : null
                    }
                  />
                  <CancelIcon
                    className="cancel-preview"
                    onClick={(e) =>
                      dispatch({
                        type: "SET_FILE",
                        payload: {
                          file: null,
                        },
                      })
                    }
                    color="secondary"
                  />
                </div>
              ) : (
                <p className="yourfilewillbehere">Your file will be here</p>
              )}
            </div>
          </div>
          <div className="announcement-edit-content__actions">
            <Button
              className="back"
              onClick={(e) => setStage(false)}
              variant="outlined"
            >
              Back
            </Button>
            {selectedClass.schedule && (
              <DateTimePicker
                disablePast
                ampm={false}
                format="dd/MM/yyyy HH:mm"
                className="schedule-picker"
                value={selectedClass.scheduleTime}
                onChange={(date) => {
                  dispatch({
                    type: "SET_SCHEDULE_TIME",
                    payload: {
                      time: date,
                    },
                  });
                }}
              />
            )}

            <Button
              onClick={(e) =>
                dispatch({
                  type: "TOGGLE_SCHEDULE",
                })
              }
              className="schedule"
              variant="outlined"
            >
              Schedule
            </Button>

            <Button
              className="send"
              disabled={readyToSend}
              onClick={(e) => commitAnnouncement()}
            >
              Send
            </Button>
          </div>
        </div>
        <OtherResource onAppend={appendResource} />
      </>
    );
  }
  return (
    <div className="create-announcement">
      <header className="create-announcement__header">
        <h1>Announcement</h1>
      </header>
      <main className="create-announcement__main">{main}</main>
    </div>
  );
};

export default CreateAnnouncement;
