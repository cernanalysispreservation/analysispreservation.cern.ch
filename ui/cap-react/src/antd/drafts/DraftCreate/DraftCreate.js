import React, { useState } from "react";
import PropTypes from "prop-types";
import { Alert, Modal } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import equal from "deep-equal";
import cleanDeep from "clean-deep";

import CreateForm from "../CreateForm";

const DraftCreate = ({ onCancel, open, formData, metadata, history }) => {
  const [form, setForm] = useState(null);

  return (
    <Modal
      onCancel={onCancel}
      open={open}
      title="Create Analysis"
      okText="Start Preserving"
      destroyOnClose
      okButtonProps={{
        onClick: () => {
          form.submit();
        },
      }}
    >
      {history.location.pathname.startsWith("/drafts/") &&
        !equal(cleanDeep(formData), cleanDeep(metadata)) && (
          <Alert
            message="Are you sure you want to leave this page without saving?"
            description="It seems that you have unsaved updated data in your draft"
            type="warning"
            showIcon
          />
        )}
      <CreateForm updateModal={form => setForm(form)} onCancel={onCancel} />
    </Modal>
  );
};

DraftCreate.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  createDraft: PropTypes.func,
  formData: PropTypes.object,
  metadata: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.draftItem.get("formData"),
  metadata: state.draftItem.get("metadata"),
});

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(DraftCreate)
);
