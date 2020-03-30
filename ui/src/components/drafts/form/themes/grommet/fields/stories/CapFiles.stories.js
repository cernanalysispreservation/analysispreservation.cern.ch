import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { Provider } from "react-redux";
import store from "../../../../../../../store/configureStore";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import FormField from "grommet/components/FormField";

import fields from "../index";
import PropTypes from "prop-types";

class CapFileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {}
    };
  }

  // _onChange = value => {};

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
              <FormField>
                <fields.CapFiles
                  onChange={this._onChange}
                  formData={this.props.formData}
                />
              </FormField>
            </Box>
          </Box>
        </Provider>
      </Grommet>
    );
  }
}

CapFileComponent.propTypes = {
  formData: PropTypes.object
};

storiesOf("Cap Files", module).add("Default message", () => (
  <CapFileComponent />
));
