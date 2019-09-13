import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

import fields from "../index";

const formData = {
  project: "CAP",
  location: "CERN",
  country: "Switzerland"
};

class JSONEditorFieldStorie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.formData
    };
  }

  _onChange = value => {
    this.setState({ formData: value });
  };

  render() {
    return (
      <Grommet>
        <Box align="center" flex={true} wrap={false}>
          <Box size={{ width: "xlarge" }} pad="large" flex={false} wrap={false}>
            <FormField>
              <fields.jsoneditor
                formData={this.state.formData}
                onChange={this._onChange}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("JSON Editor Field", module)
  .add("Empty", () => <JSONEditorFieldStorie />)
  .add("With Data", () => <JSONEditorFieldStorie formData={formData} />);
