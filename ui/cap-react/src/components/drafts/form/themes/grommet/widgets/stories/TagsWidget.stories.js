import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

const label = "Input Label";
const options = {
  enumOptions: [
    {
      label: "Choice 1",
      value: "Choice 1"
    }
  ]
};

class TagsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Input Label",
      tags: [],
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
            >
              <Widgets.tags
                options={options}
                placeholder="Write your tag and press enter..."
                onChange={this._onChange}
              />
            </FormField>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

storiesOf("Tags", module).add("default", () => <TagsComponent error={null} />);
