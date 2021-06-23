import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading, FormField } from "grommet";
import NotificationModal from "./NotificationModal";
import Parameter from "./utils/Parameter";
import { Map } from "immutable";

const NotificationField = ({
  header,
  template = "",
  ctx,
  field = "",
  updateNotification = null
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState(template);

  return (
    <React.Fragment>
      <NotificationModal
        ctx={ctx}
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={`add new ${header} parameter`}
        onChange={val => updateNotification([field, "ctx"], Map(val))}
        field={field}
      />
      <Box
        style={{ width: "90%", maxWidth: "992px" }}
        margin={{ bottom: "large" }}
      >
        <Heading tag="h3" strong>
          {header}
        </Heading>
        <FormField>
          <textarea
            name="subject-input"
            placeHolder="add your subject"
            value={inputValue}
            rows="3"
            onChange={e => {
              setInputValue(e.target.value);
              updateNotification([field, "template"], inputValue);
            }}
          />
        </FormField>
        <Parameter
          ctx={ctx}
          onClick={() => setOpenModal(true)}
          header="Parameters"
          updateNotification={val => updateNotification([field, "ctx"], val)}
        />
      </Box>
    </React.Fragment>
  );
};

NotificationField.propTypes = {
  header: PropTypes.string,
  field: PropTypes.string,
  template: PropTypes.string,
  ctx: PropTypes.object,
  updateNotification: PropTypes.func
};

export default NotificationField;
