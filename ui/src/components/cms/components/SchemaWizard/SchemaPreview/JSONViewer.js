import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";
import { Heading } from "grommet";

import Highlight, { defaultProps } from "prism-react-renderer";

class JSONViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box size={{ horizontal: "small" }} flex={true}>
        <Box flex={false} colorIndex="neutral-4" pad={{ horizontal: "small" }}>
          <span>{this.props.title || "No title"}</span>
        </Box>
        <Box flex={true} colorIndex="unknown">
          <Highlight
            {...defaultProps}
            code={`${JSON.stringify(this.props.data, null, 4)}`}
            language="json"
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={className}
                style={{ ...style, ...{ marginBottom: 0 } }}
              >
                {tokens.map((line, i) => (
                  <div {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </Box>
      </Box>
    );
  }
}

JSONViewer.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object
};

export default JSONViewer;
