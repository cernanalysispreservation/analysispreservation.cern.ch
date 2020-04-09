import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

import fields from "../index";

class ImportDataFieldStories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      uiSchema: {
        "ui:options": {
          query: "/api/deposits/?type=cms-questionnaire-v0.0.1"
        }
      }
    };
  }

  _onChange = value => {
    this.setState({ value: value });
  };

  render() {
    return (
      <Grommet>
        <Box align="center" flex={true} wrap={false}>
          <Box size={{ width: "xlarge" }} pad="large" flex={false} wrap={false}>
            <FormField>
              <fields.ImportDataField
                uiSchema={this.state.uiSchema}
                onChange={value => this._onChange(value)}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("Import Data Field", module).add("Default", () => (
  <ImportDataFieldStories />
));
