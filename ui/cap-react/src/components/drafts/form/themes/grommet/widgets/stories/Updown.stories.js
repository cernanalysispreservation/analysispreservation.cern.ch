import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

import UpDownWidgetReadMe from "./UpDownWidgetReadMe.md";

class UpDownComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      label: "Input Label",
      emptyValue: "em"
    };
  }

  updateValue = value => {
    this.setState({ value });
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
              error={this.props.error}
            >
              <Widgets.updown
                options={this.state.options}
                value={this.state.value}
                onChange={e => this.updateValue(e)}
                readonly={this.props.readonly}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("UpDown", module)
  .addParameters({
    readme: {
      sidebar: UpDownWidgetReadMe
    }
  })
  .add("Default", () => <UpDownComponent />)
  .add("Read Only", () => <UpDownComponent readonly />)
  .add("Error", () => <UpDownComponent error={"Display error message"} />);
