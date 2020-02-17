import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import { Accordion, Paragraph, Heading } from "grommet";
import AccordionPanel from "../../partials/AccordionPanel";

import TimeAgo from "react-timeago";
import { toggleFilemanagerLayer } from "../../../actions/files";
import RepoUploader from "./DepositFileManager/RepoUploader";

class DraftIntegrations extends React.Component {
  render() {
    return (
      <Box
        flex={true}
        size={{ width: "xxlarge" }}
        alignSelf="center"
        pad="small"
      >
        <Box
          flex={false}
          direction="row"
          wrap={false}
          margin={{ vertical: "small", bottom: "large" }}
        >
          <Box flex>
            <Heading tag="h3">Repositories</Heading>
            <Paragraph margin="none">
              <strong>Download</strong> a snapshot of repository, that you'd
              like to preserve with your analysis. You can point to the whole
              repo, specific branch or even a single file - whatever your
              analysis needs.<br />
              <strong>Connect</strong> with repository, to make sure that your
              analysis will keep updated on its changes. Every time changes are
              pushed to a given branch, we'll download its latest version and
              attach to your analysis.
            </Paragraph>
          </Box>
        </Box>
        <Box margin={{ bottom: "medium" }}>
          <Heading tag="h4">Add a new repository</Heading>
          <Box pad="small" colorIndex="light-2">
            <RepoUploader />
          </Box>
        </Box>
        <Box flex={false}>
          <Heading tag="h4">Connected Repositories</Heading>
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
