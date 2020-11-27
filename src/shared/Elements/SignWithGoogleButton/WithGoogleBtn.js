import React from "react";
import Button from "../Button";
import "./WithGoogleBtn.scss";
const WithGoogleBtn = ({ className }) => {
  return (
    <Button
      className={`with-google ${className}`}
      onClick={(e) =>
        (window.location.href = process.env.REACT_APP_CLIENT_GOOGLE_AUTH_URL)
      }
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
