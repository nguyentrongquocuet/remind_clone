import React, { useContext, useEffect, useState } from "react";
import MessageService from "../../../services/MessageService";
import PopupSubject from "../../../shared/Util/PopupSubject";
import AttachFilePreview from "../../../shared/Elements/AttachFilePreview";
import Loading from "../../../shared/components/Loading";
import { Avatar } from "@material-ui/core";
import moment from "moment";
import { Context } from "../../../shared/Util/context";
import "./PreviewFile.scss";

const PreviewFile = ({ file }) => {
  const [fileDetails, setFileDetails] = useState();
  const { globalState } = useContext(Context);
  console.log("file", file);
  useEffect(() => {
    try {
      const getDetails = async () => {
        const fileDetails = await MessageService.getFileDetails(file.id);
        setFileDetails(fileDetails.data);
      };
      getDetails();
    } catch (error) {
      error.response &&
        PopupSubject.next({
          showTime: 5,
          type: "WARN",
          message: error.response.data,
        });
    }
  }, [file]);
  return fileDetails ? (
    <div className="only-file-preview">
      <AttachFilePreview
        download
        fileUrl={fileDetails.file}
        visible={true}
        supportVideo={true}
      />
      <div className="info">
        <p className="info-head">Message</p>
        {fileDetails.content && (
          <div
            className={`message ${
              fileDetails.senderId === globalState.userData.id ? "owner" : ""
            }`}
            dangerouslySetInnerHTML={{
              __html: fileDetails.content,
            }}
          ></div>
        )}

        <p className="info-head">Shared on</p>
        <p className="time">
          {moment(fileDetails.createAt).format("dddd DD MM YYYY, HH:mm")}
        </p>
        <p className="info-head">Shared by</p>
        <div className="info-avatar">
          <Avatar className="medium" src={fileDetails.avatar} />
          <p className="name">
            {fileDetails.firstName + " " + fileDetails.lastName}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default PreviewFile;
