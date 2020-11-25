import React from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import Box from "grommet/components/Box";
import FormUploadIcon from "grommet/components/icons/base/FormUpload";
import { Paragraph } from "grommet";
import cogoToast from "cogo-toast";
import { connect } from "react-redux";
import { initSchemaWizard } from "../../../../actions/schemaWizard";

const DropZoneForm = props => {
  const isfileJson = filename => {
    const extension = filename.substr(filename.lastIndexOf(".") + 1);
    if (!/(json)$/gi.test(extension)) {
      return false;
    } else {
      return extension;
    }
  };

  return (
    <Box>
      <Dropzone
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          height: "100px",
          padding: "30px 10px",
          border: "2px dotted rgba(0, 0, 0, 0.25)",
          borderRadius: "4px",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          cursor: "pointer"
        }}
        multiple={false}
        onDrop={file => {
          if (file.length > 0) {
            const acceptedFile = isfileJson(file[0].name);

            if (acceptedFile) {
              let reader = new FileReader();
              reader.onload = function(event) {
                const newSchema = JSON.parse(event.target.result);
                if (
                  newSchema["deposit_schema"] &&
                  newSchema["deposit_options"]
                ) {
                  props.initWizard(newSchema);
                } else {
                  cogoToast.error(
                    "Your json should include a deposit_schema and a deposit_option key",
                    {
                      position: "top-center",
                      heading: "Missing Keys",
                      bar: { size: "0" },
                      hideAfter: 3
                    }
                  );
                }
              };
              reader.readAsText(file[0]);
            } else {
              cogoToast.error("Your file format should be json", {
                position: "top-center",
                bar: { size: "0" },
                hideAfter: 3,
                heading: "File Format"
              });
            }
          }
        }}
      >
        <Box flex={false} direction="row" align="center">
          <FormUploadIcon size="small" />
          <Paragraph margin="none">Browse files</Paragraph>
        </Box>
        <Paragraph margin="small">OR</Paragraph>
        <Paragraph margin="none">Drop your JSON file here</Paragraph>
      </Dropzone>
    </Box>
  );
};

DropZoneForm.propTypes = {
  initWizard: PropTypes.func
};
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  initWizard: data => dispatch(initSchemaWizard(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropZoneForm);
