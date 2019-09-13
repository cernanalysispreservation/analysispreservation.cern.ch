import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

class RadioComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Input Label",
      selected: "",
      options: {
        enumOptions: [
          {
            label: "Choice 1",
            value: "Choice 1"
          }
        ]
      }
    };
  }

  _onChange = value => {
    this.setState({ selected: value });
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
              <Widgets.radio
                options={this.state.options}
                value={this.props.value}
                onChange={this._onChange}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("Radio", module)
  .add("default", () => <RadioComponent error={null} />)
  .add("selected", () => <RadioComponent error={null} value="Choice 1" />)
  .add("error", () => <RadioComponent error={"Display error message"} />);
