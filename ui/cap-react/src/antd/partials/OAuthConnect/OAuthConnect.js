import { PureComponent } from "react";
export default class OAuthConnect extends PureComponent {
  componentDidMount() {
    setTimeout(() => {
      if (window.opener) {
        window.opener.focus();

        if (window.opener.loginCallBack) {
          window.opener.loginCallBack();
        }
      }
      window.close();
    }, 3000);
  }

  componentWillUnmount() {
    if (this.externalWindow) {
      this.externalWindow.close();
    }
  }

  render() {
    return <div>Connected or not window is closing</div>;
  }
}
