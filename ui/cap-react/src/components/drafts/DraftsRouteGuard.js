import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import equal from "deep-equal";
import cleanDeep from "clean-deep";

import RouteGuard from "../RouteGuard";

const DraftsRouteGuard = ({ formData, metadata, history }) => {
  // if the user updates the title from the draft page
  if (metadata && metadata.general_title)
    formData.general_title = metadata.general_title;

  const renderBasedOnData = equals => {
    const selectContent = {
      true: null,
      false: (
        <RouteGuard
          when={true}
          navigate={path => history.push(path)}
          shouldBlockNavigation={location => {
            if (!location.pathname.startsWith(`/drafts`)) {
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
  history: PropTypes.object
};

const mapStateToProps = state => ({
  formData: state.draftItem.get("formData"),
  metadata: state.draftItem.get("metadata")
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftsRouteGuard);
