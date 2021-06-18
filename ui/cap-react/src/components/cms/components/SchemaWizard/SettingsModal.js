import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../partials/Modal";
import Box from "grommet/components/Box";
import { connect } from "react-redux";
import CleanForm from "../../../drafts/form/CleanForm";
import { configSchema } from "../utils/schemas";
import { updateSchemaConfig } from "../../../../actions/schemaWizard";

const SettingsModal = ({ show, onClose, configs, updateSchemaConfig }) => {
  const _updateConfigs = data => {
    let { formData } = data;
    updateSchemaConfig(formData);
  };

  return (
    show && (
      <Modal onClose={onClose} separator title="Form Actions">
        <Box pad="small">
          <CleanForm
            {...configSchema}
            formData={configs.toJS()}
            onChange={_updateConfigs}
          >
            <span />
          </CleanForm>
        </Box>
      </Modal>
    )
  );
};

SettingsModal.propTypes = {
  onClose: PropTypes.func,
  show: PropTypes.bool,
  selected: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

const mapStateToProps = state => {
  return {
    configs: state.schemaWizard.get("config")
  };
};

function mapDispatchToProps(dispatch) {
  return {
    updateSchemaConfig: config => dispatch(updateSchemaConfig(config))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsModal);
