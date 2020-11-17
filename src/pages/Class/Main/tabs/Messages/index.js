import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
} from "react";
import { Context } from "../../../../../shared/Util/context";
import TextField from "../../../../../shared/Elements/TextField";
import MessageService from "../../../../../services/MessageService";
import Loading from "../../../../../shared/components/Loading";
import { useParams, useHistory } from "react-router-dom";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import "./Messages.scss";
import RealTimeService from "../../../../../services/RealTimeService";
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
  const [message, setMessage] = useState("");
  const { globalState } = useContext(Context);
  const history = useHistory();
  const classId = useParams().classId;
  let roomId = globalState.classData[classId].roomId;
  if (!roomId) history.push("/classes");

  let messagesRef = useRef(null);
  let { loading } = props;
  const sendMessage = () => {
    console.log(message);
    if (message.trim().length > 0) {
      MessageService.sendMessage(
        roomId,
        { content: message },
        globalState.token
      ).then((data) => {
        setMessagesState((prev) => {
          return { ...prev, messages: [...prev.messages, data.data] };
        });
        setMessage("");
      });
    }
  };
  useEffect(() => {
    roomId = globalState.classData[classId].roomId;
    const sub = RealTimeService.subject.subscribe((data) => {
      if (data.roomId == roomId) {
        console.log(
          "check--message",
          data,
          "zoomid",
          roomId,
          "classId",
          classId
        );
        setMessagesState((prev) => {
          return { ...prev, messages: [...prev.messages, data] };
        });
      }
    });
    return () => sub.unsubscribe();
  }, [roomId, classId]);
  //TODO: ADD TRY_CATCH
  useEffect(() => {
    const fetchMessages = () => {
      MessageService.getMessages(roomId, globalState.token)
        .then((data) => {
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
  }, [messagesState, messagesRef.current]);
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
                    senderData={
                      globalState.classData[classId].members
                        ? globalState.classData[classId].members[m.senderId]
                        : { no: 1 }
                    }
                    key={m.id}
                    message={m}
                  />
                );
              })}
            </div>
          </>
        )}
        <div className="message__input">
          <TextField
            type="textarea"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            onKeyUp={(e) =>
              e.key === "Enter" ? e.preventDefault() : e.preventDefault()
            }
          />
          <input
            style={{ display: "none" }}
            type="file"
            name="file"
            id="file"
          />
          <AttachFileIcon
            onClick={(e) => document.getElementById("file").click()}
            color="primary"
          />
          <SendIcon
            onClick={(e) => {
              sendMessage();
            }}
            color="primary"
          />
        </div>
      </div>
    </>
  );
};

export default Messages;
