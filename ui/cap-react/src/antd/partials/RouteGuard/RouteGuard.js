import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Prompt } from "react-router";
import { Alert, Modal } from "antd";

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

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.pathname);
    }
  }, [confirmedNavigation, lastLocation]);

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <Modal
        open={showModal}
        onCancel={closeModal}
        okButtonProps={{
          onClick: confirmNavigation,
        }}
        cancelText="Cancel"
        okText="Exit without saving"
        title="Do you want to exit without saving?"
      >
        <Alert
          message="Are you sure you want to leave this page without saving?"
          description="It seems that you have unsaved updated data in your draft"
          type="warning"
          showIcon
        />
      </Modal>
    </>
  );
};

RouteGuard.propTypes = {
  navigate: PropTypes.func,
  shouldBlockNavigation: PropTypes.func,
};

export default RouteGuard;
