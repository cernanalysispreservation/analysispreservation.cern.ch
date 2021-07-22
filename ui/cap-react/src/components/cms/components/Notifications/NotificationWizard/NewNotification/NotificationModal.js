import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../../../../../partials/Modal";
import { Box, Heading, Label } from "grommet";
import Button from "../../../../../partials/Button";
import Select from "react-select";
import AddParameterManually from "./utils/AddParameterManually";
import { getMethodsByType } from "./utils/customMethds";

const NotificationModal = ({ open, onClose, title, onChange, ctx, header }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const selectedOptions = ctx
    .map(item => (item.has("method") ? item.get("method") : null))
    .filter(item => item != undefined);

  const allowedMethods = getMethodsByType(header).filter(
    item => !selectedOptions.includes(item.value)
  );

  return (
    open && (
      <Modal onClose={onClose} title={title} overflowVisible>
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
          <Box
            colorIndex="light-2"
            align="center"
            pad="small"
            justify="between"
          >
            <Box>
              <Heading margin="none" tag="h4">
                Fetch Parameter
              </Heading>
              <Label margin="none" size="small">
                by selecting a method
              </Label>
            </Box>

            <Box style={{ width: "250px" }} margin={{ top: "medium" }}>
              {allowedMethods.length > 0 ? (
                <Select
                  placeholder="Select a method"
                  options={allowedMethods}
                  value={selectedValue}
                  onChange={val => setSelectedValue(val)}
                />
              ) : (
                <Box align="center">
                  <Label size="small">No more methods to select from </Label>
                </Box>
              )}
            </Box>
            <Box align="center" margin={{ top: "medium" }}>
              {allowedMethods.length > 0 && (
                <Button
                  text="add"
                  primary
                  onClick={() => {
                    onChange({
                      method: selectedValue.value
                    });
                    setSelectedValue(null);
                    onClose();
                  }}
                />
              )}
            </Box>
          </Box>
          <Box colorIndex="light-2" align="center" pad="small">
            <Heading margin="none" tag="h4">
              Add Parameter Manually
            </Heading>
            <Label margin="none" size="small">
              provide the fields below
            </Label>
            <AddParameterManually
              onUpdate={val => {
                onChange(val);
                onClose();
              }}
            />
          </Box>
        </Box>
      </Modal>
    )
  );
};

NotificationModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onChange: PropTypes.func,
  ctx: PropTypes.object
};

export default NotificationModal;
