import React from "react";

import { Provider } from "react-redux";
import store from "../../store/configureStore";

import Layer from "grommet/components/Layer";

import CreateForm from "./components/CreateForm";

import PropTypes from "prop-types";

class DraftCreate extends React.Component {
  render() {
    return (
      <Layer overlayClose closer flush onClose={this.props.toggle}>
        <Provider store={store}>
          <CreateForm />
        </Provider>
      </Layer>
    );
  }
}

DraftCreate.propTypes = {
  contentTypes: PropTypes.object,
  toggle: PropTypes.func,
  createDraft: PropTypes.func,
  formData: PropTypes.object,
  metadata: PropTypes.object
};

export default DraftCreate;
