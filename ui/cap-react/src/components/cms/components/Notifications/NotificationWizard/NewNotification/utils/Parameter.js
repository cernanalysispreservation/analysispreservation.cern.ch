import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import Button from "../../../../../../partials/Button";
import Tag from "../../../../../../partials/Tag";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";

const Parameter = ({ ctx, onClick, header, updateNotification }) => {
  return (
    <Box>
      <Box
        separator="bottom"
        margin={{ top: "large" }}
        justify="between"
        direction="row"
        responsive={false}
        pad={{ horizontal: "small" }}
        style={{ paddingBottom: "4px" }}
      >
        <Heading margin="none" tag="h4">
          {header}
        </Heading>
        <Button
          text="add parameter"
          icon={<AiOutlinePlus />}
          onClick={onClick}
        />
      </Box>
      <Box
        direction="row"
        wrap
        align="center"
        margin={{ vertical: "small" }}
        responsive={false}
      >
        {ctx.map(item => {
          return (
            <Box key={item} style={{ position: "relative", margin: "0 5px" }}>
              {item.has("name") ? (
                <Tag
                  text={`${item.get("name")} - ${item.get("path")}`}
                  margin="5px  12px"
                />
              ) : (
                <Tag
                  text={`method - ${item.get("method")}`}
                  key={item.get("method")}
                  margin="5px  12px"
                />
              )}
              <Box style={{ position: "absolute", right: -10, top: -10 }}>
                <Button
                  icon={<AiOutlineClose />}
                  size="iconSmall"
                  criticalOutline
                  rounded
                  onClick={() => updateNotification(item)}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

Parameter.propTypes = {
  ctx: PropTypes.array,
  header: PropTypes.string,
  onClick: PropTypes.func
};

export default Parameter;
