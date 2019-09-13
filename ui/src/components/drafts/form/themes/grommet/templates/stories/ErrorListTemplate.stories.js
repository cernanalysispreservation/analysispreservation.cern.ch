import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import ErrorListTemplate from "../ErrorListTemplate";

const single = [
  {
    stack: "Error Message"
  }
];

const multiple = [
  {
    stack: "1st Error Message"
  },
  {
    stack: "2nd Error Message"
  }
];

class ErrorListTemplateStorie extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Grommet>
        <Box align="center" flex={true} wrap={false}>
          <Box size={{ width: "xlarge" }} pad="large" flex={false} wrap={false}>
            <ErrorListTemplate errors={this.props.errors} />
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("Error List Template", module)
  .add("Single Error Message", () => (
    <ErrorListTemplateStorie errors={single} />
  ))
  .add("Multiple Error Messages", () => (
    <ErrorListTemplateStorie errors={multiple} />
  ));
