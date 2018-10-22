import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { fromJS } from "immutable";
import { connect } from "react-redux";

import { Box, Anchor, Label, List, ListItem } from "grommet";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.results) {
      return (
        <Box full={true} colorIndex="light-1">
          <List>
            {this.props.results.map(item => {
              let status = item.metadata._deposit.status;
              let id =
                status === "published"
                  ? item.metadata.control_number
                  : item.metadata._deposit.id;
              let metadata = fromJS(item.metadata);
              let objects = new Set();

              metadata.getIn(["main_measurements"], []).map(item => {
                return item
                  .getIn(["signal_event_selection", "physics_objects"], [])
                  .map(item => {
                    if (item.get("object")) objects.add(item.get("object"));
                  });
              });

              return (
                <ListItem pad="small" size={{ height: "xsmall" }}>
                  <Box direction="row" full={true}>
                    <Box
                      basis="1/3"
                      full={true}
                      pad={{ horizontal: "small" }}
                      align="start"
                    >
                      <Label
                        pad="none"
                        margin="none"
                        size="small"
                        uppercase={true}
                        truncate={true}
                      >
                        <Anchor
                          path={
                            status === "published"
                              ? `/published/${id}`
                              : `/drafts/${id}`
                          }
                          style={{
                            "text-decoration": "none",
                            color: "black"
                          }}
                          uppercase={true}
                        >
                          {metadata.get("general_title") || (
                            <span
                              style={{
                                color: "#ccc"
                              }}
                            >
                              No title provided
                            </span>
                          )}
                        </Anchor>
                      </Label>
                      <Box direction="row" justify="end">
                        {Array.from(objects).map((object, index) => {
                          return (
                            <Label
                              key={`${object}-${index}`}
                              size="small"
                              align="center"
                              margin="none"
                              pad="none"
                              uppercase="true"
                            >
                              {object} &nbsp;
                            </Label>
                          );
                        })}
                      </Box>
                    </Box>
                    <Box basis="2/3" full={true}>
                      {metadata.getIn(["basic_info", "abstract"]) || ""}
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Box>
      );
    } else {
      return <div>No Results</div>;
    }
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
