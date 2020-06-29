import React, { useState } from "react";
import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";
import Checkmark from "grommet/components/icons/base/Checkmark";
import { CopyToClipboard } from "react-copy-to-clipboard";
import PropTypes from "prop-types";

import { Heading } from "grommet";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import Button from "../partials/Button";

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
          <Box flex={true} margin={{ vertical: "small" }} align="center">
            <CopyToClipboard onCopy={_onCopy} text={decodeURI(props.data)}>
              <Button
                primary={!copied}
                disabled={copied}
                icon={copied && <Checkmark />}
                text={copied ? "Copied" : "Copy to Clipboard"}
              />
            </CopyToClipboard>
          </Box>
        </Box>
      </Box>
    </Layer>
  );
};

LatexPreviewer.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.string
};

export default LatexPreviewer;
