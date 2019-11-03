import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import MoreIcon from "grommet/components/icons/base/More";
import EditIcon from "grommet/components/icons/base/Edit";
import UserAdminIcon from "grommet/components/icons/base/UserAdmin";
import UserIcon from 'grommet/components/icons/base/User';

import ReactTooltip from "react-tooltip";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Label from "grommet/components/Label";
import Paragraph from "grommet/components/Paragraph";

import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";

import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

import TimeAgo from "react-timeago";

import { push } from "connected-react-router";

function DashboardList(props) {
  const [itemsList, setItemsList] = useState([]);
  const [selectedList, setSelectedList] = useState("");
  const [link, setLink] = useState("");
  let {
    header = "",
    emptyMessage = null,
    datasets = {},
    push
  } = props;

  useEffect(
    () => {
      setItemsList(datasets.all ? datasets.all.data: []);
      setSelectedList('all');
      setLink(datasets.all ? datasets.all.more : '');
      return () => {
        console.log("Return");
      };
    },
    [props]
  );

  return (
    <Box flex={false}>
      <Box pad="none">
        <Box
          flex={true}
          size="full"
          direction="row"
          pad="small"
          justify="between"
        >
          <Heading
            tag="h5"
            uppercase={true}
            justify="center"
            margin="none"
            data-tip={emptyMessage}
          >
            {header}
          </Heading>
          <Box direction="row">
              {Object.entries(datasets).map( ([key, value]) => {
              return (<Box
                pad={{ horizontal: "small" }}
                onClick={() => {
                  setItemsList(value.data);
                  setSelectedList(key);
                    setLink(value.more);
                }}
              >
                <Paragraph
                  margin="none"
                
                >
                    <span style={{fontWeight: selectedList === key ? "bold": "lighter"}}>{key}</span>
                </Paragraph>
              </Box>
              );}
              )}
          </Box>
        </Box>
        <ReactTooltip />
      </Box>
      <Box
        flex
        colorIndex="light-1"
        size={{height: {max: "medium"}}}
        style={{ height: "100%"}}
      >
        <List>
          {itemsList.length > 0 ? (
            itemsList.map((item, index) => {
              let {
                id,
                can_admin,
                can_update,
                is_owner,
                metadata = {},
                updated
              } = item;
              let {
                general_title = "Analysis",
                basic_info: { abstract = "" } = {}
              } = metadata;

              return (
                <ListItem key={`${item.id}-${index}`}>
                  <Box
                    justify="between"
                    direction="row"
                    onClick={() => push(`${props.urlDetailed}/${id}`)}
                    style={{
                      overflow: "visible"
                    }}
                    flex
                  >
                      <Box margin={{ right: "medium" }} style={{overflow: "visible"}} flex>
                        <Box direction="row" >
                          <Heading strong tag="h6" margin="none" truncate>
                            {general_title}
                          </Heading>
                          <Box justify="end" pad={{horizontal: "small"}}>
                          {!is_owner && (can_update || can_admin)  ? (
                            <span>
                              <EditIcon size="xsmall" data-tip="contributor" />
                            </span>
                          ) : null}
                          {is_owner ? (
                            <span>
                              <UserIcon size="xsmall" data-tip="owner" />
                            </span>
                          ) : null}
                        </Box>
                        <ReactTooltip />
                        </Box>
                        <Box flex style={{overflow: "visible"}}>
                            <Label size="small" margin="none" truncate>
                                <i>{abstract || ""}</i>
                            </Label>
                        </Box>
                      </Box>

                        <Box
                          justify="center"
                          textAlign="right"
                          style={{fontWeight: "light"}}
                        >
                            <span>updated</span>
                            <TimeAgo date={updated} minPeriod="60" />
                        </Box>
                  </Box>
                </ListItem>
              );
            })
          ) : (
            <Box flex justify="center" align="center">
              <ListPlaceholder
                unfilteredTotal={0}
                pad="large"
                emptyMessage={props.emptyMessage || "No analysis."}
              />
            </Box>
          )}
        </List>
      </Box>
      {itemsList.length > 0 ? (
        <Box align="center" margin={{ horizontal: "medium" }}>
          <Anchor
            path={link}
            style={{ textDecoration: "none", color: "black" }}
          >
            <MoreIcon />
          </Anchor>
        </Box>
      ) : null}
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    currentUser: state.auth.getIn(["currentUser", "profile", "email"])
  };
}

export default connect(
  mapStateToProps,
  { push }
)(DashboardList);
