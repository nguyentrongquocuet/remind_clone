import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
} from "react";
import { useParams, useHistory } from "react-router-dom";
import { Context } from "../../../../../shared/Util/context";
import RealTimeService from "../../../../../services/RealTimeService";
import MessageService from "../../../../../services/MessageService";
import { Card } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import TextField from "../../../../../shared/Elements/TextField";
import Loading from "../../../../../shared/components/Loading";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MimeTypeDetect from "../../../../../shared/Util/MimeTypeDetect";
import ModalSubject from "../../../../../shared/Util/ModalSubject";
import "./Messages.scss";
import AttachFilePreview from "../../../../../shared/Elements/AttachFilePreview";
const Message = React.lazy(() =>
  import("../../../../../shared/Elements/Message")
);
//TOTO: CACHE MESSAGES DATA
const Messages = (props) => {
  console.log("<ESSA");
  const [messagesState, setMessagesState] = useState({
    messages: [],
    fetching: true,
  });
  const [message, setMessage] = useState({
    content: "",
    file: null,
    schedule: null,
  });
  const { globalState, dispatch } = useContext(Context);
  const history = useHistory();
  const classId = useParams().classId;
  let roomId = globalState.classData[classId].roomId;
  if (!roomId) history.push("/classes");

  let messagesRef = useRef(null);
  let { loading } = props;
  const sendMessage = () => {
    console.log(message);
    if (message.content.trim().length > 0 || message.file) {
      const messageData = new FormData();
      messageData.append("content", message.content);
      messageData.append("schedule", message.schedule);
      if (message.file) {
        messageData.append("file", message.file, message.file.name);
      }

      MessageService.sendMessage(roomId, messageData, globalState.token).then(
        (data) => {
          setMessagesState((prev) => {
            return { ...prev, messages: [...prev.messages, data.data] };
          });
          setMessage({ schedule: null, content: "", file: null });
        }
      );
    }
  };
  useEffect(() => {
    roomId = globalState.classData[classId].roomId;
    const sub = RealTimeService.IOSubject.subscribe((data) => {
      if (data.roomId == roomId) {
        setMessagesState((prev) => {
          return { ...prev, messages: [...prev.messages, data] };
        });
      }
    });
    return () => {
      sub.unsubscribe();
      setMessage({ schedule: null, content: "", file: null });
    };
  }, [roomId, classId]);
  //TODO: ADD TRY_CATCH
  useEffect(() => {
    const fetchMessages = () => {
      MessageService.getMessages(roomId, globalState.token)
        .then((data) => {
          dispatch({ type: "SET_READ", id: classId });
          setMessagesState((prev) => {
            return { fetching: false, messages: [...data.data] };
          });
        })
        .catch((error) => alert(error));
    };
    if (!loading) {
      setMessagesState((prev) => {
        return { ...prev, fetching: true };
      });
      fetchMessages();
    }
    return () => setMessagesState({ fetching: true, messages: [] });
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

  ///file effect
  const fileHandler = async (e) => {
    if (e.target.files.length > 0) {
      if (e.target.files[0].size / 1024 / 1024 > 2) {
        alert("file too big");
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
          <div className="message__input">
            <TextField
              type="textarea"
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
            <div
              title="Create Announcement"
              className="message__input__action small"
              onClick={(e) =>
                ModalSubject.next({
                  type: "CREATE_ANNOUNCEMENT",
                  data: {
                    class: classId,
                  },
                })
              }
            >
              <img src="/announcement.png" alt="" />
            </div>
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
