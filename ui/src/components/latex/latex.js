import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";
import Button from "grommet/components/Button";
import Checkmark from "grommet/components/icons/base/Checkmark";
import { CopyToClipboard } from "react-copy-to-clipboard";

import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { Heading } from "grommet";

const LatexPreviewer = () => {
  const [copied, setCopied] = useState(false);
  const [coded, setCoded] = useState(
    decodeURI(
      "\\begin{array}{ |c| } \\hline\n\\textbf{aa} \\\\ \\hline\nas \\\\ \\hline\nkhjsb.jdhf \\\\ \\hline\nbdkjsabfjda \\\\ \\hline\n2121 \\\\ \\hline\n\n\\end{array}\n"
    )
  );

  const _onCopy = () => {
    setCopied(true);
  };

  let latex =
    "$$\\begin{array}{ |c| } \\hline\n\\textbf{aa} \\\\ \\hline\nas \\\\ \\hline\nkhjsb.jdhf \\\\ \\hline\nbdkjsabfjda \\\\ \\hline\n2121 \\\\ \\hline\n\n\\end{array}\n$$";

  return (
    <Layer overlayClose={true} closer={true} onClose={() => {}} align="right">
      <Box flex={true} size="medium" pad={{ vertical: "large" }}>
        <Heading tag="h3">Latex</Heading>
        <Latex>{latex}</Latex>
        <Box margin={{ vertical: "small" }}>
          <Heading tag="h3">Code</Heading>
          <Box
            margin={{ vertical: "small" }}
            colorIndex="light-2"
            align="center"
            justify="center"
            pad={{ vertical: "small" }}
          >
            <pre>
              {decodeURI(
                "\\begin{array}{ |c| } \\hline\n\\textbf{aa} \\\\ \\hline\nas \\\\ \\hline\nkhjsb.jdhf \\\\ \\hline\nbdkjsabfjda \\\\ \\hline\n2121 \\\\ \\hline\n\n\\end{array}\n"
              )}
            </pre>
          </Box>
        </Box>
        <Box>
          <Box flex={true} margin={{ vertical: "small" }}>
            <CopyToClipboard onCopy={_onCopy} text={coded}>
              <Button
                icon={copied ? <Checkmark /> : ""}
                label={copied ? "Copied" : "Copy to Clipboard"}
                primary={true}
              />
            </CopyToClipboard>
          </Box>
        </Box>
      </Box>
    </Layer>
  );
};

LatexPreviewer.propTypes = {};

export default LatexPreviewer;
