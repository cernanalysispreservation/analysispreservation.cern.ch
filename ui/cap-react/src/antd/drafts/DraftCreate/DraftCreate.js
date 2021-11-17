import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";

import CreateForm from "../CreateForm";

const DraftCreate = ({ onCancel, visible }) => {
  const [form, setForm] = useState(null);

  return (
    <Modal
      onCancel={onCancel}
      visible={visible}
      title="Create Analysis"
      okText="Start Preserving"
      destroyOnClose
      okButtonProps={{
        onClick: () => {
          form.submit();
        }
      }}
    >
      <CreateForm updateModal={form => setForm(form)} onCancel={onCancel} />
    </Modal>
  );
};

DraftCreate.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  createDraft: PropTypes.func
};

export default DraftCreate;
