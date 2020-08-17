import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Prompt } from "react-router";
import Modal from "./RouteGuardModal";

const RouteGuard = ({ navigate, shouldBlockNavigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [lastLocation, setLastLocation] = useState({ pathname: "/" });
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const [when, setWhen] = useState(false);

  const ShowModal = location => {
    setShowModal(true);
    setLastLocation(location);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleBlockedNavigation = nextLocation => {
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      ShowModal(nextLocation);
      return false;
    }
    return true;
  };

  const confirmNavigation = () => {
    setShowModal(false);
    setConfirmedNavigation(true);
  };

  useEffect(() => {
    setWhen(true);
  }, []);

  useEffect(
    () => {
      if (confirmedNavigation && lastLocation) {
        navigate(lastLocation.pathname);
      }
    },
    [confirmedNavigation, lastLocation]
  );

  return (
    <React.Fragment>
      <Prompt when={when} message={handleBlockedNavigation} />
      <Modal
        show={showModal}
        onCancel={closeModal}
        onConfirm={confirmNavigation}
      />
    </React.Fragment>
  );
};

RouteGuard.propTypes = {
  navigate: PropTypes.func,
  shouldBlockNavigation: PropTypes.func
};

export default RouteGuard;
