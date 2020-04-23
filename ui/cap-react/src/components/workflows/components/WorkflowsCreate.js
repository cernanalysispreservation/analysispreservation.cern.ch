import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Form from "../../drafts/form/GrommetForm";

import {
  schema as REANASchema,
  uiSchema as REANAUiSchema
} from "../schemas/REANA-v1.0.0";

import { Button, Paragraph, Heading } from "grommet";

// This is an example workflow payload to create in REANA
// const example_workflow = {
//   pid: "c78a782f7dc548ac8509be2a5589cc87",
//   name: "demo",
//   workflow_json: {
//     "workflow": {
//       "type": "serial",
//       "specification": {
//         "steps": [
//           {
//             "environment": "python:2.7-slim",
//             "commands": ["python '${helloworld}'"]
//           }
//         ]
//       }
//     },
//     "inputs": {
//       "files": ["code/helloworld.py"],
//       "parameters": {
//         "helloworld": "code/helloworld.py"
//       }
//     },
//     "outputs": {
//       "files": ["results/results.txt"]
//     }
//   }
// };

class WorkflowsItem extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  componentDidMount() {
    // let { match: { params: { draft_id, id } = {} } = {} } = this.props;
    // let { params: {workflow_id} = {} } = this.props.match;
    // this.props.getWorkflowStatus(workflow_id);
  }

  _createREANAWorkflow = data => {
    let { match: { params: { draft_id } = {} } = {} } = this.props;
    let { formData = {} } = data;

    // if PID exists, pass it in the payload to associate with record
    // else a standalone workflow will be created for the user
    if (draft_id) formData["pid"] = draft_id;

    this.props.createWorkflow(formData);
  };

  render() {
    let { pid } = this.props;
    return (
      <Box flex={false}>
        <Box
          flex={false}
          margin={{ bottom: "small" }}
          direction="row"
          wrap={false}
        >
          <Box flex={true} margin={{ bottom: "large" }}>
            <Heading tag="h5">Create a REANA Workflow</Heading>
            <Paragraph margin="none">
              Construct your workflow here and create a REANA environment to run
              your code.
            </Paragraph>
          </Box>
          <Box flex={false} margin={{ left: "large" }}>
            <Button
              label="Create Workflow"
              primary
              onClick={() => this.formRef.current.submit()}
            />
          </Box>
        </Box>
        <Box flex={false}>
          <Box justify="end" pad={{ vertical: "small" }}>
            For record: {pid || "NO RECORD SELECTED"}
          </Box>
          <Form
            formRef={this.formRef}
            schema={REANASchema}
            uiSchema={REANAUiSchema}
            onSubmit={this._createREANAWorkflow}
          />
        </Box>
      </Box>
    );
  }
}

WorkflowsItem.propTypes = {
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object,
  match: PropTypes.object,
  createWorkflow: PropTypes.func,
  pid: PropTypes.string
};

export default WorkflowsItem;
