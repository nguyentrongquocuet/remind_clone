import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
  useContext,
  useMemo,
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
import Skeleton from "@material-ui/lab/Skeleton";

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
  const messages = useRef(messagesState);
  const [message, setMessage] = useState("");
  const { globalState } = useContext(Context);
  const history = useHistory();
  const classId = useParams().classId;
  let roomId;
  try {
    roomId = globalState.classData.filter((c) => c.classId == classId)[0]
      .roomId;
  } catch {
    history.push("/classes");
  }

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
        messagesRef.current.removeEventListener("load", () => {});

        setMessagesState((prev) => {
          return { ...prev, messages: [...prev.messages, data.data] };
        });
        setMessage("");
      });
    }
  };
  //TODO: ADD TRY_CATCH
  useEffect(() => {
    const fetchMessages = () => {
      MessageService.getMessages(roomId, globalState.token)
        .then((data) => {
          console.log("check-data", data);
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
  }, [roomId, loading]);
  // setTimeout(() => setIsLoading(false), 1000);
  useEffect(() => {
    console.log("state", messagesState);
    const timeout = setTimeout(() => {
      if (!messagesState.fetching) {
        console.log(
          messagesRef.current.scrollTop,
          messagesRef.current.scrollHeight,
          messagesRef.current.clientHeight
        );
        console.log("current", messagesRef.current);
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [messagesState, messagesRef.current]);

  return (
    <>
      {loading || messagesState.fetching ? (
        <Skeleton
          className="messages__wrapper"
          animation="wave"
          variant="rect"
        />
      ) : (
        <div className="messages__wrapper">
          <div className="fix" style={{ flex: "1" }}></div>
          <div className="allmessages" ref={messagesRef}>
            {messagesState.messages.map((m) => (
              <Message key={m.id} senderData={"nothing"} message={m} />
            ))}
          </div>

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
      )}
    </>
  );
};

export default Messages;
