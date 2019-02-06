import React from "react";
import PropTypes from "prop-types";

import Button from "grommet/components/Button";
import Meter from "grommet/components/Meter";

const WorkflowStatus = props =>
  props.status && props.status.status === "finished" ? (
    <Button onClick={props.toggle} label="Logs" />
  ) : (
    <Meter
      value={
        (props.status.progress.finished.total /
          props.status.progress.total.total) *
        100
      }
    />
  );

WorkflowStatus.propTypes = {
  status: PropTypes.object,
  toggle: PropTypes.func
};

export default WorkflowStatus;
