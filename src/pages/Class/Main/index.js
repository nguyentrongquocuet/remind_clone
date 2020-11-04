import React, { Suspense, useState, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Loading from "../../../shared/components/Loading";
import Main from "../../../shared/components/Main";
import { Context } from "../../../shared/Util/context";
import "./Main.scss";
import ActionSidebar from "./tabs/ActionSidebar";

const Messages = React.lazy(() => import("./tabs/Messages"));

const ClassMain = (props) => {
  const { globalState } = useContext(Context);

  const history = useHistory();
  const classId = useParams().classId;
  useEffect(() => {
    if (!props.loading) {
      for (const classs of globalState.classData) {
        if (classs.classId) {
          history.push(`/classes/${classs.classId}/messages`);
          return;
        }
      }
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
        <img
          src="https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
          alt="hello"
          className="alter-avatar medium"
        />
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
          <Messages loading={props.loading} />
        </Suspense>
        {/* {room__info--right COMPONENT} */}
        <ActionSidebar classId={classId} />
      </div>
    </Main>
  );
};

export default ClassMain;
