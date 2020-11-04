import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
  useContext,
  useMemo,
} from "react";
import TextField from "../../../../../shared/Elements/TextField";
import SendIcon from "@material-ui/icons/Send";
import Modal from "../../../../../shared/Elements/Modal";
import Loading from "../../../../../shared/components/Loading";
import AttachFileIcon from "@material-ui/icons/AttachFile";

import "./Messages.scss";
import { Context } from "../../../../../shared/Util/context";
import { useParams } from "react-router-dom";
import MessageService from "../../../../../services/MessageService";

const Message = React.lazy(() =>
  import("../../../../../shared/Elements/Message")
);
// let dummyClasses = [
//   {
//     id: 1,
//     name: "quoc1",
//     owner: false,
//     type: "normal",
//   },
//   {
//     id: 2,
//     name: "quoc2",
//     owner: false,
//     type: "announcement",
//   },
//   {
//     id: 3,
//     name: "quoc2",
//     owner: true,
//     type: "announcement",
//   },
//   {
//     id: 4,
//     name: "quoc2",
//     owner: false,
//     type: "announcement",
//   },
//   {
//     id: 5,
//     name: "quoc2",
//     owner: true,
//     type: "announcement",
//   },
//   {
//     id: 6,
//     name: "quoc2",
//     owner: false,
//     type: "announcement",
//   },
//   {
//     id: 7,
//     name: "quoc2",
//     owner: true,
//     type: "announcement",
//   },
//   {
//     id: 8,
//     name: "quoc2",
//     owner: false,
//     type: "announcement",
//   },
//   {
//     id: 9,
//     name: "quoc2",
//     owner: false,
//     type: "rec",
//   },
//   {
//     id: 10,
//     name: "quoc2",
//     owner: true,
//     type: "normal",
//   },
//   {
//     id: 11,
//     name: "quoc2",
//     owner: true,
//     type: "announcement",
//     image:
//       "https://d2dej1z4r2nszb.cloudfront.net/images/a4f3f9b0-4a7e-4066-a2f1-d1f20c2509ec/detinhieu2.jpg?fit=max&w=600&h=600&image=true&Expires=1604707200&Signature=PueTuoy6GGqQDfbBk8i7vs85T~Owq4NRexoYxudLlsTX~RZdgCnnmA2oqToXi5I4ssphZTAZPhL-7nieTdxkkt9wJvWQsWqzhQOqqV2Xoy8Hmz8CiTqpcYyeXxbcD4EX~QT4g6cHoIlLQE3aD8sYeta4g77MMHN8~9CCklbX37y3j6uV~Cc4UILgwEJgoeuSo7izdxQhLbBYiUj1h8cn4RnPMkHLoP0F7kw4gW1ojEiL9-q~5rRFRgSTO2MhEui9dGOTgSLd8DTAfaKvJIaMk~9GyrsxARel5m3cDrLu7nS2jv6biILs1BsRE8ZckbLWkhRcgB2P3nArIhj1ts8ifg__&Key-Pair-Id=APKAIYBEA2OWI77AFPYQ",
//   },
//   {
//     id: 12,
//     name: "quoc2",
//     owner: true,
//     type: "announcement",
//     image:
//       "https://www.publicdomainpictures.net/pictures/320000/velka/background-image.png",
//   },
// ];

const Messages = (props) => {
  console.log("<ESSA");
  const [messagesState, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { globalState } = useContext(Context);
  const [fetching, setFetching] = useState(false);
  const classId = useParams().classId;
  const roomId = globalState.classData.filter((c) => c.classId == classId)[0]
    .roomId;
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

  return <>{loading ? <Loading style={{ flexGrow: "3.5" }} /> : main}</>;
};

export default Messages;
