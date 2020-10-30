import React from "react";
import Main from "../../../shared/components/Main";
import HeaderNav from "../../../shared/Elements/HeaderNav";
import Messages from "../tabs/Messages";
import "./Main.scss";
const HEADER = [
  {
    to: "files",
    text: "files",
  },
  {
    to: "people",
    text: "people",
  },
  {
    to: "setting",
    text: "setting",
  },
];
const ClassMain = (props) => {
  const header = (
    <>
      <div className="class-info">
        <img
          src="https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
          alt="hello"
          className="alter-avatar medium"
        />
        <div className="text-info">
          <p>Class1</p>
          <p className="secondary">@cass2</p>
        </div>
      </div>
    </>
  );

  return (
    <Main header={header} className="shadow--left">
      {/* //TODO ADD MAIN OF MAIN, FLEXIBLE CLASSNAME */}
      <div className="main__wrapper">
        <Messages />
        <div className="room__info--right">
          <HeaderNav elements={HEADER} />
        </div>
      </div>
    </Main>
  );
};

export default ClassMain;
