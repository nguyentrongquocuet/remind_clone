import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../../Util/context";
import SupportPathName from "../../Util/SupportPathName";
console.log(SupportPathName);
const RedirectPage = ({ redirect }) => {
  const { location, push } = useHistory();
  console.log(location);
  const { dispatch } = useContext(Context);
  useEffect(() => {
    if (redirect) {
      push(redirect);
      dispatch({
        type: "CLEAR_REDIRECT_URL",
      });
    } else {
      const pathPrefix = location.pathname.match(/^\/[^/]+/)[0];
      console.log(pathPrefix);
      if (SupportPathName[pathPrefix]) {
        dispatch({
          type: "SET_REDIRECT_URL",
          payload: {
            url: location.pathname,
          },
        });
      }
      push("/login");
    }
  }, [location, redirect]);
  return <div>redirect page</div>;
};

export default RedirectPage;
