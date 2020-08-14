import React, { useState } from "react";
import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";
import Checkmark from "grommet/components/icons/base/Checkmark";
import { CopyToClipboard } from "react-copy-to-clipboard";
import PropTypes from "prop-types";

import { Heading } from "grommet";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";

import Modal from "../partials/Modal";

const LatexPreviewer = props => {
  const [copied, setCopied] = useState(false);

  const _onCopy = () => {
    setCopied(true);
  };

  return (
    <Modal
      overlayClose={true}
      closer={true}
      onClose={props.onClose}
      align="center"
      title="LaTeX Code"
    >
      <Box flex={true} size="xlarge" pad={{ horizontal: "large" }}>
        <Box margin={{ vertical: "small" }}>
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
    </Modal>
  );
};

LatexPreviewer.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.string
};

export default LatexPreviewer;
