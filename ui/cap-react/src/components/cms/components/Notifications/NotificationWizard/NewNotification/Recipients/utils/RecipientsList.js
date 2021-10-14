import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Label } from "grommet";
import Button from "../../../../../../../partials/Button";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "./RecipiensEmailModal";
import EmailModal from "./FormattedEmailModal";
import Tag from "../../../../../../../partials/Tag";
import { getTagType } from "../../utils/utils";

const RecipientsList = ({ emailsList = [], updateList }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailDisplay, setEmailDisplay] = useState("default");

  const { selectedEmailsList, formattedEmails, defaultEmails } = useMemo(
    () => {
      let defaultEmails = emailsList.filter(
        email => email.get("type") == "default"
      );

      let formattedEmails = emailsList.filter(
        email => email.get("type") == "formatted"
      );

      return {
        selectedEmailsList:
          emailDisplay == "default" ? defaultEmails : formattedEmails,
        defaultEmails,
        formattedEmails
      };
    },
    [emailsList, emailDisplay]
  );

  return (
    <Box>
      {openModal && (
        <Modal
          onClose={() => setOpenModal(false)}
          updateEmail={updateList}
          size={emailsList.length}
        />
      )}
      {selectedEmail && (
        <EmailModal
          onClose={() => setSelectedEmail(null)}
          email={selectedEmail}
        />
      )}
      <Box
        align="center"
        direction="row"
        responsive={false}
        justify="between"
        margin={{ bottom: "medium" }}
      >
        {emailsList.length > 0 && (
          <Box
            flex
            align="center"
            justify="between"
            direction="row"
            margin={{ top: "medium" }}
            responsive={false}
          >
            <Box direction="row" align="center">
              <Tag
                text={`Default (${defaultEmails.length})`}
                margin="0 10px 0 0"
                size="small"
                color={getTagType(emailDisplay == "default")}
                onClick={() => setEmailDisplay("default")}
              />
              <Tag
                text={`Dynamic (${formattedEmails.length})`}
                size="small"
                color={getTagType(emailDisplay == "formatted")}
                onClick={() => setEmailDisplay("formatted")}
              />
            </Box>
            <Button
              text="add new email"
              primary
              size="small"
              onClick={() => setOpenModal(true)}
            />
          </Box>
        )}
      </Box>
      {emailsList.length === 0 ? (
        <Box align="center">
          <Label margin="none">
            Notify users/groups by adding their email addresses
          </Label>
          <Button
            text="add email"
            primary
            onClick={() => setOpenModal(true)}
            margin="10px 0 0 0 "
          />
        </Box>
      ) : (
        <Box direction="row" wrap>
          {selectedEmailsList.map(email => (
            <Box
              key={email.get("email")}
              style={{ position: "relative", margin: "10px" }}
            >
              <Tag
                size="small"
                text={
                  email.get("type") === "default"
                    ? email.get("email")
                    : email.get("email").get("template")
                }
                onClick={() =>
                  email.get("type") == "formatted" && setSelectedEmail(email)
                }
              />
              <Box style={{ position: "absolute", right: -14, top: -18 }}>
                <Button
                  icon={<AiOutlineClose />}
                  size="iconSmall"
                  criticalOutline
                  rounded
                  onClick={() =>
                    updateList(["mails", email.get("type")], email.get("email"))
                  }
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

RecipientsList.propTypes = {
  emailsList: PropTypes.array,
  updateList: PropTypes.func
};

export default RecipientsList;
