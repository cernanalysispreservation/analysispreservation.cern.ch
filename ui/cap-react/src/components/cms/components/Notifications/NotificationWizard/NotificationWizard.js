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
  const { category } = props.match.params;

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
      <Box align="start" pad="small">
        <Anchor path={props.location.pathname.split(`/${category}`)[0]}>
          <Button text="back" icon={<AiOutlineArrowLeft size={16} />} />
        </Anchor>
      </Box>
      <Box align="center" margin={{ bottom: "medium" }}>
        <Heading tag="h3" strong margin="none">
          {`when ${category}ed`}
        </Heading>
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
  schemaConfig: PropTypes.object
};

export default NotificationWizard;
