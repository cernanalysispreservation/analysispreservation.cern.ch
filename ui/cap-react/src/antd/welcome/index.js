import React from "react";
import Intro from "./Intro";
import Discover from "./Discover";
import Explain from "./Explain";
import Integrations from "./Integrations";
import Documentation from "./Documentation";
import Contact from "./Contact";

const index = () => {
  return (
    <React.Fragment>
      <Intro />
      <Discover />
      <Explain />
      <Integrations />
      <Documentation />
      <Contact />
    </React.Fragment>
  );
};

export default index;
