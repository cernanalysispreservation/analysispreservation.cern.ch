import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Status from "grommet/components/icons/Status";
import Paragraph from "grommet/components/Paragraph";

const DropDownList = ({ open, items }) => {
  return (
    <Box style={{ display: open ? "block" : "none" }}>
      {items.map((service, index) => (
        <Box
          key={index}
          size="large"
          pad={{ horizontal: "small" }}
          flex={true}
          direction="row"
          justify="between"
          style={{
            border: "1px solid black",
            borderTop: 0
          }}
        >
          <Box flex={true} direction="row" align="center">
            <Paragraph>{service.service}</Paragraph>
          </Box>
          <Box flex={true} direction="row" justify="end" align="center">
            {service.status === 200 ? (
              <React.Fragment>
                <Status value="ok" size="small" />
                <Paragraph style={{ color: "#509137", marginLeft: "1em" }}>
                  Operational
                </Paragraph>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Status value="critical" size="small" />
                <Paragraph style={{ color: "#f04b37", marginLeft: "1em" }}>
                  Not Operational
                </Paragraph>
              </React.Fragment>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

DropDownList.propTypes = {
  open: PropTypes.bool,
  items: PropTypes.array
};

export default DropDownList;
