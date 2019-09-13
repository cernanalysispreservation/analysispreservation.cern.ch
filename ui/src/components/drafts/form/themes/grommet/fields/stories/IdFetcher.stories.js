import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import fields from "../index";

const schema = {
  title: "Custom Title"
};

class IdFetcherStorie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        source: false
      }
    };
  }

  render() {
    return (
      <Grommet>
        <Box align="center" flex={true} wrap={false}>
          <Box size={{ width: "xlarge" }} pad="large" flex={false} wrap={false}>
            <fields.idFetcher
              formData={this.state.formData}
              schema={this.props.schema}
              rawDescription={this.props.rawDescription}
            />
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("ID Fetcher", module)
  .add("Default", () => <IdFetcherStorie />)
  .add("Custom", () => (
    <IdFetcherStorie schema={schema} rawDescription="Custom Description" />
  ));
