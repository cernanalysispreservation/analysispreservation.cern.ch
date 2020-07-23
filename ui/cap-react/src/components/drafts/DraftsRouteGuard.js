import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import equal from "deep-equal";
import cleanDeep from "clean-deep";
import { withRouter } from "react-router";

import { initForm } from "../../actions/draftItem";
import RouteGuard from "../RouteGuard";

const DraftsRouteGuard = props => {
  // if the user updates the title from the draft page
  if (props.metadata && props.metadata.general_title)
    props.formData.general_title = props.metadata.general_title;

  useEffect(() => {
    return () => {
      if (!location.pathname.startsWith(`/drafts/`)) {
        props.initDraftState();
      }
    };
  }, []);

  const renderBasedOnData = equals => {
    const selectContent = {
      true: null,
      false: (
        <RouteGuard
          when={true}
          navigate={path => props.history.push(path)}
          shouldBlockNavigation={location => {
            if (!location.pathname.startsWith(`/drafts/${props.draft_id}`)) {
              return true;
            }
            return false;
          }}
        />
      )
    };
    return selectContent[equals];
  };

  return (
    <div>
      {renderBasedOnData(equal(cleanDeep(props.formData), props.metadata))}
    </div>
  );
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
