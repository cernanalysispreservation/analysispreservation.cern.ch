import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import MoreIcon from "grommet/components/icons/base/More";
import EditIcon from "grommet/components/icons/base/Edit";
import UserAdminIcon from "grommet/components/icons/base/UserAdmin";
import ReactTooltip from "react-tooltip";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Label from "grommet/components/Label";
import Spinning from "grommet/components/icons/Spinning";

import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";

import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

import TimeAgo from "react-timeago";

import { push } from "connected-react-router";

function DashboardList(props) {
  const [itemsList, setitemsList] = useState([]);
  const [selectedList, setselectedList] = useState("");
  let {
    header = "",
    emptyMessage = null,
    collab_items = [],
    collab_items_title = "",
    mine = [],
    show_all = false,
    listType = "published",
    currentUser,
    push
  } = props;

  useEffect(
    () => {
      setitemsList(collab_items);
      setselectedList(collab_items_title);
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
          style={{
            borderRadius: "3px"
          }}
        >
          <Heading
            tag="h5"
            uppercase={true}
            align="left"
            justify="center"
            margin="none"
            data-tip={emptyMessage}
          >
            {header}
          </Heading>
          <Box direction="row">
            {show_all ? (
              <Box
                colorIndex={selectedList === "all" ? "grey-3" : null}
                pad={{ horizontal: "small" }}
                style={{
                  borderRadius: "3px"
                }}
                onClick={() => {
                  setitemsList(mine.concat(collab_items));
                  setselectedList("all");
                }}
              >
                all
              </Box>
            ) : null}
            <Box
              colorIndex={selectedList === collab_items_title ? "grey-3" : null}
              margin={{ horizontal: "small" }}
              pad={{ horizontal: "small" }}
              style={{
                borderRadius: "3px"
              }}
              onClick={() => {
                setitemsList(collab_items);
                setselectedList(collab_items_title);
              }}
            >
              {collab_items_title}
            </Box>
            <Box
              pad={{ horizontal: "small" }}
              colorIndex={selectedList === "mine" ? "grey-3" : null}
              style={{
                borderRadius: "3px"
              }}
              onClick={() => {
                setitemsList(mine);
                setselectedList("mine");
              }}
            >
              mine
            </Box>
          </Box>
        </Box>
        <ReactTooltip />
      </Box>
      <Box flex={true} colorIndex="light-1">
        <List>
          {itemsList.length > 0 ? (
            itemsList.map((item, index) => {
              let {
                id,
                can_admin,
                can_update,
                metadata = {},
                schema,
                status,
                created_by,
                updated
              } = item;
              let {
                general_title = "Untitled",
                basic_info: { abstract = "" } = {}
              } = metadata;

              return (
                <ListItem key={`${item.id}-${index}`}>
                  <Box
                    flex={true}
                    justify="center"
                    onClick={() => push(`${props.urlDetailed}/${id}`)}
                  >
                    <Box flex={false} direction="row" wrap={false}>
                      <Box flex={true} margin={{ right: "large" }}>
                        <Box
                          flex={false}
                          align="center"
                          justify="start"
                          direction="row"
                          wrap
                        >
                          <Heading strong tag="h6" margin="none" truncate>
                            {general_title}
                          </Heading>
                          <span
                            style={{
                              paddingLeft: "4px",
                              fontWeight: "600",
                              color: "#666"
                            }}
                          >
                            {" "}
                            - {schema.name}{" "}
                            {/* {schema.version ? `v.${schema.version}` : null} */}
                          </span>
                          {listType == "drafts" && status == "published" ? (
                            <Box
                              justify="center"
                              colorIndex="accent-3"
                              style={{ padding: "1px", borderRadius: "2px" }}
                            >
                              published
                            </Box>
                          ) : null}
                        </Box>
                        <Box flex direction="row" wrap={false}>
                          <Box flex={false}>
                            <Label size="small" truncate={true}>
                              {abstract}
                            </Label>
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        flex={false}
                        direction="row"
                        wrap={false}
                        justify="between"
                      >
                        {/* {currentUser == created_by ? (
                          <Box justify="center">
                            <span
                              style={{
                                marginLeft: "10px",
                                padding: "1px 2px",
                                backgroundColor: "#666",
                                color: "#fff",
                                borderRadius: "2px"
                              }}
                            >
                              owner
                            </span>
                          </Box>
                        ) : null} */}

                        <Box
                          align="center"
                          justify="center"
                          direction="row"
                          margin={{ horizontal: "small" }}
                        >
                          {can_update ? (
                            <span style={{ padding: "2px" }}>
                              <EditIcon size="xsmall" data-tip="edit record" />
                            </span>
                          ) : null}
                          {can_admin ? (
                            <span style={{ padding: "2px" }}>
                              <UserAdminIcon
                                size="xsmall"
                                data-tip="record owner"
                              />
                            </span>
                          ) : null}
                        </Box>
                        <ReactTooltip />
                        <Box
                          justify="center"
                          textAlign="right"
                          style={{
                            fontWeight: "400",
                            color: "#666"
                          }}
                        >
                          <span>updated</span>
                          <TimeAgo date={updated} minPeriod="60" />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              );
            })
          ) : (
            <Box flex={true} justify="center" align="center">
              <ListPlaceholder
                unfilteredTotal={0}
                pad="large"
                emptyMessage={props.emptyMessage || "No analysis."}
              />
              <Spinning />
            </Box>
          )}
        </List>
      </Box>
      {props.collab_items.length > 0 ? (
        <Box align="center" margin={{ horizontal: "medium" }}>
          <Anchor
            path={props.urlMore}
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
