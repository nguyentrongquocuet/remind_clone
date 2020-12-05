import React, { useEffect, useState } from "react";
import AssignmentIcon from "@material-ui/icons/Assignment";
import "./ConnectChild.scss";
import PopupSubject from "../../../shared/Util/PopupSubject";
import Loading from "../../../shared/components/Loading";
import UserService from "../../../services/UserService";
const ConnectChild = () => {
  const copyUrl = (e) => {
    navigator.clipboard.writeText(url).then(
      PopupSubject.next({
        type: "SUCCESS",
        message: "Now you can send the link to your children, cheers!",
        showTime: 4,
      })
    );
  };
  const [url, setUrl] = useState(null);
  useEffect(() => {
    const getUrl = async () => {
      try {
        const response = await UserService.getConnectChildUrl();
        setTimeout(() => {
          setUrl(response.data.url);
        }, 2000);
      } catch (error) {
        PopupSubject.next({
          type: "WARN",
          message: error.response
            ? error.response.data
            : "Something went wrong",
        });
      }
    };
    getUrl();
  }, []);
  return (
    <div className="connect-child center">
      <h1>Connect to your children</h1>
      <p>
        For some reason we can just give you the below url, copy it and send it
        to your kids.
      </p>
      {url ? (
        <div className="copy">
          <code>{url}</code>
          <span>
            <AssignmentIcon onClick={copyUrl} color="primary" />
          </span>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ConnectChild;
