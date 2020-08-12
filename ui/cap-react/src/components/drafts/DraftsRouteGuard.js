import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import equal from "deep-equal";
import cleanDeep from "clean-deep";
import { withRouter } from "react-router";

import { initForm } from "../../actions/draftItem";
import RouteGuard from "../RouteGuard";

const DraftsRouteGuard = ({
  formData = {},
  metadata = {},
  history = {},
  draft_id = "",
  initDraftState = null
}) => {
  // if the user updates the title from the draft page
  // formData is initialised as null, therefore the check to make sure
  // that formData is object and has data
  if (formData) formData.general_title = metadata.general_title;

  useEffect(() => {
    return () => {
      if (!location.pathname.startsWith(`/drafts/`)) {
        initDraftState();
      }
    };
  }, []);

  const renderBasedOnData = equals => {
    const selectContent = {
      true: null,
      false: (
        <RouteGuard
          when={true}
          navigate={path => history.push(path)}
          shouldBlockNavigation={location => {
            if (!location.pathname.startsWith(`/drafts/${draft_id}`)) {
              return true;
            }
            return false;
          }}
        />
      )
    };
    return selectContent[equals];
  };

  return <div>{renderBasedOnData(equal(cleanDeep(formData), metadata))}</div>;
};

DraftsRouteGuard.propTypes = {
  formData: PropTypes.object,
  metadata: PropTypes.object,
  history: PropTypes.object,
  draft_id: PropTypes.string,
  initDraftState: PropTypes.func
};

const mapStateToProps = state => ({
  formData: state.draftItem.get("formData"),
  metadata: state.draftItem.get("metadata")
});

const mapDispatchToProps = dispatch => ({
  initDraftState: () => dispatch(initForm())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftsRouteGuard)
);
