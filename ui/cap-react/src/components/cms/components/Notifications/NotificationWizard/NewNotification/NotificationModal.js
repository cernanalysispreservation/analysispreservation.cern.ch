import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../../../partials/Modal";
import { Box, Heading, TextInput, FormField } from "grommet";
import Button from "../../../../../partials/Button";

const NotificationModal = ({ open, onClose, title }) => {
  return (
    open && (
      <Modal onClose={onClose} title={title}>
        <Box
          style={{
            display: "grid",
            gridGap: "3rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 400px))",
            width: "100%",
            maxWidth: "900px",
            justifyContent: "center"
          }}
          pad="medium"
        >
          <Box colorIndex="light-2" align="center" pad="small">
            <Heading margin="none" tag="h4">
              Add Parameter Manually
            </Heading>
            <Box>
              <FormField style={{ marginTop: "20px" }}>
                <TextInput name="subject-input" placeHolder="add name" />
              </FormField>

              <FormField style={{ marginTop: "10px" }}>
                <TextInput name="subject-input" placeHolder="add path" />
              </FormField>
              <Box align="center" margin={{ top: "medium" }}>
                <Button text="add" primary />
              </Box>
            </Box>
          </Box>
          <Box colorIndex="light-2" align="center" pad="small">
            <Heading margin="none" tag="h4">
              Fetch Parameter
            </Heading>
            <Box>
              <FormField style={{ marginTop: "20px" }}>
                <TextInput name="subject-input" placeHolder="add name" />
              </FormField>

              <FormField style={{ marginTop: "10px" }}>
                <TextInput name="subject-input" placeHolder="add path" />
              </FormField>
              <Box align="center" margin={{ top: "medium" }}>
                <Button text="add" primary />
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    )
  );
};

NotificationModal.propTypes = {};

export default NotificationModal;
