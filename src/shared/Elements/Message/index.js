import React, { useState, useContext, Suspense } from "react";
import "./Message.scss";
import Popper from "../Popper";
import useLazy from "../../Util/lazy-hook";
import { Context } from "../../Util/context";
import Loading from "../../components/Loading";
const Modal = React.lazy(() => import("../Modal"));
const Message = ({ message, senderData }) => {
  const [previewRequest, setPreviewRequest] = useState(null);
  const [ref, visible] = useLazy(
    () => {
      ref.current.src = ref.current.getAttribute("data-src");
    },
    {
      root: document.getElementsByClassName("allmessages")[0],
      rootMargin: "0px 0px 100px 0px",
    }
  );
  const userId = useContext(Context).globalState.userData.id;
  const own = message.senderId == userId;
  console.log("time", message.createAt);

  // if(content.type==="text")
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (type, event) => {
    event.preventDefault();
    if (type === "off") {
      if (anchorEl) setAnchorEl(null);
    } else {
      if (!anchorEl) setAnchorEl(event.currentTarget);
    }
  };
  const open = Boolean(anchorEl);
  // CAN USE FOR MESSAGE REACTING
  const popper = (
    <Popper
      width="fit-content"
      className="secondary"
      // id={id}
      open={open}
      anchorEl={anchorEl}
      placement={own ? "left" : "right"}
    >
      <div
        className="popper__element"
        style={{
          cursor: "pointer",
          marginLeft: ".5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {!own && <p>{senderData.name || "dummy"}</p>}
        <p>
          {new Date(Date.parse(message.createAt)).toLocaleString() || "now"}
        </p>
      </div>
    </Popper>
  );
  const text = message.content
    .trim()
    .split(/[\n]+/)
    .map((w) => (
      <>
        <span>{w}</span> <br />
      </>
    ));
  if (message.type === 0) {
    const normalMessage = (
      <>
        <div className="message__content">
          <p>{text}</p>
        </div>
      </>
    );

    return (
      <div
        onMouseLeave={(e) => {
          handleClick("off", e);
        }}
        onMouseOver={(e) => {
          handleClick("on", e);
        }}
        className={`message ${own ? "owner" : ""}`}
      >
        {normalMessage}
        {popper}
      </div>
    );
  }

  return (
    <div className={`announcement ${own ? "owner" : ""}`}>
      <header
        className="announcement__header"
        onMouseLeave={(e) => {
          handleClick("off", e);
        }}
        onMouseOver={(e) => {
          handleClick("on", e);
        }}
      >
        <img
          src={
            senderData.avatar ||
            "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
          }
          alt="message"
          className={`alter-avatar small`}
        />
        <span>{senderData.name}</span>
      </header>
      <div className="announcement__content">
        <p
          style={{
            marginLeft: ".5rem",
            wordBreak: "break-word",
            cursor: "default",
          }}
        >
          {message.content ||
            "hellooooooodddqwdqwdwqdsadasdadddassdasaddwqdwqdqwooo"}
        </p>
        {/* <LazyLoad placeholder="loading" offset={100}> */}
        <div
          onClick={(e) => {
            e.preventDefault();
            alert("preview");
            setPreviewRequest(message.image || null);
          }}
          className="image"
          id={visible ? "" : "image__wrapper"}
          style={{
            cursor: "pointer",
            maxWidth: "280px",
            backgroundImage: visible
              ? `url("${
                  message.image ||
                  "https://www.publicdomainpictures.net/pictures/320000/velka/background-image.png"
                }")`
              : "",
            // backgroundPosition: "center",
            backgroundSize: "cover",
            maxHeight: "150px",
          }}
        >
          {/* {image && ( */}
          <img
            style={{
              opacity: 0,
              width: "280px",
              height: "150px",
              display: "block",
            }}
            ref={ref}
            // src={
            //   visible
            //     ? image ||
            //       "https://www.publicdomainpictures.net/pictures/320000/velka/background-image.png"
            //     : ""
            // }

            alt="hello"
          />
          {/* )} */}
        </div>
        {/* </LazyLoad> */}
      </div>
      {popper}
      <Suspense fallback={<Loading />}>
        <Modal
          closeButton
          open={previewRequest}
          classNames={{ wrapper: "center", content: "imagePreview" }}
          style={{}}
          onClose={(e) => {
            alert("close");
            setPreviewRequest(null);
          }}
          header={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                height: "40px",
                backgroundColor: "black",
                color: "white",
              }}
            >
              <span>detinhieu</span>
              <span style={{ flex: "1 1 auto" }}></span>
              <span style={{ cursor: "pointer" }}>View</span>
              <span style={{ cursor: "pointer" }}>Download</span>
            </div>
          }
        >
          <div className="preview" style={{ pointerEvents: "none" }}>
            <img
              src={previewRequest}
              alt="hello"
              style={{ maxWidth: "700px", pointerEvents: "all" }}
            />
          </div>
        </Modal>
      </Suspense>
    </div>
  );
};

export default Message;
