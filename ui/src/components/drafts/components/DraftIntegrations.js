import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";

import { Accordion, Paragraph, Heading } from "grommet";
import AddIcon from "grommet/components/icons/base/FormAdd";
import AccordionPanel from "../../partials/AccordionPanel";

import TimeAgo from "react-timeago";
import { toggleFilemanagerLayer } from "../../../actions/files";

class DraftIntegrations extends React.Component {
  render() {
    return (
      <Box
        flex={true}
        size={{ width: "xxlarge" }}
        alignSelf="center"
        pad="medium"
      >
        <Box
          flex={false}
          direction="row"
          wrap={false}
          margin={{ vertical: "medium", bottom: "large" }}
        >
          <Box flex>
            <Heading tag="h3">Repositories</Heading>
            <Paragraph margin="none">
              Make the connection, follow and manage repositories. Create
              snapshots of your Github and CERN Gitlab repositories on custom
              events and preserve you code
            </Paragraph>
          </Box>
          <Box flex={false} margin={{ left: "medium" }}>
            <Button
              onClick={this.props.toggleFilemanagerLayer}
              primary
              icon={<AddIcon />}
              label="Connect your repo"
            />
          </Box>
        </Box>
        <Box flex={false}>
          <Box flex={false} pad="small" colorIndex="grey-2">
            <Heading tag="h4" margin="none">
              Connected Repositories
            </Heading>
          </Box>
          <Box flex={false} colorIndex="light-2">
            <Accordion>
              {this.props.repos && this.props.repos.length ? (
                this.props.repos.map((repo, index) => (
                  <AccordionPanel
                    key={`${repo.name}-${index}`}
                    noHeading={true}
                    headingColor="light-2"
                    heading={
                      <Box
                        flex={true}
                        direction="row"
                        wrap={false}
                        justify="between"
                      >
                        <Box flex={true}>{repo.name}</Box>
                        <Box
                          margin={{ horizontal: "small" }}
                          direction="row"
                          wrap={false}
                          flex={false}
                          size="medium"
                          alignSelf="end"
                        >
                          <Box flex={true} align="center">
                            <strong>
                              {repo.host.indexOf("github") > -1
                                ? "Github"
                                : repo.service == "gitlab"
                                  ? "CERN Gitlab"
                                  : null}
                            </strong>
                          </Box>
                          <Box flex={true} align="center">
                            {repo.branch}
                          </Box>
                          <Box flex={true} align="center">
                            <TimeAgo date={repo.updated} minPeriod="60" />
                          </Box>
                        </Box>
                      </Box>
                    }
                  >
                    <Box>
                      {repo.snapshots.map((snapshot, index) => (
                        <Box
                          key={index}
                          direction="row"
                          wrap={false}
                          pad={{
                            horizontal: "small",
                            vertical: "small",
                            between: "small"
                          }}
                        >
                          <Box
                            flex={false}
                            direction="row"
                            wrap={false}
                            pad={{ between: "small" }}
                          >
                            <strong>Ref: </strong>
                            <span>{snapshot.ref}</span>
                          </Box>
                          <Box
                            flex={false}
                            direction="row"
                            wrap={false}
                            pad={{ between: "small" }}
                          >
                            <strong>Datetime: </strong>
                            <TimeAgo date={snapshot.timestamp} minPeriod="60" />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </AccordionPanel>
                ))
              ) : (
                <Box pad="medium" justify="center" align="center">
                  No Repositories connected yet
                </Box>
              )}
            </Accordion>
          </Box>
        </Box>
      </Box>
    );
  }
}

DraftIntegrations.propTypes = {
  repos: PropTypes.object,
  toggleFilemanagerLayer: PropTypes.func
};

function mapStateToProps(state) {
  return {
    repos: state.draftItem.get("repositories")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: () =>
      dispatch(toggleFilemanagerLayer(null, null, 2, "message"))
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftIntegrations)
);
