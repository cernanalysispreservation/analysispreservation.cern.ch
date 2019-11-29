import React from "react";

import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";

import DepositAccess from "./DepositAccess";
import { Paragraph, Heading, Anchor } from "grommet";
import { connect } from "react-redux";
// Actions
import { postPublishDraft } from "../../../actions/draftItem";

class DepositSettings extends React.Component {
  render() {
    let isDraft = this.props.status === "draft" ? true : false;
    let isPublishedOnce = this.props.recid ? true : false;

    return (
      <Box
        flex={true}
        size={{ width: "xlarge" }}
        alignSelf="center"
        pad="medium"
      >
        <Box flex={true}>
          <Box
            flex={false}
            pad="medium"
            colorIndex="light-2"
            direction="row"
            wrap={false}
            margin={{ vertical: "medium", bottom: "large" }}
          >
            <Box flex>
              <Heading tag="h4">Publish to collaboration</Heading>
              <Paragraph margin="none">
                Create a versioned snapsot of the record and make it available
                to the CMS members within CERN Analysis Preservation
              </Paragraph>
            </Box>
            <Box flex={false}>
              <React.Fragment>
                <Button
                  onClick={isDraft ? this.props.publishDraft : null}
                  primary
                  colorIndex="accent-2"
                  label="Publish"
                />
                <Box pad={{ vertical: "small" }}>
                  Current Published Version:{" "}
                  {!isPublishedOnce ? (
                    <strong>Not published yet</strong>
                  ) : (
                    <Anchor
                      label={this.props.recid}
                      path={`/published/${this.props.recid}`}
                    />
                  )}
                </Box>
              </React.Fragment>
            </Box>
          </Box>
          <DepositAccess />
        </Box>
      </Box>
    );
  }
}

DepositSettings.propTypes = {
  match: PropTypes.object,
  error: PropTypes.object,
  getDraftById: PropTypes.func,
  loading: PropTypes.bool,
  clearError: PropTypes.func,
  draft_id: PropTypes.string,
  draft: PropTypes.object,
  getUsers: PropTypes.func,
  permissions: PropTypes.array,
  handlePermissions: PropTypes.func,
  publishDraft: PropTypes.func,
  status: PropTypes.string,
  recid: PropTypes.string
};

function mapStateToProps(state) {
  return {
    recid: state.draftItem.get("recid"),
    status: state.draftItem.get("status")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    publishDraft: () => dispatch(postPublishDraft())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositSettings);
