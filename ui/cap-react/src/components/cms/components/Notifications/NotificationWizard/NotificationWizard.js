import React from "react";
import PropTypes from "prop-types";
import EmptyWizard from "../../../containers/EmptyWizard";
import { acceptedActions } from "./utils/acceptedActions";
import NotificationList from "../../../containers/NotificationList";
import { Box, Heading } from "grommet";
import Anchor from "../../../../partials/Anchor";
import Button from "../../../../partials/Button";
import { AiOutlineArrowLeft } from "react-icons/ai";

const NotificationWizard = props => {
  const { category = "review" } = props.match.params;

  // if the category is not defined or it is not acceptable value
  if (!category || !acceptedActions.includes(category))
    props.history.push(props.location.pathname.split(`/${category}`)[0]);

  const currentNotifications = props.schemaConfig.getIn([
    "notifications",
    "actions",
    category
  ]);

  return (
    <Box flex>
      <Box
        pad="small"
        direction="row"
        colorIndex="light-2"
        margin={{ bottom: "medium" }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)"
        }}
      >
        <Box style={{ gridColumn: "1/2" }}>
          <Anchor path={props.location.pathname.split(`/${category}`)[0]}>
            <Button text="back" icon={<AiOutlineArrowLeft size={16} />} />
          </Anchor>
        </Box>
        <Box align="center" style={{ gridColumn: "2/4" }}>
          <Heading tag="h3" strong margin="none">
            {`when ${category}ed`}
          </Heading>
        </Box>
      </Box>
      {currentNotifications.size === 0 ? (
        <EmptyWizard category={category} />
      ) : (
        <NotificationList list={currentNotifications} category={category} />
      )}
    </Box>
  );
};

NotificationWizard.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  location: PropTypes.object,
  schemaConfig: PropTypes.object
};

export default NotificationWizard;
