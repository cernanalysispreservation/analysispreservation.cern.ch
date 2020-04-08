import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

import fields from "../index";

class AccordionJSONEditorStorie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {}
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
              <fields.accordion_jsoneditor
                title="JSON editor Accordion title"
                description="JSON editor Accordion Description"
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

storiesOf("JSON Editor Accordion", module).add("Default", () => (
  <AccordionJSONEditorStorie />
));
