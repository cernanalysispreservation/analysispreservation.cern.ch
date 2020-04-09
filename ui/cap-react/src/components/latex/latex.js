import React, { useState } from "react";
import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";
import Checkmark from "grommet/components/icons/base/Checkmark";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { Heading } from "grommet";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";

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
      <Box flex={true} size="xlarge" pad={{ vertical: "large" }}>
        <Box margin={{ vertical: "small" }}>
          <Heading tag="h3">LaTeX Code</Heading>
          <AceEditor
            mode="latex"
            theme="github"
            width="100%"
            height="200px"
            name="UNIQUE_ID_OF_DIV"
            value={props.data}
            editorProps={{ $blockScrolling: true }}
          />
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
