import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import { Anchor, Button, Heading, Paragraph } from "grommet";

import REANALogo from "../reana_logo.svg";

class WorkflowsIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { match: { params: { draft_id, id } = {} } = {} } = this.props;

    if (draft_id) this.props.getDraftWorkflows(draft_id);
    else if (id) this.props.getWorkflows();
    else this.props.getWorkflows();
  }

  goToWorkflowItem = workflow_id => {
    let url = `/wokflows/${workflow_id}`;
    this.props.location.replace(url);
  };

  render() {
    let { match: { url, params: { draft_id, id } = {} } = {} } = this.props;
    let { workflows } = this.props;

    workflows = workflows;

    return (
      <Box>
        <Box
          flex={true}
          direction="row"
          wrap
          margin={{ bottom: "large" }}
          justify="between"
        >
          <Box flex={false} margin={{ right: "small", vertical: "small" }}>
            <Box colorIndex="grey-2" pad="small">
              <Heading tag="h5" strong margin="none">
                Create New Workflow
              </Heading>
            </Box>
            <Box
              size={{ height: "small" }}
              flex
              direction="row"
              wrap={false}
              colorIndex="light-2"
              pad="small"
              justify="between"
            >
              <Box
                flex={false}
                direction="row"
                responsive={false}
                wrap
                align="center"
                justify="center"
                colorIndex="light-1"
                pad="small"
              >
                <Anchor path={`${url}/create`} label="Serial Workflow" />
                <REANALogo width="60" height="8" />
              </Box>
              <Box
                flex={false}
                direction="row"
                responsive={false}
                wrap
                align="center"
                justify="center"
                colorIndex="light-1"
                pad="small"
              >
                <Anchor path={`${url}/create`} label="Yadage Workflow" />
                <REANALogo width="60" height="8" />
              </Box>
            </Box>
          </Box>

          <Box
            flex={true}
            colorIndex="grey-4"
            pad="small"
            margin={{ vertical: "small" }}
          >
            <Heading tag="h5" margin="none">
              REANA Hello World Example
            </Heading>
            <Paragraph margin="small">
              Create now a simple workflow that runs on REANA cluster te now a
              simple workflow that run on REANA cluster
            </Paragraph>
            <Box
              flex={true}
              direction="row"
              wrap
              justify="end"
              alignContent="end"
            >
              <Button
                label="Try it now!"
                primary
                colorIndex="brand"
                onClick={() => {}}
              />
            </Box>
          </Box>
        </Box>
        <Box colorIndex="light-2">
          <Box colorIndex="grey-2" pad="small">
            <Heading tag="h5" strong margin="none">
              Current Workflows
            </Heading>
          </Box>
          <List>
            {workflows && workflows.size > 0 ? (
              workflows.map(workflow => (
                <ListItem key={workflow.get("workflow_id")}>
                  <Box flex="grow" direction="row" justify="between">
                    <Box>{workflow.get("name")}</Box>
                    <Box>{workflow.get("status")}</Box>
                    <Box>
                      <Anchor
                        label="View"
                        path={`${url}/${workflow.get("workflow_id")}`}
                      />
                    </Box>
                  </Box>
                </ListItem>
              ))
            ) : (
              <ListPlaceholder
                unfilteredTotal={0}
                emptyMessage="No workflows to display"
              />
            )}
          </List>
        </Box>
        <Box />
      </Box>
    );
  }
}

WorkflowsIndex.propTypes = {
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object,
  match: PropTypes.object,
  getWorkflows: PropTypes.func
};

export default WorkflowsIndex;
