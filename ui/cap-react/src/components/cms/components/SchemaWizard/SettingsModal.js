import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../partials/Modal";
import Anchor from "../../../partials/Anchor";
import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import { connect } from "react-redux";
import { AiOutlineDownload } from "react-icons/ai";
import CleanForm from "../../../drafts/form/CleanForm";
import {configSchema} from "../utils/schemas";
import { updateSchemaConfig } from "../../../../actions/schemaWizard";
import Button from "../../../partials/Button";

const SettingsModal = ({ show, onClose, selected, schema, uiSchema, configs, updateSchemaConfig }) => {
    let formRef = React.createRef();

    const _getSchema = () => {
    const fileData = JSON.stringify(
      {
        schema: schema.toJS(),
        uiSchema: uiSchema.toJS()
      },
      null,
      4
    );

    const blob = new Blob([fileData], { type: "text/json" });
    const url = URL.createObjectURL(blob);

    return url;
  };

  const _updateConfigs = (data) => {
    let { formData, errors } = data;
    if (errors.length > 0) return;

    updateSchemaConfig(formData)
  }
  return (
    show && (
      <Modal onClose={onClose} separator title="Form Actions">
        <Box pad="small">
          {selected &&
            selected.id && (
              <Box>
                <Anchor
                  download={
                    schema.get("title")
                      ? `${schema.get("title").replace(/\s+/g, "_")}.json`
                      : `schema_${selected.id}.json`
                  }
                  href={_getSchema()}
                  align={null}
                  justify={null}
                >
                  <Box flex justify="center" direction="row">
                    <AiOutlineDownload size={22} style={{ margin: "0 10px" }} />
                    <Paragraph margin="none">Export Schema</Paragraph>
                  </Box>
                </Anchor>
              </Box>
            )}
            <CleanForm formRef={f => (formRef = f)} {...configSchema} formData={configs} onSubmit={_updateConfigs}>
                  <Box pad="small">
                    <Button type="submit" text="Save" onClick={() => formRef.submit()}/>
                  </Box>
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
  const _path = state.schemaWizard.getIn(["field", "path"]);
  const _uiPath = state.schemaWizard.getIn(["field", "uiPath"]);
  return {
    selected: state.schemaWizard.get("selected"),
    schema: state.schemaWizard.getIn(["current", "schema", ...(_path || [])]),
    uiSchema: state.schemaWizard.getIn([
      "current",
      "uiSchema",
      ...(_uiPath || [])
    ]),
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
