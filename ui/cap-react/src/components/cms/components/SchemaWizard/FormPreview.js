import React from "react";
import { PropTypes } from "prop-types";

import CleanForm from "../../../drafts/form/CleanForm";
import { transformSchema } from "../../../drafts/DraftEditor";
import GuidelinesPopUp from "./GuidelinesPopUp";

import { shoudDisplayGuideLinePopUp } from "../utils/common";

class FormPreview extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return shoudDisplayGuideLinePopUp(this.props.schema) ? (
      <GuidelinesPopUp />
    ) : (
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
