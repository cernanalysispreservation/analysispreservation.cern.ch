import PropTypes from "prop-types";
import { Button, Row, Typography } from "antd";

const Loading = ({ error, retry, timedOut, pastDelay }) => {
  if (error) {
    return (
      <Row>
        There is an error loading component
        <Button type="primary" onClick={retry}>
          Retry Loading
        </Button>
      </Row>
    );
  }

  if (timedOut) {
    return (
      <Row>
        Loading takes more time
        <Button type="primary" onClick={retry}>
          Retry Loading
        </Button>
      </Row>
    );
  }

  if (pastDelay) {
    return (
      <Row>
        <Typography.Text>Loading...</Typography.Text>
      </Row>
    );
  }

  return null;
};

Loading.propTypes = {
  error: PropTypes.object,
  retry: PropTypes.func,
  timedOut: PropTypes.bool,
  pastDelay: PropTypes.bool
};

export default Loading;
