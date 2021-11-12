import React from "react";

// import Modal from "../partials/Modal";
import { Modal } from "antd";

import CreateForm from "./components/CreateForm";

import PropTypes from "prop-types";

class DraftCreate extends React.Component {
  render() {
    return (
      <Modal
        onCancel={this.props.onCancel}
        visible={this.props.visible}
        title="Create Analysis"
        footer={null}
      >
        <CreateForm />
      </Modal>
    );
  }
}

DraftCreate.propTypes = {
  contentTypes: PropTypes.object,
  toggle: PropTypes.func,
  formData: PropTypes.object,
  metadata: PropTypes.object
};

export default DraftCreate;
