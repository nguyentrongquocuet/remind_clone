import React, { useEffect, useState } from "react";
import { SettingService } from "services/SettingService";
import Button from "../Button";
import "./WithGoogleBtn.scss";
const WithGoogleBtn = ({ className }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    const getUrl = async () => {
      const { data } = await SettingService.getGoogleLoginUrl();
      const u = data.google_login_url;
      setUrl(u);
    };
    getUrl();
  }, []);
  return (
    <Button
      className={`with-google ${className}`}
      onClick={(e) => {
        if (url) window.location.href = url;
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        alt="Google"
      />
      With Google
    </Button>
  );
};

export default WithGoogleBtn;
