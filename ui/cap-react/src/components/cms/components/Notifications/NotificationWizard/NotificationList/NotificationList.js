import React from "react";
import PropTypes from "prop-types";
import { Box, Heading, Label } from "grommet";
import Anchor from "../../../../../partials/Anchor";
import Menu from "../../../../../partials/Menu";
import Button from "../../../../../partials/Button";
import MenuItem from "../../../../../partials/MenuItem";
import Truncate from "react-truncate";
import { AiOutlineMore, AiOutlineDelete } from "react-icons/ai";

const NotificationList = ({
  list,
  setSelectedNotification,
  category,
  removeNotification,
  createNewNotification,
  pathname
}) => {
  return (
    <Box flex align="center" id="anchor-no-style">
      <Box margin={{ bottom: "small" }} justify="end">
        <Button
          text="add new notification"
          primary
          onClick={() => createNewNotification(category)}
        />
      </Box>
      {list.map((item, index) => (
        <Box
          style={{
            width: "90%",
            maxWidth: "992px",
            border: "1px solid rgba(0,0,0,0.5)",
            padding: "10px",
            borderRadius: "3px",
            color: "#000",
            margin: "0 0 10px 0 ",
            position: "relative"
          }}
          key={item.get("subject") + item.get("body") + index}
        >
          <Box direction="row" justify="between" responsive={false}>
            <Label margin="none" size="small">
              #{index + 1}
            </Label>
            <Menu icon={<AiOutlineMore size={18} />} right={-100} shadow>
              <MenuItem
                title="remove"
                hovered
                icon={
                  <AiOutlineDelete size={18} color="rgba(179, 53, 52, 1)" />
                }
                onClick={() => removeNotification(index, category)}
              />
            </Menu>
          </Box>

          <Anchor
            path={`${pathname}/edit`}
            onClick={() => setSelectedNotification(item, index, category)}
            flex
          >
            <Box direction="row" align="center" pad="small" flex>
              <Heading tag="h4" margin="none">
                Subject
              </Heading>
              <Box
                pad={{ horizontal: "small" }}
                style={{ color: "rgba(0,0,0,0.5)" }}
              >
                <Truncate lines={1} ellipsis={<span>...</span>}>
                  <Label size="small" margin="none">
                    {item.get("subject")}
                  </Label>
                </Truncate>
              </Box>
            </Box>
            <Box
              margin={{ top: "small" }}
              direction="row"
              align="center"
              pad="small"
            >
              <Heading tag="h4" margin="none">
                Body
              </Heading>
              <Box
                pad={{ horizontal: "small" }}
                style={{ color: "rgba(0,0,0,0.5)" }}
              >
                <Truncate lines={1} ellipsis={<span>...</span>}>
                  <Label size="small" margin="none">
                    {item.get("body")}
                  </Label>
                </Truncate>
              </Box>
            </Box>
            <Box
              margin={{ top: "small" }}
              direction="row"
              align="center"
              pad="small"
            >
              <Heading tag="h4" margin="none">
                Recipients
              </Heading>
              <Box
                pad={{ horizontal: "small" }}
                style={{ color: "rgba(0,0,0,0.5)" }}
                justify="between"
                flex
                direction="row"
                align="center"
                responsive={false}
              >
                <span>
                  bcc ({`${item.getIn(["recipients", "bcc"]).size} params`})
                </span>
                <span>
                  cc ({`${item.getIn(["recipients", "cc"]).size} params`})
                </span>
                <span>
                  to ({`${item.getIn(["recipients", "to"]).size} params`})
                </span>
              </Box>
            </Box>
          </Anchor>
        </Box>
      ))}
    </Box>
  );
};

NotificationList.propTypes = {
  list: PropTypes.object,
  setSelectedNotification: PropTypes.func,
  category: PropTypes.string,
  pathname: PropTypes.string,
  removeNotification: PropTypes.func,
  createNewNotification: PropTypes.func
};

export default NotificationList;
