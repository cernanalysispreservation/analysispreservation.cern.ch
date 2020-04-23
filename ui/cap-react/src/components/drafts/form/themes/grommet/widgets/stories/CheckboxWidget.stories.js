import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

import PropTypes from "prop-types";

import CheckboxWidgetReadMe from "./CheckboxWidgetReadMe.md";

class CheckBoxComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "CheckBox Input",
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

  selectValue(value, selected, all) {
    const at = all.indexOf(value);
    const updated = selected.slice(0, at).concat(value, selected.slice(at));
    // As inserting values at predefined index positions doesn't work with empty
    // arrays, we need to reorder the updated selection to match the initial order
    return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
  }

  deselectValue(value, selected) {
    return selected.filter(v => v !== value);
  }

  _onChange = () => {
    // const all = this.state.options.enumOptions.map(({ value }) => value);
    // if (event.target.checked) {
    //   props.onChange(selectValue(event.target.value, props.value, all));
    // } else {
    //   props.onChange(deselectValue(event.target.value, props.value));
    // }
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
              <Widgets.checkboxes
                options={this.state.options}
                value="Choice 1"
                // eslint-disable-next-line react/no-unknown-property
                readonly={this.props.disabled}
                onChange={this._onChange}
                selectValue={this.selectValue}
                deselectValue={this.deselectValue}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

CheckBoxComponent.propTypes = {
  error: PropTypes.object,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool
};

storiesOf("CheckBox", module)
  .addParameters({
    readme: {
      sidebar: CheckboxWidgetReadMe
    }
  })
  .add("default", () => <CheckBoxComponent />)
  .add("selected", () => <CheckBoxComponent checked />)
  .add("disabled", () => <CheckBoxComponent disabled />)
  .add("error", () => <CheckBoxComponent error={"Display error message"} />);
