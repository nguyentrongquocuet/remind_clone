import React from "react";
import Main from "../../../shared/components/Main";
import Sidebar from "../../../shared/components/Sidebar";
import HeaderNav from "../../../shared/Elements/HeaderNav";
import Messages from "../tabs/Messages";
const HEADER = [
  {
    to: "messages",
    text: "messages",
  },
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

      <HeaderNav elements={HEADER} />
    </>
  );

  return (
    <Main header={header}>
      {/* //TODO ADD MAIN OF MAIN */}
      <main className="main">
        {/* Messages tab also has sidebar and side main */}
        <Messages />
      </main>
    </Main>
  );
};

export default ClassMain;
