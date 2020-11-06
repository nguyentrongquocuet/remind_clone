import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
  useContext,
  useMemo,
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
  const [messagesState, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { globalState } = useContext(Context);
  const [fetching, setFetching] = useState(false);
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
        setMessages((prev) => [...prev, data.data]);
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
          setFetching(false);
          setMessages(data.data);
        })
        .catch((error) => alert(error));
    };
    if (!loading) {
      setFetching(true);
      fetchMessages();
    }
  }, [loading, roomId]);
  // setTimeout(() => setIsLoading(false), 1000);
  useEffect(() => {
    messagesRef.current.removeEventListener("load", () => {});
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messagesState]);

  const messages = messagesState.map((m) => (
    <Message key={m.id} senderData={"nothing"} message={m} />
  ));
  const main = (
    <>
      <div className="messages__wrapper">
        <div className="fix" style={{ flex: "1" }}></div>
        <div
          onLoad={(e) => {
            console.log("Load");
            e.currentTarget.scrollTop = e.currentTarget.scrollHeight;
          }}
          className="allmessages"
          ref={messagesRef}
        >
          {messages}
        </div>

        <div className="message__input">
          <TextField
            type="textarea"
            placeholder="send messages"
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

  return (
    <>
      {loading ? (
        <Loading className="messages__wrapper" />
      ) : fetching ? (
        <Skeleton
          className="messages__wrapper"
          animation="wave"
          variant="rect"
        />
      ) : (
        main
      )}
    </>
  );
};

export default Messages;
