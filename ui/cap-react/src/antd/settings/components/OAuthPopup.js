import { useEffect } from "react";
import PropTypes from "prop-types";

const OAuthPopup = ({
  loginCallBack,
  url,
  title = "",
  width = 500,
  height = 500,
  children,
}) => {
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    window["loginCallBack"] = () => {
      if (loginCallBack) loginCallBack(urlParams.get("next"));
      return null;
    };
  }, []);

  const createPopup = () => {
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    window.open(
      url,
      title,
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

    return <div onClick={createPopup}> {children} </div>;
};

OAuthPopup.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
  width: PropTypes.number,
  height: PropTypes.number,
  url: PropTypes.string,
  loginCallBack: PropTypes.func,
};

export default OAuthPopup
