import React from "react";

import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

import DepositAccess from "./DepositAccess";
import { Paragraph, Heading } from "grommet";
import { connect } from "react-redux";
// Actions
import { toggleActionsLayer } from "../../../actions/draftItem";

import { AnnounceIcon } from "grommet/components/icons";

import ReactTooltip from "react-tooltip";

import Anchor from "../../partials/Anchor";

class DepositSettings extends React.Component {
  render() {
    let isDraft = this.props.status === "draft" ? true : false;
    let isPublishedOnce = this.props.recid ? true : false;

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
            <Heading tag="h3">Publish your analysis</Heading>
            <Paragraph margin="none">
              <strong>Publishing</strong> is the way to preserve your work
              within CAP (and CAP only). <br /> It makes a snapshot of
              everything that your analysis contains - metadata, files, plots,
              repositories - assigning to it an unique versioned identifier.{" "}
              <br /> All members of your collaboration can search and reference
              published content. <br />Once published analysis cannot be
              deleted, but can be modified and published again with a new
              version tag.
            </Paragraph>{" "}
          </Box>
          <Box flex align="center" justify="center">
            <React.Fragment>
              <Box margin="small">
                <Paragraph margin="none">
                  {isPublishedOnce ? (
                    <Anchor
                      data-tip="Latest published version"
                      label={
                        <Label size="medium" uppercase>
                          {this.props.recid}
                        </Label>
                      }
                      primary
                      path={`/published/${this.props.recid}`}
                    />
                  ) : (
                    <Anchor
                      label={
                        <Label size="medium" uppercase>
                          not published yet
                        </Label>
                      }
                      disabled
                    />
                  )}
                </Paragraph>
              </Box>
              <Box align="center" pad={{ horizontal: "small" }} margin="small">
                <Anchor
                  data-tip={
                    this.props.canUpdate
                      ? null
                      : "your account has no permissions to publish"
                  }
                  disabled={!this.props.canUpdate}
                  icon={<AnnounceIcon size="xsmall" />}
                  onClick={isDraft ? this.props.publishDraft : null}
                  label={
                    <Label size="medium" uppercase>
                      Publish {isPublishedOnce ? "New Version" : null}
                    </Label>
                  }
                />
                <ReactTooltip />
              </Box>
            </React.Fragment>
          </Box>
        </Box>
        <Box flex={true}>
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
  draft_id: PropTypes.string,
  draft: PropTypes.object,
  getUsers: PropTypes.func,
  permissions: PropTypes.array,
  publishDraft: PropTypes.func,
  status: PropTypes.string,
  recid: PropTypes.string,
  canUpdate: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    recid: state.draftItem.get("recid"),
    status: state.draftItem.get("status"),
    canUpdate: state.draftItem.get("can_update"),
    formData: state.draftItem.get("formData")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    publishDraft: () => dispatch(toggleActionsLayer("publish"))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositSettings);
