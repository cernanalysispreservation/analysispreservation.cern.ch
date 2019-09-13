import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

class TextAreaComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Input Label",
      value: "",
      options: {
        emptyValue: "empty value placeholder"
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
            <FormField
              label={
                <span>
                  <span style={{ color: "#000" }}>{this.state.label}</span>
                </span>
              }
              key="FORM_FIELD_SAMPLE"
            >
              <Widgets.textarea
                value={this.state.value}
                onChange={this._onChange}
                options={this.state.options}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("TextArea", module).add("default", () => <TextAreaComponent />);
