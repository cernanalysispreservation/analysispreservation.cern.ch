import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";

import CreateForm from "../CreateForm";

const DraftCreate = ({ onCancel, visible, createDraft }) => {
  const [isDepositGroupSelected, setIsDepositGroupSelected] = useState(null);

  const closeModal = () => {
    onCancel();
    setIsDepositGroupSelected(null);
  };

  return (
    <Modal
      onCancel={closeModal}
      visible={visible}
      title="Create Analysis"
      okText="Start Preserving"
      destroyOnClose
      okButtonProps={{
        disabled: !isDepositGroupSelected,
        onClick: () => createDraft({}, isDepositGroupSelected)
      }}
    >
      <CreateForm updateModal={val => setIsDepositGroupSelected(val)} />
    </Modal>
  );
};

DraftCreate.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func
};

export default DraftCreate;
