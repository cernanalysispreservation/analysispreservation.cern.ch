import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Title from "grommet/components/Title";
import Button from "grommet/components/Button";

import { rerunPublished } from "../../actions/published";

import CleanForm from "../drafts/form/CleanForm";

const schema = {
  type: "object",
  properties: {
    input_parameters: {
      title: "Input Parameters",
      type: "object",
      properties: {
        workflow_id: {
          title: "Workflow Id",
          type: "string"
        },
        ali_physics: {
          title: "AliPhysics",
          type: "string"
        }
      }
    }
  }
};

const uiSchema = {
  input_parameters: {
    ali_physics: {
      "ui:readonly": true
    }
  }
};

const formData = {
  input_parameters: {
    ali_physics: "vAN-20180614-1"
  }
};

class RerunPublished extends React.Component {
  render() {
    let { id } = this.props.match.params;
    return (
      <Box size={{ width: { min: "large" } }} flex={true} wrap={false}>
        <Box align="center" justify="center">
          <Title>Rerun your analysis</Title>
        </Box>
        <Box align="center" flex={true} wrap={false}>
          <Box size={{ width: "xlarge" }} pad="large" flex={false} wrap={false}>
            <CleanForm
              schema={schema}
              uiSchema={uiSchema}
              onSubmit={data => {
                this.props.rerunPublished(
                  data.formData.input_parameters.workflow_id,
                  id
                );
              }}
              formData={formData}
            >
              <Box margin={{ top: "small" }}>
                <Button label="Run On REANA" type="submit" primary={true} />
              </Box>
            </CleanForm>
          </Box>
        </Box>
      </Box>
    );
  }
}

RerunPublished.propTypes = {
  match: PropTypes.object,
  rerunPublished: PropTypes.func
};

function mapStateToProps(state) {
  return {
    published: state.published.getIn(["current_item", "data"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rerunPublished: (workflow_id, id) =>
      dispatch(rerunPublished(workflow_id, id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RerunPublished);
