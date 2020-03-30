import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

import SwitchWidgetReadMe from "./SwitchWidgetReadMe.md";

class SwitchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Switch Input",
      value: ""
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
                schema={{ type: "string" }}
                onChange={this._onChange}
                formData={this.props.checked}
                readonly={this.props.readonly}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("Switch", module)
  .addParameters({
    readme: {
      sidebar: SwitchWidgetReadMe
    }
  })
  .add("Default", () => <SwitchComponent />)
  .add("Selected", () => <SwitchComponent checked="true" />)
  .add("ReadOnly", () => <SwitchComponent readonly />);
