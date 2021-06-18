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
  removeNotification,
  createNewNotification,
  pathname,
  schemaConfig,
  category
}) => {
  const list = schemaConfig.get(category);

  return (
    <Box flex align="center" id="anchor-no-style" pad="small">
      <Box margin={{ bottom: "small" }} justify="end">
        <Button
          text="add new notification"
          primary
          onClick={() => createNewNotification(category)}
        />
      </Box>
      {list.map((item, index) => (
        <Box
          size={{ width: "xxlarge" }}
          pad="small"
          margin={{ bottom: "medium" }}
          style={{
            border: "1px solid rgba(0,0,0,0.3)",
            borderRadius: "3px",
            position: "relative"
          }}
          key={item.get("subject") + item.get("body") + index}
        >
          <Box direction="row" justify="between" responsive={false}>
            <Label margin="none" size="small">
              #{index + 1}
            </Label>
            <Menu icon={<AiOutlineMore size={18} />} right={-10} shadow>
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

          <Anchor path={`${pathname}/${index}`} flex>
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
                {item.hasIn(["recipients", "bcc"]) ? (
                  <span>
                    bcc ({`${item.getIn(["recipients", "bcc"]).size} params`})
                  </span>
                ) : (
                  <span>bcc (0)</span>
                )}
                {item.hasIn(["recipients", "cc"]) ? (
                  <span>
                    cc ({`${item.getIn(["recipients", "cc"]).size} params`})
                  </span>
                ) : (
                  <span>bcc (0)</span>
                )}
                {item.hasIn(["recipients", "recipients"]) ? (
                  <span>
                    recipients ({`${
                      item.getIn(["recipients", "recipients"]).size
                    } params`})
                  </span>
                ) : (
                  <span>bcc (0)</span>
                )}
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

  category: PropTypes.string,
  pathname: PropTypes.string,
  removeNotification: PropTypes.func,
  createNewNotification: PropTypes.func,
  schemaConfig: PropTypes.object
};

export default NotificationList;
