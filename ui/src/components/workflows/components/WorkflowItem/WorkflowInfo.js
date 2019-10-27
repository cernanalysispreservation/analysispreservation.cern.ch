import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import { Heading, ListItem, List } from "grommet";

import Accordion from "grommet/components/Accordion";
// import AccordionPanel from 'grommet/components/AccordionPanel';
import AccordionPanel from "../../../partials/AccordionPanel";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

class WorkflowsInfo extends React.Component {
  componentDidMount() {
    let { params: { workflow_id } = {} } = this.props.match;
    this.props.getWorkflow(workflow_id);
    // this.props.getWorkflowStatus(workflow_id);
  }

  render() {
    let { workflow = null } = this.props;

    if (!workflow) return null;
    return (
      <Box flex={false} margin={{ vertical: "large" }}>
        <Heading tag="h3">Workflow Info</Heading>

        <Accordion openMulti={true}>
          <AccordionPanel heading="Inputs" headingColor="light-1">
            <Box colorIndex="light-2">
              <List>
                {workflow
                  .getIn(["workflow_json", "inputs", "files"])
                  .map(file => <ListItem>{file}</ListItem>)}
              </List>
            </Box>
          </AccordionPanel>
          <AccordionPanel heading="Specifications" headingColor="light-1">
            <Box colorIndex="light-2">
              <AceEditor
                mode="javascript"
                theme="tomorrow"
                readOnly={true}
                width="100%"
                name="UNIQUE_ID_OF_DIV"
                value={JSON.stringify(
                  workflow.getIn(["workflow_json", "workflow"]).toJS(),
                  null,
                  2
                )}
                editorProps={{ $blockScrolling: true }}
              />
            </Box>
          </AccordionPanel>
          <AccordionPanel heading="Output" headingColor="light-1">
            <Box colorIndex="light-2">
              <List>
                {workflow
                  .getIn(["workflow_json", "outputs", "files"])
                  .map(file => <ListItem>{file}</ListItem>)}
              </List>
            </Box>
          </AccordionPanel>
        </Accordion>
      </Box>
    );
  }
}

WorkflowsInfo.propTypes = {
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object,
  match: PropTypes.object
};

export default WorkflowsInfo;
