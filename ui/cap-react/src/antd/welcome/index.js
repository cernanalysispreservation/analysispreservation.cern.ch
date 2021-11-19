import React from "react";
import PropTypes from "prop-types";
import Intro from "./Intro";
import Discover from "./Discover";
import Explain from "./Explain";
import Integrations from "./Integrations";
import Documentation from "./Documentation";

const index = () => {
  return (
    <div>
      <Intro />
      <Discover />
      <Explain />
      <Integrations />
      <Documentation />
    </div>
  );
};

index.propTypes = {};

export default index;
