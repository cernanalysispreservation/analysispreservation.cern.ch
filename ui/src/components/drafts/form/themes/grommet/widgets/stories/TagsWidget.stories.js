import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

import TagsWidgetReadMe from "./TagsWidgetReadMe.md";

const label = "Input Label";

class TagsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Tags Input",
      tags: [],
      options: {
        pattern: /\w+$/
      }
    };
  }

  _onChange = value => {
    let arr = this.state.tags.slice();
    arr.push(value);
    this.setState({ tags: arr });
  };

  render() {
    return (
      <Grommet>
        <Box align="center" flex={true} wrap={false}>
          <Box size={{ width: "xlarge" }} pad="large" flex={false} wrap={false}>
            <FormField
              label={
                <span>
                  <span style={{ color: "#000" }}>{label}</span>
                </span>
              }
              key="FORM_FIELD_SAMPLE"
              error={this.props.error}
            >
              <Widgets.tags
                options={this.state.options}
                placeholder={
                  this.props.readonly
                    ? "readonly input"
                    : "Write your tag and press enter..."
                }
                onChange={this._onChange}
                readonly={this.props.readonly}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("Tags Input", module)
  .addParameters({
    readme: {
      sidebar: TagsWidgetReadMe
    }
  })
  .add("default", () => <TagsComponent />)
  .add("readonly", () => <TagsComponent readonly />)
  .add("error", () => <TagsComponent error={"Display Error Message"} />);
