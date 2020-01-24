import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Truncate from "react-truncate";
import TimeAgo from "react-timeago";
import ReactTooltip from "react-tooltip";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";
import Label from "grommet/components/Label";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import { KeywordLabel } from "../StyledComponents";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.results.length > 0 ? (
      <Box
        flex={true}
        size={{ width: { max: "xxlarge" } }}
        colorIndex="light-1"
      >
        <List>
          {this.props.results.map((item, index) => {
            let rights = "";
            let {
              id,
              is_owner,
              can_admin,
              can_update,
              updated,
              status,
              labels,
              metadata = {}
            } = item;

            let {
              general_title: general_title,
              basic_info: { abstract: abstract } = {}
            } = metadata;

            if (!is_owner && (can_update || can_admin)) rights = "contributor";
            else if (is_owner) rights = "owner";

            return (
              <ListItem key={`${id}-${index}`} separator="none" pad="none">
                <Box
                  separator="bottom"
                  style={{ width: "100%" }}
                  pad={{
                    between: "small",
                    horizontal: "medium",
                    vertical: "small"
                  }}
                >
                  <Box direction="row" justify="between">
                    <Box>
                      <Anchor
                        path={
                          status === "published"
                            ? `/published/${id}`
                            : `/drafts/${id}`
                        }
                        style={{ textDecoration: "none", color: "#666" }}
                        reverse
                        pad="none"
                      >
                        <Label size="medium">
                          {general_title ? (
                            <span> {general_title} </span>
                          ) : (
                            <span style={{ color: "#ccc" }}>
                              No title provided
                            </span>
                          )}
                        </Label>
                      </Anchor>
                    </Box>
                    <Box direction="row">
                      <ReactTooltip />
                      {rights &&
                      <Box>
                        <KeywordLabel> {rights} </KeywordLabel>
                      </Box>
                      }
                      {labels.map(item => {
                        return (
                          <Box>
                            {" "}
                            <KeywordLabel> {item} </KeywordLabel>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                  {abstract ? (
                    <Box>
                      <Truncate lines={3} ellipsis={<span>...</span>}>
                        {abstract}
                      </Truncate>
                    </Box>
                  ) : null}
                  <Box direction="row" style={{ color: "#ccc" }}>
                    <span>Updated&nbsp;</span>
                    <TimeAgo date={updated} minPeriod="60" />
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

