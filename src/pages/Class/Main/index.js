import React, {
  Suspense,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useParams, useHistory } from "react-router-dom";
import Main from "../../../shared/components/Main";
import { Context } from "../../../shared/Util/context";
import ActionSidebar from "./tabs/ActionSidebar";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import ClassService from "../../../services/ClassService";
import popUpSubject from "../../../shared/Util/PopupSubject";
import ModalSubject from "../../../shared/Util/ModalSubject";
import UserService from "../../../services/UserService";
import MessageService from "../../../services/MessageService";
import Loading from "../../../shared/components/Loading";
import "./Main.scss";
const Messages = React.lazy(() => import("./tabs/Messages"));
const toggleInvite = () => {
  ModalSubject.next({
    type: "INVITE_PEOPLE",
  });
};
const ClassMain = (props) => {
  const { globalState, dispatch } = useContext(Context);

  const history = useHistory();
  const { classId, userId } = useParams();
  const [checked, setCheck] = useState(false);
  const [expanded, setExpand] = useState(false);
  const [privateUserInfo, setPrivateUserInfo] = useState(null);
  const [privateRoomData, setPrivateRoomData] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const toggleExpand = useCallback(() => setExpand((prev) => !prev), []);

  const privateChatPrepare = async () => {
    setExpand(false);
    setInitializing(true);
    try {
      const privateRoomData = await MessageService.initialPrivateRoom(userId);
      setPrivateRoomData(privateRoomData.data);
    } catch (error) {
      if (error.response) {
        popUpSubject.next({
          type: "WARN",
          message: error.response.data,
          showTime: 4,
        });
      }
    } finally {
      setInitializing(false);
    }
  };
  useEffect(() => {
    const checkAndGetClassMembers = async () => {
      if (!props.loading) {
        let flag = false;
        for (const id of Object.keys(globalState.classData)) {
          if (id == classId) {
            flag = true;
            ClassService.getClassMembers(classId)
              .then((data) => {
                dispatch({
                  type: "SET_CLASS_MEMBER",
                  classId: classId,
                  payload: data.data,
                });
                setCheck(true);
                return;
              })
              .catch((error) =>
                popUpSubject.next({
                  type: "WARN",
                  message: error.response
                    ? error.response.data
                    : "Some errors occured",
                  showTime: 5,
                })
              );
          }
        }
        if (!flag) {
          setCheck(false);
          history.push("/");
        }
        if (userId) {
          privateChatPrepare();
          const userInfo = await UserService.getUserInfo(userId);
          setPrivateUserInfo(userInfo.data);
        } else {
          setPrivateUserInfo(null);
          setPrivateRoomData(null);
          setInitializing(false);
        }
      }
    };
    checkAndGetClassMembers();
    return () => setCheck(false);
  }, [props.loading, classId, userId]);

  useEffect(() => {
    if (!userId) setInitializing(false);
  }, [userId]);
  // if (props.loading || !checked) return <Loading />;
  const className = globalState.classData[classId].name;

  const header = (
    <>
      <div className="class-info">
        <Avatar
          className="alter-avatar medium"
          alt="hello"
          src={
            globalState.classData[classId].avatar ||
            "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
          }
        ></Avatar>
        <div className="text-info">
          <span title={className} className="break-word-ellipsis">
            {className}
          </span>
          <p className="secondary">{`@${classId}`}</p>
        </div>
      </div>
      <div className="invite" onClick={toggleInvite}>
        Invite
      </div>
    </>
  );
  return (
    <Main header={header} className="shadow--left">
      {/* //TODO ADD MAIN OF MAIN, FLEXIBLE CLASSNAME */}
      <div className="main__wrapper">
        <Suspense
          fallback={<Skeleton className="messages__wrapper" variant="rect" />}
        >
          {!initializing ? (
            <Messages
              classId={classId}
              privateChat={Boolean(privateUserInfo)}
              privateUserInfo={privateUserInfo}
              privateRoomData={privateRoomData}
              expanded={expanded}
              toggleExpand={toggleExpand}
              loading={!checked || initializing || props.loading}
            />
          ) : (
            <Loading />
          )}
        </Suspense>
        {/* {room__info--right COMPONENT} */}
        {!privateUserInfo && (
          <ActionSidebar
            expanded={expanded}
            toggleExpand={toggleExpand}
            classId={classId}
          />
        )}
      </div>
    </Main>
  );
};

export default ClassMain;
