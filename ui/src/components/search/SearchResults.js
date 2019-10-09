import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { fromJS } from "immutable";
import { connect } from "react-redux";
import Truncate from "react-truncate";
import AnnounceIcon from "grommet/components/icons/base/Announce";
import ReactTooltip from "react-tooltip";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";
import Label from "grommet/components/Label";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import UserAdminIcon from "grommet/components/icons/base/UserAdmin";
import EditIcon from "grommet/components/icons/base/Edit";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.results.length > 0 ? (
      <Box full={true} colorIndex="light-1">
        <List>
          {this.props.results.map((item, index) => {
            let { id, status, metadata = {} } = item;

            let {
              main_measurements: main_measurements = [],
              general_title: general_title,
              basic_info: { abstract: abstract } = {}
            } = metadata;
            let objects = new Set();

            if (main_measurements.length > 0) {
              main_measurements.map(item => {
                let {
                  signal_event_selection: { physics_objects: physics_objects }
                } = item;
                physics_objects.map(
                  ph_object =>
                    ph_object.object ? objects.add(ph_object.object) : null
                );
              });
            }

            return (
              <ListItem
                size={{ height: "xsmall" }}
                pad={{ vertical: "small" }}
                key={`${id}-${index}`}
              >
                <Box direction="row" full={true}>
                  <Box
                    basis="1/3"
                    full={true}
                    align="start"
                    separator="right"
                    pad={{ horizontal: "medium" }}
                  >
                    <Box alignSelf="stretch" direction="row" justify="between">
                      <ReactTooltip />
                      <Label size="small" uppercase={true} truncate={true}>
                        <Anchor
                          path={
                            status === "published"
                              ? `/published/${id}`
                              : `/drafts/${id}`
                          }
                          style={{
                            textDecoration: "none",
                            color: "black"
                          }}
                          data-tip={general_title}
                        >
                          {general_title || (
                            <span style={{ color: "#ccc" }}>
                              No title provided
                            </span>
                          )}
                        </Anchor>
                      </Label>
                      <Box align="center" justify="center">
                        {(item.can_admin && (
                          <UserAdminIcon
                            size="xsmall"
                            data-tip="You have admin access."
                          />
                        )) ||
                          (item.can_edit && (
                            <EditIcon
                              size="xsmall"
                              data-tip="You have write access."
                            />
                          ))}
                      </Box>
                    </Box>
                    {status === "published" ? (
                      <Label size="small" uppercase={true}>
                        <AnnounceIcon size="xsmall" /> Published
                      </Label>
                    ) : null}
                  </Box>
                  <Box
                    basis="2/3"
                    full={true}
                    pad={{ horizontal: "medium" }}
                    justify="center"
                  >
                    {abstract ? (
                      <i>
                        <Truncate lines={3} ellipsis={<span>...</span>}>
                          {abstract || ""}
                        </Truncate>
                      </i>
                    ) : (
                      <i style={{ color: "#ddd" }}> no abstract </i>
                    )}
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>
    ) : null;
  }
}

SearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  userId: PropTypes.string,
  size: PropTypes.string,
  user_id: PropTypes.number
};

function mapStateToProps(state) {
  return {
    user_id: state.auth.getIn(["currentUser", "userId"])
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SearchResults));
