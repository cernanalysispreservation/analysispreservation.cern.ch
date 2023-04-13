import { PureComponent } from "react";
import PropTypes from "prop-types";

export default class OauthPopup extends PureComponent {
  constructor(props) {
    super(props);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    window["loginCallBack"] = function() {
      if (props.loginCallBack) props.loginCallBack(urlParams.get("next"));
      return null;
    };
  }
  createPopup = () => {
    const { url, title = "", width = 500, height = 500 } = this.props;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    this.externalWindow = window.open(
      url,
      title,
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  render() {
    return (
      <div onClick={this.createPopup} style={{ textAlign: "center" }}>
        {this.props.children}
      </div>
    );
  }
}

OauthPopup.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
  width: PropTypes.number,
  height: PropTypes.number,
  url: PropTypes.string,
  loginCallBack: PropTypes.func,
};
