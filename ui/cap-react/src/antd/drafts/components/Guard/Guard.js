import { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { initForm } from "../../../../actions/draftItem";
import equal from "deep-equal";
import cleanDeep from "clean-deep";
import RouteGuard from "../../../partials/RouteGuard";
import { withRouter } from "react-router-dom";

const Guard = ({
  formData = {},
  metadata = {},
  initDraftState,
  history,
  draft_id
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

  return !equal(cleanDeep(formData), cleanDeep(metadata)) ? (
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
  ) : null;
};

Guard.propTypes = {
  formData: PropTypes.object,
  metadata: PropTypes.object,
  draft_id: PropTypes.string,
  initDraftState: PropTypes.func,
  history: PropTypes.object
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
  )(Guard)
);
