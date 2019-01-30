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

import { rerunCreateWorkflow } from "../../actions/published";

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
    this.setState({ workflow: event.option.value });
  };

  runWorkflow = () => {
    let { id } = this.props.match.params;
    if (this.state.workflow && id)
      this.props.rerunCreateWorkflow(this.state.workflow, id);
  };

  render() {
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
                  {this.props.published.metadata.workflows.map(() => (
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
  match: PropTypes.object
};

function mapStateToProps(state) {
  return {
    published: state.published.getIn(["current_item", "data"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rerunCreateWorkflow: (workflow, published_id) =>
      dispatch(rerunCreateWorkflow(workflow, published_id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RerunPublished);
