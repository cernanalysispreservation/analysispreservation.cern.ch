import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading, TextInput, FormField } from "grommet";
import Button from "../../../../../partials/Button";
import { AiOutlinePlus } from "react-icons/ai";
import NotificationModal from "./NotificationModal";

const NotificationField = ({ header }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <React.Fragment>
      <NotificationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={`add new ${header} parameter`}
      />
      <Box size="xxlarge" margin={{ bottom: "large" }}>
        <Heading tag="h3" strong>
          {header}
        </Heading>
        <FormField>
          <TextInput name="subject-input" placeHolder="add your subject" />
        </FormField>
        <Box>
          <Box
            separator="bottom"
            margin={{ top: "medium" }}
            justify="between"
            direction="row"
            responsive={false}
            pad={{ horizontal: "small" }}
            style={{ paddingBottom: "4px" }}
          >
            <Heading margin="none" tag="h4">
              Parameters
            </Heading>
            <Button
              text="add parameter"
              icon={<AiOutlinePlus />}
              onClick={() => setOpenModal(true)}
            />
          </Box>
          <Box direction="row" wrap align="center">
            <Box>paramer</Box>
            <Box>paramer</Box>
            <Box>paramer</Box>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

NotificationField.propTypes = {};

export default NotificationField;
