import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

import TextAreaWidgetReadMe from "./TextAreaWidgetReadMe.md";

class TextAreaComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Input Label",
      value: "",
      options: {
        emptyValue: ""
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
              error={this.props.error}
            >
              <Widgets.textarea
                value={this.state.value}
                onChange={this._onChange}
                options={this.state.options}
                readonly={this.props.readonly}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("TextArea", module)
  .addParameters({
    readme: {
      sidebar: TextAreaWidgetReadMe
    }
  })
  .add("default", () => <TextAreaComponent />)
  .add("Read Only", () => <TextAreaComponent readonly />)
  .add("Error", () => <TextAreaComponent error={"Display error message"} />);
