import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../partials/Modal";
import Anchor from "../../../partials/Anchor";
import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import { connect } from "react-redux";
import { AiOutlineDownload } from "react-icons/ai";

const SettingsModal = ({ show, onClose, selected, schema, uiSchema }) => {
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
    ])
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsModal);
