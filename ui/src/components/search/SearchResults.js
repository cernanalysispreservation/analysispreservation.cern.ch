import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { fromJS } from "immutable";
import { connect } from "react-redux";

import { Box, Anchor, Label, List, ListItem } from "grommet";

import Edit from "grommet/components/icons/base/Edit";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    if (this.props.results) {
      return (
        <Box flex={true} colorIndex="light-2">
          <List>
            {this.props.results.map(item => {
              let metadata = fromJS(item.metadata);
              let objects = new Set();
              metadata.getIn(["main_measurements"], []).map(item => {
                return item
                  .getIn(["signal_event_selection", "physics_objects"], [])
                  .map(item => {
                    if (item.get("object")) objects.add(item.get("object"));
                  });
              });

              let draft_id = item.metadata._deposit.id;

              let is_owner =
                item.metadata._deposit.owners.indexOf(this.props.user_id) > -1;
              let can_update =
                item.metadata._access["deposit-update"].user.indexOf(
                  this.props.user_id
                ) > -1;

              return (
                <ListItem
                  key={item.created}
                  pad={
                    this.props.size == "small"
                      ? { vertical: "none", horizontal: "small" }
                      : "medium"
                  }
                >
                  <Box flex={true} wrap={true} direction="row">
                    <Box flex={true} direction="row">
                      <Box flex={true} basis="1/4" align="start">
                        <Label pad="none" margin="none">
                          <Anchor path={`/drafts/${draft_id}`}>
                            {metadata.get("general_title") ||
                              metadata.getIn([
                                "basic_info",
                                "analysis_title"
                              ]) ||
                              metadata.getIn([
                                "basic_info",
                                "analysis_number"
                              ]) ||
                              metadata.getIn(["basic_info", "cadi_id"]) ||
                              metadata.getIn([
                                "basic_info",
                                "ana_notes",
                                0
                              ]) || (
                                <span style={{ color: "#ccc" }}>
                                  No title provided
                                </span>
                              )}
                          </Anchor>
                        </Label>
                        <Label size="small" margin="none">
                          {draft_id}
                        </Label>
                        <Box direction="row" align="end">
                          {Array.from(objects).map(object => {
                            return (
                              <Label
                                size="small"
                                align="center"
                                margin="medium"
                                uppercase="true"
                              >
                                {object} &nbsp;
                              </Label>
                            );
                          })}
                        </Box>
                      </Box>
                      <Box flex={true} basis="3/4">
                        <Label margin="none">
                          {metadata.getIn(["cadi_info", "name"]) ||
                            metadata.getIn(["basic_info", "measurement"])}
                        </Label>
                        {metadata.getIn(["basic_info", "abstract"]) || (
                          <span style={{ color: "#ccc" }}>No abstract</span>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    {is_owner ? (
                      <Box key="owner">
                        <span>Owner</span>
                      </Box>
                    ) : null}
                    {can_update ? (
                      <Anchor
                        key="edit"
                        path={`/drafts/${draft_id}/edit`}
                        icon={<Edit />}
                      />
                    ) : null}
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
  history: PropTypes.object.isRequired
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
