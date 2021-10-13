import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../../../../../partials/Modal";
import { Box, Heading, Label } from "grommet";

const FormattedEmailModal = ({ email, onClose }) => {
  let template = email.getIn(["email", "template"]);
  let ctx = email.getIn(["email", "ctx"]);
  return (
    <Modal onClose={onClose} title="Formatted Email">
      <Box size={{ width: "xlarge" }} pad="medium">
        <Heading tag="h3">Template</Heading>
        <Box pad="small" colorIndex="light-2">
          <Label size="small">{template}</Label>
        </Box>
        <Box margin={{ top: "medium" }}>
          <Heading tag="h3"> Context</Heading>
          <Box direction="row" wrap responsive={false}>
            {ctx.map(item => (
              <Box
                key={item.get("name")}
                pad="small"
                colorIndex="light-2"
                margin={{ horizontal: "small" }}
              >
                <Label size="small">{item.get("name")}</Label>
                <Label size="small">{item.get("path")}</Label>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

FormattedEmailModal.propTypes = {
  email: PropTypes.object,
  onClose: PropTypes.func
};

export default FormattedEmailModal;
