import React, { useState } from "react";
import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";
import Checkmark from "grommet/components/icons/base/Checkmark";
import { CopyToClipboard } from "react-copy-to-clipboard";

import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { Heading } from "grommet";

const LatexPreviewer = props => {
  const [copied, setCopied] = useState(false);

  const _onCopy = () => {
    setCopied(true);
  };

  return (
    <Layer
      overlayClose={true}
      closer={true}
      onClose={props.onClose}
      align="center"
    >
      <Box flex={true} size="medium" pad={{ vertical: "large" }}>
        <Heading tag="h3">Latex</Heading>
        <Latex>{`$$${decodeURI(props.data)}$$`}</Latex>
        <Box margin={{ vertical: "small" }}>
          <Heading tag="h3">Code</Heading>
          <Box
            margin={{ vertical: "small" }}
            colorIndex="light-2"
            align="center"
            justify="center"
            pad={{ vertical: "small" }}
          >
            <pre>{decodeURI(props.data)}</pre>
          </Box>
        </Box>
        <Box>
          <Box flex={true} margin={{ vertical: "small" }}>
            <CopyToClipboard onCopy={_onCopy} text={decodeURI(props.data)}>
              <Box
                colorIndex={!copied ? "brand" : null}
                justify="center"
                align="center"
                separator="all"
                pad="small"
              >
                {copied ? <Checkmark /> : ""}
                {copied ? "Copied" : "Copy to Clipboard"}
              </Box>
            </CopyToClipboard>
          </Box>
        </Box>
      </Box>
    </Layer>
  );
};

LatexPreviewer.propTypes = {};

export default LatexPreviewer;
