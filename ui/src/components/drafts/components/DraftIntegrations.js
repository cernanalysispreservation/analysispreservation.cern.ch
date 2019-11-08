import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";

import { Accordion, Paragraph, Heading, ListItem, List } from "grommet";
import AddIcon from "grommet/components/icons/base/FormAdd";
import AccordionPanel from "../../partials/AccordionPanel";

import TimeAgo from "react-timeago";
import { toggleFilemanagerLayer } from "../../../actions/files";

const repositories = [
  {
    name: "cernanalysispreservation/analysispreservation.cern.ch",
    service: "github",
    event: "onTrigger",
    updated: "24/09/2019"
  },
  {
    name: "cernanalysispreservation/analysispreservation.cern.ch",
    service: "github",
    event: "onPush",
    updated: "22/09/2019"
  },
  {
    name: "analysispreservation/cap-client",
    service: "gitlab",
    event: "onTrigger",
    updated: "20/09/2019"
  }
];

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
          <Box
            flex={false}
            margin={{ left: "medium", vertical: "small" }}
            align="end"
          >
            <Button
              onClick={this.props.toggleFilemanagerLayer}
              primary
              colorIndex="accent-2"
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
              {repositories.map((repo, index) => (
                <AccordionPanel
                  key={index}
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
                        responsive={false}
                        wrap={false}
                        flex={false}
                        size="medium"
                        alignSelf="end"
                      >
                        <Box flex={true} align="center">
                          <strong>
                            {repo.service == "github"
                              ? "Github"
                              : repo.service == "gitlab"
                                ? "CERN Gitlab"
                                : null}
                          </strong>
                        </Box>
                        <Box flex={true} align="center">
                          {repo.event}
                        </Box>
                        <Box flex={true} align="center">
                          <TimeAgo date={repo.updated} minPeriod="60" />
                        </Box>
                      </Box>
                    </Box>
                  }
                >
                  <Box>sfds</Box>
                </AccordionPanel>
              ))}
            </Accordion>
          </Box>
        </Box>
      </Box>
    );
  }
}

DraftIntegrations.propTypes = {
  repos: PropTypes.object
};

function mapStateToProps(state) {
  return {
    repos: state.draftItem.get("repos")
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
