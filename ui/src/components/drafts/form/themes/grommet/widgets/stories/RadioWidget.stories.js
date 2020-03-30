import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";
import PropTypes from "prop-types";

import RadioWidgetReadMe from "./RadioWidgetReadMe.md";

class RadioComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Radio Input",
      selected: this.props.value,
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
                value={this.state.selected}
                onChange={this._onChange}
                readonly={this.props.disabled}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

RadioComponent.propTypes = {
  error: PropTypes.object,
  value: PropTypes.bool,
  disabled: PropTypes.bool
};

storiesOf("Radio Button", module)
  .addParameters({
    readme: {
      sidebar: RadioWidgetReadMe
    }
  })
  .add("default", () => <RadioComponent />)
  .add("selected", () => <RadioComponent value="Choice 1" />)
  .add("disabled", () => <RadioComponent disabled />)
  .add("error", () => <RadioComponent error={"Display error message"} />);
