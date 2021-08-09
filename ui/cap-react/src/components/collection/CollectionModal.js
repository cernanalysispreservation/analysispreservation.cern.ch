import React from "react";
import PropTypes from "prop-types";
import Modal from "../partials/Modal";
import { Box, Heading, Label } from "grommet";

const CollectionModal = ({ open, onClose }) => {
  const DATA = [
    {
      header: "Read",
      description:
        "Users with read permissions are authorised only to read and review metadata"
    },
    {
      header: "Update",
      description:
        "Users with update permissions are authorised to edit and review metadata, upload files to a deposit/record and create webhooks"
    },
    {
      header: "Admin",
      description:
        "Users with admin permissions are authorised to edit and review metadata, upload files to a deposit/record, and create webhooks. Admins can publish and delete deposits"
    }
  ];

  return (
    open && (
      <Modal onClose={onClose} title="Permissions" separator>
        <Box pad="small">
          {DATA.map(data => (
            <React.Fragment key={data.header}>
              <Heading tag="h4">{data.header} </Heading>
              <Box
                pad="small"
                margin={{ bottom: "small" }}
                style={{ borderRadius: "3px" }}
                align="center"
                colorIndex="light-2"
              >
                <Label size="small" margin="none" align="center">
                  {data.description}
                </Label>
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </Modal>
    )
  );
};

CollectionModal.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func
};

export default CollectionModal;
