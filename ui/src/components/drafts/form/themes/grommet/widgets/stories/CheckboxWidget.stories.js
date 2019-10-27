import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

class CheckBoxComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Input Label",
      options: {
        enumOptions: [
          {
            label: "Choice 1",
            value: "Choice 1"
          },
          {
            label: "Choice 2",
            value: "Choice 2"
          }
        ]
      }
    };
  }

  // TODO: figure out the onChange method inside the CheckBox Component
  updateField = value => {};

  render() {
    return (
      <Grommet>
        <Box align="center" flex={true} wrap={false}>
          <Box size={{ width: "xlarge" }} pad="large" flex={false} wrap={false}>
            <FormField
              label={
                <span>
                  <span style={{ color: "#000" }}>{this.state.label}</span>
                </span>
              }
              key="FORM_FIELD_SAMPLE"
              error={this.props.error}
            >
              <Widgets.checkboxes
                options={this.state.options}
                value="Choice 1"
                onChange={e => this.updateField(e)}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("CheckBox", module)
  .add("default", () => <CheckBoxComponent error={null} />)
  .add("error", () => <CheckBoxComponent error={"Display error message"} />);
