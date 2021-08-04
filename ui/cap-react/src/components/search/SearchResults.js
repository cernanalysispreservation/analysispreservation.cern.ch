import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Truncate from "react-truncate";
import TimeAgo from "react-timeago";
import { AiOutlineLink, AiOutlineUser } from "react-icons/ai";

import Box from "grommet/components/Box";

import Anchor from "../partials/Anchor";
import Label from "grommet/components/Label";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import Tag from "../partials/Tag";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.results.length > 0 ? (
      <Box colorIndex="light-2">
        <List className="search_result_box">
          {this.props.results.map((item, index) => {
            // let rights = "";

            let {
              id,
              // is_owner,
              // can_admin,
              // can_update,
              updated,
              status,
              labels,
              created,
              created_by = null,
              metadata = {}
            } = item;

            let {
              general_title: general_title,
              basic_info: { abstract: abstract } = {}
            } = metadata;

            const timeOptions = {
              day: "numeric",
              month: "long",
              year: "numeric"
            };

            const getTitle = () => {
              let title =
                !general_title || general_title.trim() === ""
                  ? "Untitled Document"
                  : general_title;
              return title;
            };

            // if (!is_owner && (can_update || can_admin)) rights = "contributor";
            // else if (is_owner) rights = "owner";

            return (
              <ListItem key={`${id}-${index}`} separator="none" pad="none">
                <Box
                  colorIndex="light-1"
                  margin={{ vertical: "small" }}
                  style={{ width: "100%", borderRadius: "2px" }}
                  pad="small"
                >
                  <Box
                    direction="row"
                    align="center"
                    justify="between"
                    responsive={false}
                  >
                    <Box direction="row" flex responsive={false}>
                      <Anchor
                        path={
                          status === "published"
                            ? `/published/${id}`
                            : `/drafts/${id}`
                        }
                        style={{ textDecoration: "none", color: "#666" }}
                        reverse
                        pad="none"
                        dataCy={getTitle()}
                      >
                        <Label
                          margin="none"
                          size="medium"
                          style={{ color: "rgb(0,0,0)" }}
                        >
                          {getTitle()}
                        </Label>
                        <AiOutlineLink
                          size="18px"
                          style={{
                            color: "rgba(0,0,0,0.5)",
                            marginLeft: "5px"
                          }}
                        />
                      </Anchor>
                    </Box>

                    {/* <Label
                      margin="none"
                      size="small"
                      style={{ color: "rgba(0,0,0,0.3)" }}
                    >
                      {labels.map((item, index) => (
                        <span key={index}> {item}</span>
                      ))}
                    </Label> */}
                  </Box>
                  <Box>
                    <Label margin="none" size="small">
                      {new Date(created).toLocaleString("en-GB", timeOptions)}
                    </Label>
                    <Box
                      flex={false}
                      direction="row"
                      wrap
                      margin={{ top: "small" }}
                      responsive={false}
                    >
                      {labels.map((item, index) => {
                        return (
                          <Box key={index} style={{ margin: "2px 4px 2px 0" }}>
                            <Tag text={item} />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  {abstract && (
                    <Box margin={{ top: "small" }}>
                      <Truncate lines={2} ellipsis={<span>...</span>}>
                        {abstract}
                      </Truncate>
                    </Box>
                  )}
                  <Box
                    direction="row"
                    style={{ color: "rgba(0,0,0,0.3)", marginTop: "10px" }}
                    justify="between"
                    responsive={false}
                  >
                    <Box>
                      {created_by && (
                        <Anchor
                          label={
                            <Box
                              direction="row"
                              align="center"
                              responsive={false}
                            >
                              <AiOutlineUser
                                size={14}
                                color="rgba(0,0,0,0.5)"
                              />
                              <Label
                                margin="none"
                                size="small"
                                style={{
                                  color: "rgba(0,0,0,0.9)",
                                  marginLeft: "5px"
                                }}
                              >
                                {created_by.profile &&
                                created_by.profile.display_name
                                  ? created_by.profile.display_name
                                  : created_by.email}
                              </Label>
                            </Box>
                          }
                          href={`mailto:${created_by.email}`}
                        />
                      )}
                    </Box>
                    <Box>
                      <Label
                        margin="none"
                        size="small"
                        style={{ color: "rgba(0,0,0,0.5)" }}
                      >
                        {updated && (
                          <React.Fragment>
                            Updated <TimeAgo date={updated} minPeriod="60" />
                          </React.Fragment>
                        )}
                      </Label>
                    </Box>
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
