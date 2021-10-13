import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Label, Heading } from "grommet";
import CustomChecks from "../../../../../../../containers/Conditions";
import Button from "../../../../../../../../partials/Button";
import Menu from "../../../../../../../../partials/Menu";
import MenuItem from "../../../../../../../../partials/MenuItem";
import HorizontalWithText from "../../../../../../../../partials/HorizontalWithText";
import RecipiensList from "../../utils/RecipiensList";
import { fromJS } from "immutable";

import { AiOutlineMore, AiOutlineDelete } from "react-icons/ai";

const RecipientsCustomConditions = ({
  emails = [],
  updateNotification,
  emailType,
  addNewCondition,
  removeCondition
}) => {
  const [selectedCheck, setSelectedCheck] = useState(null);

  const getEmailList = () => {
    const emails = selectedCheck.mail.get("mails");

    let results = [];
    let defaults =
      emails.has("default") &&
      emails.get("default").map(ml => fromJS({ type: "default", email: ml }));
    let formatted =
      emails.has("formatted") &&
      emails
        .get("formatted")
        .map(ml => fromJS({ type: "formatted", email: ml }));

    if (formatted) results = [...results, ...formatted];
    if (defaults) results = [...results, ...defaults];

    return results;
  };

  useEffect(
    () => {
      if (selectedCheck) {
        emails.map(item => {
          if (item.index === selectedCheck.index) {
            setSelectedCheck(item);
          }
        });
      }
    },
    [emails]
  );

  return (
    <Box pad="medium" id="conditionCheckBoxes">
      <Heading tag="h4" strong margin="none">
        Create custom conditions
      </Heading>
      <Label size="small">
        Create your own conditions, and define who will be notified
      </Label>
      {selectedCheck ? (
        <React.Fragment>
          <Box pad={{ horizontal: "small" }}>
            <Button
              text="show all checks"
              onClick={() => setSelectedCheck(null)}
            />
          </Box>

          <CustomChecks
            checks={selectedCheck.mail}
            checkIndex={selectedCheck.index}
            emailType={emailType}
          />
          <Box pad={{ horizontal: "small" }} margin={{ top: "small" }}>
            <HorizontalWithText text="EMAILS" />
            <RecipiensList
              updateList={(key, val) =>
                updateNotification([selectedCheck.index, ...key], val)
              }
              emailsList={getEmailList()}
            />
          </Box>
        </React.Fragment>
      ) : emails.length === 0 ? (
        <Box align="center">
          <Button
            text="create condition"
            primary
            margin="10px 0 0 0"
            onClick={() => addNewCondition(emailType)}
          />
        </Box>
      ) : (
        <React.Fragment>
          <Box align="end" margin={{ bottom: "medium" }}>
            <Button
              text="add new condition"
              primary
              onClick={() => addNewCondition(emailType)}
            />
          </Box>
          {emails.map((item, index) => (
            <Box
              key={index}
              pad="small"
              separator="all"
              margin={{ bottom: "small" }}
              direction="row"
              align="center"
              justify="between"
              responsive={false}
              style={{ position: "relative" }}
            >
              <Box
                direction="row"
                align="center"
                justify="between"
                responsive={false}
                margin={{ right: "small" }}
                onClick={() => setSelectedCheck(item)}
              >
                <Label margin="none" size="small">
                  #{index + 1}
                </Label>
                <Box direction="row" responsive={false} align="center">
                  <Label margin="none" style={{ marginRight: "5px" }}>
                    {item.mail.get("checks").size}
                  </Label>
                  <Heading tag="h4" margin="none">
                    Checks
                  </Heading>
                </Box>
                <Box direction="row" responsive={false} align="center">
                  <Label margin="none" style={{ marginRight: "5px" }}>
                    {item.mail.hasIn(["mails", "default"]) &&
                      item.mail.getIn(["mails", "default"]).size}
                  </Label>
                  <Heading tag="h4" margin="none">
                    Mails
                  </Heading>
                </Box>
              </Box>
              <Menu icon={<AiOutlineMore size={18} />} right={0} shadow>
                <MenuItem
                  title="remove"
                  hovered
                  icon={
                    <AiOutlineDelete size={18} color="rgba(179, 53, 52, 1)" />
                  }
                  onClick={() => removeCondition(emailType, item)}
                />
              </Menu>
            </Box>
          ))}
        </React.Fragment>
      )}
    </Box>
  );
};

RecipientsCustomConditions.propTypes = {
  emails: PropTypes.array,
  updateNotification: PropTypes.func,
  removeCondition: PropTypes.func,
  addNewCondition: PropTypes.func,
  emailType: PropTypes.string
};

export default RecipientsCustomConditions;
