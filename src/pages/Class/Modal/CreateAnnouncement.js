import React, { useContext, useReducer, useState } from "react";
import { Context } from "../../../shared/Util/context";
import TextField from "../../../shared/Elements/TextField";
import { Avatar, Card } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import Checkbox from "@material-ui/core/Checkbox";
import CancelIcon from "@material-ui/icons/Cancel";
import Popper from "../../../shared/Elements/Popper";
import Button from "../../../shared/Elements/Button";
import { useParams } from "react-router-dom";
import AttachFilePreview from "../../../shared/Elements/AttachFilePreview";
import isImage from "../../../shared/Util/ImageDetect";
import "./CreateAnnouncement.scss";
import MessageService from "../../../services/MessageService";
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
      };
      break;
    case "NORMAL_CHOOSING":
      if (state.classes[action.payload.classId]) {
        out = {
          ...state,
          classes: { ...state.classes, [action.payload.classId]: null },
        };
      } else {
        out = {
          ...state,
          classes: {
            ...state.classes,
            [action.payload.classId]: action.payload.type,
          },
        };
      }
      break;
    case "SET_CONTENT":
      out = { ...state, content: action.payload.text };
      break;
    case "SET_FILE":
      out = { ...state, file: action.payload.file };
      break;
    default:
      break;
  }

  return { ...out, classes: { ...objectFilter(out.classes) } };
};
const CreateAnnouncement = ({ initialClass }) => {
  const { globalState } = useContext(Context);
  const { classId } = useParams();
  const [selectedClass, dispatch] = useReducer(reducer, {
    classes: { [classId]: "all" },
    onChoosing: null,
    content: "",
    schedule: null,
    file: null,
  });
  const [mode, setMode] = useState(false);
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
  const fileHandler = async (e) => {
    if (e.target.files[0].size / 1024 / 1024 > 2) {
      e.target.value = null;
      alert("File too big");
    }
    if (e.target.files[0]) {
      const file = e.target.files[0];
      dispatch({
        type: "SET_FILE",
        payload: { file: file },
      });
    }
    e.target.value = null;
  };
  const sendAnnouncement = async () => {
    const classes = Object.keys(selectedClass.classes);
    console.log(selectedClass, classes);
    const roomIds = Object.values(globalState.classData)
      .filter((classData) => {
        // console.log(classData.classId);
        return classes.includes("" + classData.classId);
      })
      .map((classData) => classData.roomId);
    const announcementData = new FormData();
    announcementData.append("content", selectedClass.content);
    announcementData.append("schedule", selectedClass.schedule);
    announcementData.append("roomIds", roomIds);
    selectedClass.file &&
      announcementData.append(
        "file",
        selectedClass.file,
        selectedClass.file.name
      );
    const response = await MessageService.sendAnnouncement(announcementData);
  };
  let main;
  if (!mode) {
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
              setMode(true);
            }}
            className="continue"
          >
            Continue
          </Button>
        </div>
      </>
    );
  } else {
    // SEND MODE HERE
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
              onClick={(e) => setMode(false)}
              color="primary"
              className="edit"
            />
          </div>
          <div className="announcement-edit-content__textfield">
            <TextField
              placeholder="Type your message here"
              type="textarea"
              rows={7}
              onChange={(e) => {
                dispatch({
                  type: "SET_CONTENT",
                  payload: {
                    text: e.target.value.trim(),
                  },
                });
              }}
              value={selectedClass.content}
            />
            <div className="announcement-file-preview">
              {selectedClass.file ? (
                <div className="preview">
                  <AttachFilePreview
                    download={false}
                    visible={true}
                    // fileUrl={previewUrl}
                    file={selectedClass.file}
                    // fileName={selectedClass.file.name}
                    // type={selectedClass.file.type}
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
                <p>Your file will be here</p>
              )}
            </div>
          </div>
          <div className="announcement-edit-content__actions">
            <Button
              className="back"
              onClick={(e) => setMode(false)}
              variant="outlined"
            >
              Back
            </Button>
            <Button className="schedule" variant="outlined">
              Schedule
            </Button>
            <Button
              className="send"
              disabled={
                selectedClass.content.length <= 0 && !selectedClass.file
              }
              onClick={(e) => sendAnnouncement()}
            >
              Send
            </Button>
          </div>
        </div>

        <div className="announcement-edit-actions">
          <div
            className="uploadfile"
            onClick={(e) =>
              document.getElementById("announcement-file-upload").click()
            }
          >
            <img className="medium" src="/uploadfile.png" alt="Upload File" />
            <span>Upload A File</span>
            <input
              id="announcement-file-upload"
              style={{ display: "none" }}
              type="file"
              onChange={fileHandler}
            />
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
