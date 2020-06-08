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

  const handleBlockedNavigation = nextLocation => {
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      ShowModal(nextLocation);
      return false;
    }
    return true;
  };

  useEffect(() => {
    setWhen(true);
  }, []);

  useEffect(
    () => {
      return () => {
        setShowModal(false);
        navigate(lastLocation.pathname);
      };
    },
    [confirmedNavigation]
  );

  return (
    <React.Fragment>
      <Prompt when={when} message={handleBlockedNavigation} />
      <Modal
        show={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={() => {
          setConfirmedNavigation(true);
        }}
      />
    </React.Fragment>
  );
};

RouteGuard.propTypes = {
  navigate: PropTypes.func,
  shouldBlockNavigation: PropTypes.func
};

export default RouteGuard;
