import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
  useMemo,
} from "react";
import { useParams, useHistory } from "react-router-dom";
import { Context } from "../../../../../shared/Util/context";
import RealTimeService from "../../../../../services/RealTimeService";
import MessageService from "../../../../../services/MessageService";
import { Avatar, Button, Card } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ScheduleIcon from "@material-ui/icons/Schedule";
import TextField from "../../../../../shared/Elements/TextField";
import Loading from "../../../../../shared/components/Loading";
import ModalSubject from "../../../../../shared/Util/ModalSubject";
import "./Messages.scss";
import AttachFilePreview from "../../../../../shared/Elements/AttachFilePreview";
import popupSubject from "../../../../../shared/Util/PopupSubject";
import FileSubject from "../../../../../shared/Util/FileSubject";
import ROLE from "../../../../../shared/Util/ROLE";
const Message = React.lazy(() =>
  import("../../../../../shared/Elements/Message")
);
//TOTO: CACHE MESSAGES DATA
const Messages = (props) => {
  const { privateChat, privateRoomData, privateUserInfo, loading } = props;
  const [messagesState, setMessagesState] = useState({
    messages: [],
    schedules: [],
    fetching: true,
  });
  const [message, setMessage] = useState({
    content: "",
    file: null,
    schedules: null,
  });
  const { globalState, dispatch } = useContext(Context);
  const history = useHistory();
  const classId = useParams().classId;
  let roomId = privateChat
    ? privateRoomData.roomId
    : globalState.classData[classId].roomId;
  if (!roomId) history.push("/classes");

  let messagesRef = useRef(null);
  const isOwner = useMemo(
    () => globalState.classData[classId].owner === globalState.userData.id,
    [classId, globalState]
  );
  const classAvatar = useMemo(() => globalState.classData[classId].avatar, [
    classId,
  ]);
  const backToClass = (e) => history.push(`/classes/${classId}`);
  const sendMessage = () => {
    if (message.content.trim().length > 0 || message.file) {
      const messageData = new FormData();
      messageData.append("content", message.content);
      messageData.append("schedule", message.schedule);
      if (message.file) {
        messageData.append("file", message.file, message.file.name);
      }

      MessageService.sendMessage(roomId, messageData, globalState.token)
        .then((data) => {
          if (data.data.file) {
            FileSubject.next({
              type: "NEW_FILE",
              payload: data.data,
            });
          }
          setMessagesState((prev) => {
            return { ...prev, messages: [...prev.messages, data.data] };
          });
          setMessage({ schedule: null, content: "", file: null });
        })
        .catch((error) =>
          popupSubject.next({
            type: "WARN",
            message: error.response
              ? error.response.data
              : "Some errors occured",
            showTime: 5,
          })
        );
    }
  };
  useEffect(() => {
    if (!privateChat) {
      roomId = globalState.classData[classId].roomId;
    }

    const sub = RealTimeService.IOSubject.subscribe((data) => {
      switch (data.type) {
        case "MESSAGES":
          if (data.payload.roomId == roomId) {
            setMessagesState((prev) => {
              return { ...prev, messages: [...prev.messages, data.payload] };
            });
          }
          break;
        case "SCHEDULE":
          switch (data.action) {
            case "START":
              setMessagesState((prev) => {
                return {
                  ...prev,
                  schedules: [...prev.schedules, data.payload],
                };
              });
              break;
            default:
              break;
          }
        default:
          break;
      }
    });
    return () => {
      sub.unsubscribe();
      setMessage({ schedule: null, content: "", file: null });
    };
  }, [roomId, classId]);
  //TODO: ADD TRY_CATCH
  useEffect(() => {
    //fetch messages and schedules
    const fetchMessages = () => {
      MessageService.getMessages(roomId, globalState.token)
        .then((data) => {
          dispatch({ type: "SET_READ", id: classId });
          setMessagesState((prev) => {
            return {
              fetching: false,
              messages: [...data.data.messages],
              schedules: [...data.data.schedules],
            };
          });
        })
        .catch((error) =>
          popupSubject.next({
            showTime: 5,
            message: error.response
              ? error.response.data
              : "Some errors occured",
            type: "WARN",
          })
        );
    };
    if (!loading || roomId) {
      fetchMessages();
    }
    return () =>
      setMessagesState({ fetching: true, messages: [], schedules: [] });
  }, [roomId, classId, loading]);
  // setTimeout(() => setIsLoading(false), 1000);
  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      if (!messagesState.fetching && !loading) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [messagesState.fetching, messagesRef]);
  // useEffect(() => {
  // }, [privateChat]);
  ///file effect
  const fileHandler = async (e, file) => {
    if (file) {
      if (file.size / 1024 / 1024 > 2) {
        setMessage((prev) => {
          return { ...prev, file: file };
        });
      }
      setMessage((prev) => {
        return { ...prev, file: file };
      });
    } else {
      if (e.target.files.length > 0) {
        if (e.target.files[0].size / 1024 / 1024 > 2) {
          popupSubject.next({
            type: "WARN",
            showTime: 5,
            message: "File too big, please choose other file less than 2MB!",
          });
          e.target.value = null;
          return;
        }
        const file = e.target.files[0];
        setMessage((prev) => {
          return { ...prev, file: file };
        });
        // messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        e.target.value = null;
      }
    }
  };

  return (
    <>
      <div className={`messages__wrapper ${props.expanded ? "expanded" : ""}`}>
        {loading || messagesState.fetching ? (
          <Loading
            className="messages__wrapper"
            animation="wave"
            variant="rect"
          />
        ) : (
          <>
            {privateChat && (
              <div className="private-info">
                {privateUserInfo ? (
                  <>
                    <div className="info-wrapper">
                      <Avatar className="small" src={privateUserInfo.avatar} />
                      <div className="info">
                        <div className="name">
                          <span className="name">
                            {privateUserInfo.firstName}{" "}
                          </span>
                          <span className="name">
                            {privateUserInfo.lastName}
                          </span>
                        </div>
                        <span className="role">
                          {ROLE[privateUserInfo.role]}
                        </span>
                      </div>
                    </div>
                    <span className="private-label">Private</span>
                    <Button
                      className="back-to-class"
                      size="small"
                      variant="outlined"
                      color="default"
                      onClick={backToClass}
                    >
                      Back to class
                    </Button>
                  </>
                ) : (
                  <Loading />
                )}
              </div>
            )}

            <div className="fix" style={{ flex: "1" }}></div>
            <div className="allmessages" ref={messagesRef}>
              {messagesState.messages.map((m) => {
                return (
                  <Message
                    onPreview={(e) =>
                      ModalSubject.next({
                        type: "PREVIEW_IMAGE",
                        data: {
                          path: m.file || "/logo.png",
                        },
                      })
                    }
                    classAvatar={classAvatar}
                    senderData={
                      globalState.classData[classId].members
                        ? globalState.classData[classId].members[m.senderId]
                        : { no: 1 }
                    }
                    key={m.id || -1}
                    message={m}
                  />
                );
              })}
            </div>
          </>
        )}

        <div className="message-input-preview">
          {message.file && (
            <Card className="preview">
              <AttachFilePreview
                supportVideo={false}
                onClick={(e, data) =>
                  ModalSubject.next({
                    type: "PREVIEW_IMAGE",
                    data: data,
                  })
                }
                visible={true}
                file={message.file}
              />
              <div className="cancel">
                <CancelIcon
                  onClick={(e) =>
                    setMessage((prev) => {
                      return { ...prev, file: null };
                    })
                  }
                  color="secondary"
                />
              </div>
            </Card>
          )}
          {isOwner && messagesState.schedules.length > 0 && (
            <div
              onClick={(e) =>
                ModalSubject.next({
                  type: "PREVIEW_SCHEDULE",
                  data: {
                    schedules: messagesState.schedules,
                  },
                })
              }
              className="incoming-schedules"
            >
              <ScheduleIcon color="primary" />
              <p>You have {messagesState.schedules.length} schedules</p>
            </div>
          )}

          <div className="message__input">
            <TextField
              type="textarea"
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files.length > 0) {
                  fileHandler(null, e.dataTransfer.files[0]);
                }
              }}
              placeholder="You can drop file here!"
              onChange={(e) =>
                setMessage((prev) => {
                  return { ...prev, content: e.target.value };
                })
              }
              value={message.content}
              onKeyUp={(e) =>
                e.key === "Enter" ? e.preventDefault() : e.preventDefault()
              }
            />
            <input
              style={{ display: "none" }}
              type="file"
              name="file"
              id="file"
              onChange={fileHandler}
            />
            {isOwner && (
              <div
                title="Create Announcement"
                className="message__input__action small"
                onClick={(e) =>
                  ModalSubject.next({
                    type: "CREATE_ANNOUNCEMENT",
                    data: {
                      initialClass: classId,
                    },
                  })
                }
              >
                <img src="/announcement.png" alt="" />
              </div>
            )}

            <AttachFileIcon
              onClick={(e) => document.getElementById("file").click()}
              color="primary"
              className="message__input__action"
              titleAccess="Attach File"
            />
            <SendIcon
              onClick={(e) => {
                sendMessage();
              }}
              className="message__input__action"
              color="primary"
              titleAccess="Send Message"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
