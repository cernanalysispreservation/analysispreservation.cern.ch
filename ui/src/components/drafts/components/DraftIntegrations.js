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
            <Box direction="row" pad={{ between: "medium" }}>
              <Box basis="1/2">
                <Paragraph margin="none">
                  <strong>Download</strong> a snapshot of repository, that you'd
                  like to preserve with your analysis. You can point to the
                  whole repo, specific branch or even a single file - whatever
                  your analysis needs. Some repositories are private or
                  restricted for CERN users only (like all the repos in CERN
                  Gitlab) - to download those you need to connect your
                  Github/Gitlab account first<br />
                </Paragraph>
              </Box>
              <Box basis="1/2">
                <Paragraph margin="none">
                  <strong>Connect</strong> repositories with analysis that are
                  still in progress, to keep them in sync. We'll make a new
                  snapshot on any changes pushed in this repository. This way
                  your analysis will be always up to date with your code. Keep
                  in mind that you cannot connect to public repositories (owner
                  has to give you a specific access to do that).
                </Paragraph>{" "}
              </Box>
            </Box>
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
                      <Box flex direction="row" wrap={false}>
                        <strong>{repo.name}</strong>
                        {repo.branch ? " /" + repo.branch : null}
                      </Box>
                    }
                  >
                    <Box>
                      {repo.snapshots.map((snapshot, index) => (
                        <Box
                          key={index}
                          direction="row"
                          justify="between"
                          wrap={false}
                          pad={{
                            horizontal: "small",
                            vertical: "small",
                            between: "small"
                          }}
                          onClick={() =>
                            window.open(snapshot.payload.link, "_blank")
                          }
                        >
                          <Box
                            flex={false}
                            direction="row"
                            wrap={false}
                            pad={{ between: "small" }}
                          >
                            <strong>
                              {snapshot.payload.release !== null
                                ? snapshot.payload.release.tag
                                : snapshot.payload.commit.slice(-1)[0].message}
                            </strong>
                          </Box>
                          <Box
                            flex={false}
                            direction="row"
                            wrap={false}
                            pad={{ between: "small" }}
                          >
                            <strong>
                              {snapshot.payload.release !== null
                                ? snapshot.payload.release.name
                                : null}
                            </strong>
                          </Box>
                          <Box
                            flex={false}
                            direction="row"
                            wrap={false}
                            pad={{ between: "small" }}
                          >
                            <TimeAgo date={snapshot.created} minPeriod="60" />
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
    repos: state.draftItem.get("webhooks")
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
