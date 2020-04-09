import React, { useState } from "react";
import PropTypes from "prop-types";

import ReactTooltip from "react-tooltip";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Label from "grommet/components/Label";

import List from "grommet/components/List";

import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

function DashboardList(props) {
  const [activeList, setActiveList] = useState("mine");
  let { header = "", emptyMessage = null, listType, list, ListItem } = props;

  return (
    <Box flex={false} pad={{ vertical: "small" }}>
      <Box>
        <Box flex direction="row" pad="small" justify="between">
          <Heading
            tag="h5"
            uppercase={true}
            align="start"
            justify="center"
            margin="none"
            truncate={true}
            data-tip={emptyMessage}
          >
            {header}
          </Heading>
          <Box direction="row">
            {Object.keys(list).map(type => (
              <Box
                key={type}
                margin={{ left: "small" }}
                onClick={() => setActiveList(type)}
              >
                <Label
                  margin="none"
                  size="small"
                  style={{ color: activeList == type ? "black" : "lightgrey" }}
                  uppercase
                >
                  {type}
                </Label>
              </Box>
            ))}
          </Box>
        </Box>
        <ReactTooltip />
      </Box>

      <Box
        flex={false}
        size={{ height: "medium", width: "xlarge" }}
        colorIndex="light-1"
      >
        {list[activeList].list.length > 0 ? (
          <Box>
            <List>
              {list[activeList].list.map((item, index) => (
                <ListItem key={index} item={item} listType={listType} />
              ))}
            </List>
            {list[activeList].list.length > 4 ? (
              <Box align="center">
                <Anchor
                  path={list[activeList].more}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <span>. . .</span>
                </Anchor>
              </Box>
            ) : null}
          </Box>
        ) : (
          <Box flex={true} justify="center" align="center">
            <ListPlaceholder
              unfilteredTotal={0}
              pad="large"
              emptyMessage={props.emptyMessage || "No analysis."}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

DashboardList.propTypes = {
  header: PropTypes.string,
  emptyMessage: PropTypes.string,
  listType: PropTypes.string,
  list: PropTypes.object,
  loading: PropTypes.bool,
  ListItem: PropTypes.func
};

export default DashboardList;
