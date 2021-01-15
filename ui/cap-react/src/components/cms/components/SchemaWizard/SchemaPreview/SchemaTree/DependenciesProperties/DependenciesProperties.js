import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Box from "grommet/components/Box";

import ObjectFieldTemplate from "../ObjectFieldTemplate";
import ArrayFieldTemplate from "../ArrayFieldTemplate";
import FieldTemplate from "../FieldTemplate";
import TextWidget from "../TextWidget";
import { _validate } from "../utils/validate";
const widgets = {
  TextWidget: TextWidget
};
import Form from "react-jsonschema-form";

const DependenciesProperties = ({ path, current }) => {
  let currentProps = path && current.getIn([...path]).toJS();

  // check whether there are dependencies for this specific path
  // if not then return null, if yes return
  if (!currentProps) return null;
  if (!currentProps.dependencies) return null;

  return (
    <Box>
      <Box colorIndex="light-1" pad="small">
        Object Dependencies
      </Box>
      Analysis Reuse Mode
      <Box>
        <Box>
          <Form
            schema={currentProps.dependencies.analysis_reuse_mode}
            uiSchema={{}}
            showErrorList={false}
            formData={{}}
            tagName="div"
            noHtml5Validate={true}
            validate={_validate}
            widgets={widgets}
            FieldTemplate={FieldTemplate}
            // ObjectFieldTemplate={ObjectFieldTemplate}
            ArrayFieldTemplate={ArrayFieldTemplate}
            formContext={{
              schema: [...path],
              uiSchema: [...path],
              dependencyForm: true
            }}
          >
            <span />
          </Form>
        </Box>
      </Box>
    </Box>
  );
};

DependenciesProperties.propTypes = {
  path: PropTypes.array,
  current: PropTypes.object
};

const mapStateToProps = state => ({
  current: state.schemaWizard.getIn(["current", "schema"])
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DependenciesProperties);
