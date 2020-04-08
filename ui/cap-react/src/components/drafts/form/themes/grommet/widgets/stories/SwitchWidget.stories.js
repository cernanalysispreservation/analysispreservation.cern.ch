import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

class SwitchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Input Label",
      value: "",
      options: {
        enumOptions: {
          label: "Choice 1",
          value: "Choice 1"
        }
      }
    };
  }

  // onChange function
  _onChange = value => {
    this.setState({ value: value });
  };

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
            >
              <Widgets.switch
                options={this.state.options}
                schema={{ type: "string" }}
                onChange={this._onChange}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("Switch", module).add("default", () => (
  <SwitchComponent error={null} />
));
