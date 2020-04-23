import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import PropTypes from "prop-types";
import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

import SelectWidgetReadMe from "./SelectWidgetReadMe.md";

class SelectComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Select Input",
      value: "",
      readonly: this.props.readonly,
      options: {
        inline: this.props.inline,
        multiple: this.props.multiple,
        enumOptions: [
          {
            label: "Choice 1",
            value: "Choice 1"
          },
          {
            label: "Choice 2",
            value: "Choice 2"
          },
          {
            label: "Choice 3",
            value: "Choice 3"
          },
          {
            label: "Choice 4",
            value: "Choice 4"
          }
        ]
      }
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
            >
              <Widgets.select
                options={this.state.options}
                value={this.state.value}
                onChange={e => this.updateValue(e)}
                // eslint-disable-next-line react/no-unknown-property
                readonly={this.state.readonly}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

SelectComponent.propTypes = {
  readonly: PropTypes.bool,
  inline: PropTypes.bool,
  multiple: PropTypes.bool
};

storiesOf("Select Button", module)
  .addParameters({
    readme: {
      sidebar: SelectWidgetReadMe
    }
  })
  .add("Multiple", () => <SelectComponent />)
  .add("Inline", () => <SelectComponent inline />)
  .add("ReadOnly", () => <SelectComponent readonly />);
