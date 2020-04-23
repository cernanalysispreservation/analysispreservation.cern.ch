import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

class WorkflowLogDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box>
        <Heading margin="small" tag="h5">
          {this.props.title}
        </Heading>
        <Box colorIndex="grey-1" pad="small">
          <pre style={{ fontSize: "11px" }}>{this.props.data}</pre>
        </Box>
      </Box>
    );
  }
}

WorkflowLogDisplay.propTypes = {
  title: PropTypes.string,
  data: PropTypes.string
};

export default WorkflowLogDisplay;
