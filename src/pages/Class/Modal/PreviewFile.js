import React, { useEffect, useState } from "react";
import MessageService from "../../../services/MessageService";
import PopupSubject from "../../../shared/Util/PopupSubject";
import "./PreviewFile.scss";

const PreviewFile = ({ file }) => {
  const [fileDetails, setFileDetails] = useState();
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
  return <div>{JSON.stringify(fileDetails)}</div>;
};

export default PreviewFile;
