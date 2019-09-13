import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { Provider } from "react-redux";
import store from "../../../../../../../store/configureStore";

import Widgets from "../../widgets";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

class TextComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Input Label",
      value: ""
    };
  }

  _onChange = value => {
    this.setState({ value: value });
  };

  render() {
    return (
      <Grommet>
        <Provider store={store}>
          <Box align="center" flex={true} wrap={false}>
            <Box
              size={{ width: "xlarge" }}
              pad="large"
              flex={false}
              wrap={false}
            >
              <FormField
                label={
                  <span>
                    <span style={{ color: "#000" }}>{this.state.label}</span>
                  </span>
                }
                key="FORM_FIELD_SAMPLE"
                error={this.props.error}
              >
                <Widgets.text
                  value={this.state.value}
                  onChange={this._onChange}
                />
              </FormField>
            </Box>
          </Box>
        </Provider>
      </Grommet>
    );
  }
}

storiesOf("Text", module)
  .add("default", () => <TextComponent />)
  .add("error", () => <TextComponent error="Display error message" />);
