import React from "react";
import { PropTypes } from "prop-types";

import CleanForm from "../../../drafts/form/CleanForm";
import { transformSchema } from "../../../drafts/DraftEditor";

class FormPreview extends React.Component {
  render() {
    return (
      <CleanForm
        schema={transformSchema(this.props.schema.toJS())}
        uiSchema={this.props.uiSchema.toJS()}
        formData={{}}
      >
        <span />
      </CleanForm>
    );
  }
}

FormPreview.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

export default FormPreview;
