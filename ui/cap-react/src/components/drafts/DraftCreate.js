import React from "react";

import Layer from "grommet/components/Layer";

import CreateForm from "./components/CreateForm";

import PropTypes from "prop-types";

class DraftCreate extends React.Component {
  render() {
    return (
      <Layer overlayClose closer flush onClose={this.props.toggle}>
        <CreateForm />
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
