import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Box, FormField, Button, TextInput, Label } from "grommet";

import { createDraft, generalTitleChange } from "../../../actions/drafts";

const CreateAnchor = ({ onClick = null }) => (
  <Button
    label={<span>Save & Continue</span>}
    primary={true}
    onClick={onClick}
  />
);

class CreateDraftSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  _onChange = e => {
    this.props.generalTitleChange(e.target.value);
  };

  _validateFormData() {
    const formData = this.props.formRef.current.props.formData;
    const { errors, errorSchema } = this.props.formRef.current.validate(
      formData
    );

    let e = new Event("save");

    if (errors.length > 0) {
      this.props.formRef.current.onSubmit(e);
      return false;
    } else {
      return true;
    }
  }

  _createDraft(schema_id) {
    if (this._validateFormData())
      this.props.createDraft(this.props.formData, schema_id).catch(() => {
        this._validateFormData();
      });
  }

  render() {
    let group =
      this.props.depositGroups &&
      this.props.depositGroups
        .toJS()
        .filter(dg => dg.deposit_group == this.props.match.params.schema_id);
    if (group && group.length > 0) group = group[0];

    return (
      <Box
        colorIndex="light-2"
        flex={false}
        pad="large"
        justify="end"
        align="stretch"
        alignContent="end"
      >
        <Box margin={{ bottom: "medium" }} flex={false}>
          <Label pad="none"> Start your new {group && group.name} here.</Label>
          <Label pad="none" size="small">
            Provide a title to distinguish it around your drafts
          </Label>
        </Box>

        <Box flex={false}>
          <FormField label="Display Title">
            <TextInput onDOMChange={this._onChange} />
          </FormField>
        </Box>

        <Box margin={{ top: "medium" }}>
          <CreateAnchor
            onClick={this._createDraft.bind(
              this,
              this.props.match.params.schema_id
            )}
          />
        </Box>
      </Box>
    );
  }
}

CreateDraftSidebar.propTypes = {
  match: PropTypes.object.isRequired,
  generalTitleChange: PropTypes.func.isRequired,
  depositGroups: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    depositGroups: state.auth.getIn(["currentUser", "depositGroups"]),
    general_title: state.auth.getIn(["current_item", "general_title"]),
    formData: state.drafts.getIn(["current_item", "formData"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    generalTitleChange: title => dispatch(generalTitleChange(title)),
    createDraft: (data, schema) => dispatch(createDraft(data, schema))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDraftSidebar);
