// import * as React from 'react'
import React from "react";

export default class OauthPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    window["loginCallBack"] = function() {
      if (props.loginCallBack) props.loginCallBack();
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
    return <div onClick={this.createPopup}> {this.props.children} </div>;
  }
}
