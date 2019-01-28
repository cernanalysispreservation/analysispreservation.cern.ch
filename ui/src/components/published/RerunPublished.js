import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";
import Title from "grommet/components/Title";
import Button from "grommet/components/Button";
import Select from "grommet/components/Select";
import FormField from "grommet/components/FormField";
import CheckBox from "grommet/components/CheckBox";

import { rerunPublished, REANACreateWorkflow } from "../../actions/published";

import CleanForm from "../drafts/form/CleanForm";

const schema = {
  type: "object",
  properties: {
    reana_yaml: {
      title: "REANA YAML",
      type: "object"
    },
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
  reana_yaml: {
    title: "REANA YAML",
    "ui:field": "jsoneditor"
  },
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
  constructor(props) {
    super(props);

    this.state = {
      platform: "reana",
      workflow: null,
      autostart: true
    };
  }

  selectWorkflow = event => {
    let value = event.target.value;

    this.setState({ workflow: event.option.value });
  };

  runWorkflow = () => {
    let { id } = this.props.match.params;
    console.log("runWorkflow::", id);
    if (this.state.workflow && id)
      this.props.REANACreateWorkflow(this.state.workflow, id);
  };

  render() {
    let { id } = this.props.match.params;

    let current_workflows = this.props.published.metadata.workflows.map(
      workflow =>
        workflow.workflow_title
          ? { label: workflow.workflow_title, value: workflow }
          : "Unamed"
    );
    return (
      <Layer
        align="center"
        overlayClose={true}
        closer={true}
        onClose={() => this.props.history.goBack()}
      >
        <Box
          size={{ width: { min: "large" } }}
          pad="medium"
          flex={true}
          wrap={false}
        >
          <Box align="center" justify="center">
            <Title>Start a workflow</Title>
          </Box>
          <Box align="center" flex={true} wrap={false}>
            <Box
              size={{ width: "xlarge" }}
              pad="large"
              flex={false}
              wrap={false}
            >
              {this.props.published &&
              this.props.published.metadata &&
              this.props.published.metadata.workflows ? (
                <Box>
                  {this.props.published.metadata.workflows.map(workflow => (
                    <Box>
                      <FormField label="Select Platform">
                        <Select
                          inline={false}
                          multiple={true}
                          onSearch={false}
                          value={{ value: "reana", label: "REANA" }}
                          options={[{ value: "reana", label: "REANA" }]}
                        />
                      </FormField>
                      <FormField label="Select Workflow from the list">
                        <Select
                          placeHolder="None"
                          inline={false}
                          multiple={true}
                          onSearch={false}
                          value={
                            this.state.workflow
                              ? this.state.workflow.workflow_title
                              : null
                          }
                          options={current_workflows}
                          onChange={this.selectWorkflow}
                        />
                      </FormField>
                      <FormField>
                        <CheckBox
                          label="Auto-start workflow"
                          toggle={true}
                          checked={this.state.autostart}
                          onChange={() =>
                            this.setState({ autostart: !this.state.autostart })
                          }
                        />
                      </FormField>
                    </Box>
                  ))}
                </Box>
              ) : (
                "No workflows submitted :("
              )}

              <Box
                margin={{ top: "small" }}
                justify="between"
                direction="row"
                wrap={true}
              >
                <Button
                  onClick={() => this.props.history.goBack()}
                  label="Cancel"
                />
                <Button
                  onClick={this.state.workflow ? this.runWorkflow : null}
                  label="Create Workflow"
                  type="submit"
                  primary={true}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Layer>
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
    REANACreateWorkflow: (workflow, published_id) =>
      dispatch(REANACreateWorkflow(workflow, published_id)),
    rerunPublished: (workflow_id, id) =>
      dispatch(rerunPublished(workflow_id, id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RerunPublished);
