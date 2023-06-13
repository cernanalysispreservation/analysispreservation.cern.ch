import PropTypes from "prop-types";
import { Button, Row, Spin } from "antd";

const Loading = ({ error, retry, timedOut, pastDelay }) => {
  if (error) {
    return (
      <Row style={{ height: "100%" }} align="middle" justify="center">
        There is an error loading the component
        <Button type="primary" onClick={retry}>
          Retry Loading
        </Button>
      </Row>
    );
  }

  if (timedOut) {
    return (
      <Row style={{ height: "100%" }} align="middle" justify="center">
        Loading timed out
        <Button type="primary" onClick={retry}>
          Retry Loading
        </Button>
      </Row>
    );
  }

  if (pastDelay) {
    return (
      <Row style={{ height: "100%" }} align="middle" justify="center">
        <Spin size="large" />
      </Row>
    );
  }

  return null;
};

Loading.propTypes = {
  error: PropTypes.object,
  retry: PropTypes.func,
  timedOut: PropTypes.bool,
  pastDelay: PropTypes.bool,
};

export default Loading;
