import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import { Accordion, Paragraph, Heading, Label } from "grommet";
import AccordionPanel from "../../partials/AccordionPanel";

import TimeAgo from "react-timeago";
import { toggleFilemanagerLayer } from "../../../actions/files";
import RepoUploader from "./DepositFileManager/RepoUploader";
import { FaGithub, FaGitlab } from "react-icons/fa";
import { LinkIcon } from "grommet/components/icons/base";

class DraftIntegrations extends React.Component {
  renderResourceIcon = (resource) => {
    return resource == "github.com" ? (
      <Box margin={{ right: "large" }} direction="row" pad={{ between: "small" }} justify="center" align="center" responsive={false}>
        <FaGithub size="18" />
        <Label size="small">Github</Label>
      </Box>
    ) : (
        <Box margin={{ right: "large" }} direction="row" pad={{ between: "small" }} justify="center" align="center" responsive={false}>
          <FaGitlab size="18" />
          <Label size="small">CERN Gitlab</Label>
        </Box>
      );
  }

  render() {
    return (
      <Box
        flex={false}
        size={{ width: "xxlarge" }}
        alignSelf="center"
        pad="small"
        margin={{ vertical: "small", bottom: "large" }}
      >
        <Box
          flex={false}
          direction="row"
          wrap={false}
          margin={{ vertical: "small", bottom: "large" }}
        >
          <Box flex={true}>
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
        {this.props.canUpdate && (
          <Box flex={false} margin={{ bottom: "medium" }}>
            <Heading tag="h4">Add a new repository</Heading>
            <Box flex={false} pad="small" colorIndex="light-2">
              <RepoUploader />
            </Box>
          </Box>
        )}
        <Box flex={false}>
          <Heading tag="h4">Connected Repositories</Heading>
          <Box flex={false} colorIndex="light-2" separator="vertical">
            <Accordion>
              <Box separator="horizontal" pad="small" flex direction="row" wrap={false} align="center" justify="between" responsive={false} colorIndex="light-1">
                <Box flex direction="row" align="center" wrap={false} >
                  <strong>Repository</strong>
                </Box>
                <Box direction="row" wrap={false} flex={true} size={{ width: { max: "medium" } }}>
                  <strong>Upload Event</strong>
                </Box>
              </Box>
              {this.props.repos && this.props.repos.length ? (
                this.props.repos.map((repo, index) => (
                  <AccordionPanel
                    key={`${repo.name}-${index}`}
                    noHeading={true}
                    headingColor="light-2"
                    heading={
                      <Box flex direction="row" align="center" justify="between" wrap={false} responsive={false}>
                        <Box flex direction="row" align="center" wrap={false} responsive={false}>
                          {this.renderResourceIcon(repo.host)}
                          <strong>{repo.owner}/{repo.name}</strong>
                        </Box>
                        <Box direction="row" wrap={false} align="center" flex={true} pad={{ between: "small", horizontal: "small" }} size={{ width: { max: "medium" } }}>
                          <Box direction="row" pad={{ horizontal: "small" }} align="center">
                            {
                              repo.event_type == "release" ?
                                "on Release/Tag" :
                                "on Push"
                            }
                          </Box>
                          <Box>
                            {repo.branch ? `(Branch/Ref: ${repo.branch})` : null}
                          </Box>
                        </Box>
                      </Box>
                    }
                  >
                    <Box colorIndex="light-1">
                      {repo.snapshots.length > 0 ?
                        repo.snapshots.map((snapshot, index) => (
                          <Box
                            key={index}
                            direction="row"
                            justify="between"
                            wrap={false}
                            separator="bottom"
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
                              <strong>
                                {snapshot.payload.event_type == "release"
                                  ? snapshot.payload.release.tag
                                  : snapshot.payload.commit.slice(-1)[0].message}
                              </strong>
                              <TimeAgo date={snapshot.created} minPeriod="60" />
                            </Box>
                            <Box
                              flex={false}
                              direction="row"
                              wrap={false}
                            >
                              <a target="_blank" href={snapshot.payload.link}>
                                <Box pad={{ between: "small" }} direction="row" responsive={false} wrap={false} align="center">
                                  <span>Link</span> <LinkIcon size="xsmall" />
                                </Box>
                              </a>
                            </Box>
                          </Box>
                        )) :
                        <Box separator="bottom" pad="medium" justify="center" align="center">
                          No snapshots were uploaded for this event
                      </Box>
                      }
                    </Box>
                  </AccordionPanel>
                ))
              ) : (
                  <Box separator="bottom" pad="medium" justify="center" align="center">
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
  toggleFilemanagerLayer: PropTypes.func,
  canUpdate: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    repos: state.draftItem.get("webhooks"),
    canUpdate: state.draftItem.get("can_update")
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
