import React, { useContext, useMemo, useReducer, useState } from "react";
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
import "./CreateAnnouncement.scss";
import MessageService from "../../../services/MessageService";
import DateTimePicker from "../../../shared/Elements/DateTimePicker";
import PopupSubject from "../../../shared/Util/PopupSubject";

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
  console.log(selectedClass);
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
      onDone(
        response.data.message || mode === "create"
          ? `You've created a ${
              selectedClass.schedule ? "scheduled" : ""
            } announcement`
          : "Edit successfully"
      );
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
            .map((classEntry) => {
              const [classId, type] = classEntry;
              return (
                <div
                  key={classId}
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
                    src="/uploadfile.png"
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
              disabled={
                selectedClass.content.length <= 0 && !selectedClass.file
              }
              onClick={(e) => commitAnnouncement()}
            >
              Send
            </Button>
          </div>
        </div>
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
