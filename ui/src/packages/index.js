import React from "react";
import Playground from "./app";

const themes = {
  default: {
    stylesheet:
      "//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
    theme: {}
  }
};

const index = () => {
  return <Playground theme={themes} />;
};

export default index;
