import React from "react";
import { connect } from "react-redux";

import MoreIcon from "grommet/components/icons/base/More";
import EditIcon from "grommet/components/icons/base/Edit";
import UserAdminIcon from "grommet/components/icons/base/UserAdmin";
import ReactTooltip from "react-tooltip";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";

import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

import TimeAgo from "react-timeago";
import { Paragraph } from "grommet";

import { push } from "connected-react-router";

function DashboardList(props) {
  let {
    header = "",
    emptyMessage = null,
    items = [],
    listType = "published",
    currentUser,
    push
  } = props;
  return (
    <Box flex={false}>
      <Box pad="small">
        <Heading
          tag="h5"
          uppercase={true}
          align="center"
          justify="center"
          margin="none"
          data-tip={emptyMessage}
        >
          {header}
        </Heading>
        <ReactTooltip />
      </Box>
      <Box flex={true}>
        <List>
          {items.length > 0 ? (
            items.map((item, index) => {
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
              let { general_title = "Untitled" } = metadata;

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
                            {schema.version ? `v.${schema.version}` : null}
                          </span>
                          <span
                            style={{
                              marginLeft: "10px",
                              padding: "1px 2px",
                              backgroundColor: "#666",
                              color: "#fff",
                              borderRadius: "2px"
                            }}
                          >
                            {currentUser == created_by ? "owner" : null}
                          </span>
                        </Box>
                        <Box flex direction="row" wrap={false}>
                          <Box
                            flex={false}
                            colorIndex="grey-4"
                            style={{ padding: "1px 5px", borderRadius: "2px" }}
                          >
                            {id}
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        flex={false}
                        direction="row"
                        wrap={false}
                        justify="between"
                      >
                        <Box>
                          {listType == "drafts" && status == "published"
                            ? status
                            : null}
                        </Box>

                        <Box justify="center" pad={{ horizontal: "small" }}>
                          <strong>last updated</strong>
                          <TimeAgo date={updated} />
                        </Box>
                        <Box align="center" justify="center">
                          {can_update ? (
                            <span style={{ padding: "2px" }}>
                              <EditIcon size="xsmall" />
                            </span>
                          ) : null}
                          {can_admin ? (
                            <span style={{ padding: "2px" }}>
                              <UserAdminIcon size="xsmall" />
                            </span>
                          ) : null}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              );
            })
          ) : (
            <Box textAlign="center">
              <ListPlaceholder
                unfilteredTotal={0}
                pad="large"
                emptyMessage={props.emptyMessage || "No analysis."}
              />
            </Box>
          )}
        </List>
      </Box>
      {props.items.length > 0 ? (
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
