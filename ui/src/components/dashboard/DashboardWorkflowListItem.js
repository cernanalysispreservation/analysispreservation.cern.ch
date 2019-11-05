import React from "react";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Label from "grommet/components/Label";
import Anchor from "grommet/components/Anchor";

import ListItem from "grommet/components/ListItem";

import { push } from "connected-react-router";

function DashboardWorkflowListItem(props) {
  let { id, name, rec_uuid, service, status, workflow_id } = props.item;

  let itemUrl = `/drafts/${rec_uuid}/workflows/${workflow_id}`;
  return (
    <ListItem key={`${id}`} onClick={() => props.push(itemUrl)}>
      <Box margin={{ right: "medium" }} style={{ overflow: "visible" }} flex>
        <Box direction="row">
          <Heading strong tag="h6" margin="none" truncate>
            {name}
          </Heading>
        </Box>
        <Box
          flex={true}
          style={{ overflow: "visible" }}
          direction="row"
          pad={{ between: "small" }}
        >
          <Label size="small" margin="none" truncate>
            <strong>Status:</strong> {status}
          </Label>
          <Label size="small" margin="none" truncate>
            <strong>Service:</strong> {service}
          </Label>
        </Box>
      </Box>
      <Box
        flex={false}
        justify="center"
        textAlign="right"
        style={{ fontWeight: "light" }}
      >
        <Anchor label="view" />
      </Box>
    </ListItem>
  );
}

function mapStateToProps(state) {
  return {
    currentUser: state.auth.getIn(["currentUser", "profile", "email"])
  };
}

export default connect(
  mapStateToProps,
  { push }
)(DashboardWorkflowListItem);
