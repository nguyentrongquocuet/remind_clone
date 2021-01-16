import { Avatar } from "@material-ui/core";
import React, { useRef, useState } from "react";
import MimeTypeDetect from "../../Util/MimeTypeDetect";
import PopupSubject from "../../Util/PopupSubject";
import "./PickupAvatar.scss";
const PickupAvatar = ({
  text,
  onChange,
  defaultSrc,
  required = true,
  onRemove = () => {},
  onUndo = () => {},
  disabled,
}) => {
  const [src, setScr] = useState(() => defaultSrc);
  const [file, setFile] = useState(null);
  const ref = useRef();
  const onPickup = async (e) => {
    if (e.target.files.length >= 0) {
      if (e.target.files[0].size / 1024 / 1024 > 2) {
        PopupSubject.next({
          type: "WARN",
          showTime: 5,
          message: "Choose a smaller avatar(<2mb)",
        });
        return;
      }
      const file = e.target.files[0];

      const mimeType = await MimeTypeDetect(file);
      let isValid = false;
      switch (mimeType) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe2":
        case "ffd8ffe1":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }
      if (isValid) {
        setFile(file);
        onChange(file);
        const readFile = new FileReader();
        readFile.addEventListener("loadend", () => {
          setScr(readFile.result);
        });
        readFile.readAsDataURL(file);
      }
      e.value = null;
    }
  };

  const onClean = (e) => {
    if (src !== defaultSrc || required) {
      setFile(defaultSrc);
      // onChange(defaultSrc);
      setScr(defaultSrc);
      onUndo();
    } else {
      onRemove();
      setFile(null);
      // onChange(null);
      setScr(null);
    }
  };

  return (
    <div className="pickicon">
      <div className="pickicon__preview">
        {required && !disabled && <span onClick={onClean}>x</span>}
        <Avatar src={src} alt="" />
      </div>
      {!disabled && (
        <span onClick={(e) => ref.current.click()}>{text || "Edit Icon"}</span>
      )}
      {/* <span onClick={(e) => }>Reset</span> */}
      <input
        ref={ref}
        onChange={onPickup}
        type="file"
        style={{ display: "none" }}
        disabled={disabled}
      />
    </div>
  );
};

export default PickupAvatar;
