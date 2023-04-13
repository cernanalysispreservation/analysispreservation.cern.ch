import PropTypes from "prop-types";
import { Result, Button } from "antd";
import { withRouter } from "react-router-dom";

const Error = ({
  history,
  error = {
    message: "Page was not Found",
    status: "404"
  }
}) => {
  const getMessage = () => {
    const choices = {
      404: "The page your are looking for, either was removed <br /> or<br /> the url path is not correct",
      403: "Your account doesn't have permissions to access the content of this page",
      500: "Currently our service can not provide any information due to a problem. Please try again later"
    };

    return choices[error.status];
  };
  const getTitle = () => {
    const choices = {
      403: "Permission Required",
      404: "Page was not Found",
      500: "Network Error",
      410: "PID has been deleted."
    };
    return choices[error.status];
  };
  return (
    <Result
      status={error.status}
      title={getTitle()}
      subTitle={error.message || getMessage()}
      extra={
        <Button type="primary" onClick={() => history.push("/")}>
          Home
        </Button>
      }
    />
  );
};

Error.propTypes = {
  error: PropTypes.object,
  history: PropTypes.object,
  message: PropTypes.string,
  status: PropTypes
};

export default withRouter(Error);
