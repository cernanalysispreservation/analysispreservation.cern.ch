import React, { useState } from "react";

import MoreIcon from "grommet/components/icons/base/More";

import ReactTooltip from "react-tooltip";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Label from "grommet/components/Label";

import Spinning from "grommet/components/icons/Spinning";

import List from "grommet/components/List";

import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

import DashboardListItem from "./DashboardListItem";

function DashboardList(props) {
  const [activeList, setActiveList] = useState("all");
  let { header = "", emptyMessage = null, listType, list } = props;

  return (
    <Box flex={false}>
      <Box pad="none">
        <Box
          flex={true}
          direction="row"
          pad={{ vertical: "small" }}
          justify="between"
        >
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
                  style={{ fontWeight: activeList == type ? "600" : "300" }}
                >
                  {type}
                </Label>
              </Box>
            ))}
          </Box>
        </Box>
        <ReactTooltip />
      </Box>

      <Box flex={false} size={{ height: "medium" }} colorIndex="light-1">
        {props.loading ? (
          <Box flex={true} justify="center" align="center">
            <Spinning />
          </Box>
        ) : list[activeList].list.length > 0 ? (
          <List>
            {list[activeList].list.map((item, index) => (
              <DashboardListItem key={index} listType={listType} item={item} />
            ))}
          </List>
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
      <Box align="center" margin={{ horizontal: "medium" }}>
        <Anchor
          path={list[activeList].more}
          style={{ textDecoration: "none", color: "black" }}
        >
          <MoreIcon />
        </Anchor>
      </Box>
    </Box>
  );
}

export default DashboardList;
