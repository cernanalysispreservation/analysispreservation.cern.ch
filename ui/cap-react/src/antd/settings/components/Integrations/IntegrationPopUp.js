import PropTypes from "prop-types";
import OauthPopup from "../OAuthPopup";
import { Button } from "antd";
import { ApiOutlined } from "@ant-design/icons";

const IntegrationPopUp = ({ service, loginCallBack }) => {
  let _url =
    process.env.NODE_ENV === "development"
      ? `http://localhost:5000/auth/connect/${service}?ui=1`
      : `/api/auth/connect/${service}?ui=1`;

  return (
    <OauthPopup url={_url} loginCallBack={loginCallBack}>
      <Button type="primary" icon={<ApiOutlined />}>
        Connect
      </Button>
    </OauthPopup>
  );
};

IntegrationPopUp.propTypes = {
  service: PropTypes.string,
  loginCallBack: PropTypes.func,
};

export default IntegrationPopUp;
