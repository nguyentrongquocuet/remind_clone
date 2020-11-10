import React, {
  Suspense,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useParams, useHistory } from "react-router-dom";
import Loading from "../../../shared/components/Loading";
import Main from "../../../shared/components/Main";
import { Context } from "../../../shared/Util/context";
import ActionSidebar from "./tabs/ActionSidebar";
import Avatar from "@material-ui/core/Avatar";
import "./Main.scss";
import Skeleton from "@material-ui/lab/Skeleton";
import ClassService from "../../../services/ClassService";
const Messages = React.lazy(() => import("./tabs/Messages"));

const ClassMain = (props) => {
  const { globalState, dispatch } = useContext(Context);

  const history = useHistory();
  const classId = useParams().classId;
  const [checked, setCheck] = useState(false);
  const [expanded, setExpand] = useState(false);
  const toggleExpand = useCallback(() => setExpand((prev) => !prev), []);
  useEffect(() => {
    console.log("classId changes to", classId);

    if (!props.loading) {
      let flag = false;
      for (const id of Object.keys(globalState.classData)) {
        if (id == classId) {
          flag = true;
          console.log("SET MEMBERS");
          ClassService.getClassMembers(classId).then((data) => {
            dispatch({
              type: "SET_CLASS_MEMBER",
              classId: classId,
              payload: data.data,
            });
            setCheck(true);
            return;
          });
        }
      }
      if (!flag) {
        setCheck(false);
        history.push("/");
      }
    }
    return () => setCheck(false);
  }, [props.loading, classId]);

  // if (props.loading || !checked) return <Loading />;
  const className = globalState.classData[classId].name;

  const header = (
    <>
      <div className="class-info">
        <Avatar
          className="alter-avatar medium"
          alt="hello"
          src="https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
        ></Avatar>
        {/* <img
          src="https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
          
          
        /> */}
        <div className="text-info">
          <span title={className} className="break-word-ellipsis">
            {className}
          </span>
          <p className="secondary">{`@${classId}`}</p>
        </div>
      </div>
    </>
  );
  console.log(
    "loading",
    checked && props.loading && !globalState.classData[classId].members
  );
  return (
    <Main header={header} className="shadow--left">
      {/* //TODO ADD MAIN OF MAIN, FLEXIBLE CLASSNAME */}
      <div className="main__wrapper">
        <Suspense
          fallback={<Skeleton className="messages__wrapper" variant="rect" />}
        >
          <Messages
            expanded={expanded}
            toggleExpand={toggleExpand}
            loading={!checked || props.loading}
          />
        </Suspense>
        {/* {room__info--right COMPONENT} */}
        <ActionSidebar
          expanded={expanded}
          toggleExpand={toggleExpand}
          classId={classId}
        />
      </div>
    </Main>
  );
};

export default ClassMain;
