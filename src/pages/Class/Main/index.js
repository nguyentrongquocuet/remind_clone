import React, { Suspense, useState, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Loading from "../../../shared/components/Loading";
import Main from "../../../shared/components/Main";
import { Context } from "../../../shared/Util/context";
import ActionSidebar from "./tabs/ActionSidebar";
import Avatar from "@material-ui/core/Avatar";
import "./Main.scss";
const Messages = React.lazy(() => import("./tabs/Messages"));

const ClassMain = (props) => {
  const { globalState } = useContext(Context);

  const history = useHistory();
  const classId = useParams().classId;
  const [checking, setCheck] = useState(false);
  useEffect(() => {
    if (!props.loading) {
      for (const classs of globalState.classData) {
        if (classs.classId == classId) {
          // history.push(`/classes/${classs.classId}/messages`);
          setCheck(true);
          return;
        }
      }
      setCheck(false);
      history.push("/");
    }
  }, [props.loading]);

  let className;
  if (props.loading) return <Loading />;
  console.log(globalState.classData);
  for (const classs of globalState.classData) {
    if (classs.classId == classId) {
      className = classs.name;
    }
  }

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

  return (
    <Main header={header} className="shadow--left">
      {/* //TODO ADD MAIN OF MAIN, FLEXIBLE CLASSNAME */}
      <div className="main__wrapper">
        <Suspense fallback={<Loading />}>
          <Messages loading={checking && props.loading} />
        </Suspense>
        {/* {room__info--right COMPONENT} */}
        <ActionSidebar classId={classId} />
      </div>
    </Main>
  );
};

export default ClassMain;
