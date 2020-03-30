import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean } from "@storybook/addon-knobs/react";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import PropTypes from "prop-types";
import FieldHeader from "../FieldHeader";
import LatexPreviewer from "../../../../../../../components/latex/latex";
import { Layer } from "grommet";

class FieldHeaderStorie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {}
    };
  }

  _enableImport = () => {
    this.setState({ importEnabled: !this.state.importEnabled });
  };

  _enableLatex = () => {
    if (!this.state.latexEnabled) {
      this.setState({
        latexData: "here goes your latex code",
        latexEnabled: !this.state.latexEnabled
      });
    } else {
      this.setState({
        latexData: null,
        latexEnabled: !this.state.latexEnabled
      });
    }
  };

  render() {
    return (
      <Grommet>
        <Box align="center" flex={true} wrap={false}>
          <Box
            size={{ width: "xlarge" }}
            pad="small"
            flex={false}
            wrap={false}
            separator="all"
          >
            <FieldHeader
              {...this.props}
              enableImport={this._enableImport}
              enableLatex={this.props.enableLatex ? this._enableLatex : null}
            />
            {this.state.latexEnabled && (
              <LatexPreviewer
                data={this.state.latexData}
                onClose={this._enableLatex}
              />
            )}
            {this.state.importEnabled && (
              <Layer
                flush={true}
                closer={true}
                overlayClose={true}
                onClose={this._enableImport}
              >
                <Box
                  flex={false}
                  size="large"
                  colorIndex="light-2"
                  pad="medium"
                >
                  <Box
                    colorIndex="light-2"
                    pad={{
                      between: "small",
                      vertical: "small",
                      horizontal: "small"
                    }}
                    wrap={false}
                    flex={true}
                  >
                    <Box flex={true}>
                      <Box pad={{ vertical: "small" }}>
                        {this.pasteDesctiption}
                      </Box>
                      <Box flex={true}>
                        <textarea
                          value={this.state.clipboardData}
                          rows="20"
                          placeholder={this.pastePlaceholder}
                          style={{
                            borderRadius: "0",
                            backgroundColor: "#fff",
                            height: "100%",
                            width: "100%",
                            maxWidth: "100%",
                            minWidth: "100%",
                            wordBreak: "break-all"
                          }}
                          onChange={this._onTextareaChange}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Box
                        flex={false}
                        align="end"
                        direction="row"
                        wrap={false}
                        alignContent="end"
                        justify="end"
                        pad={{ between: "small" }}
                      >
                        <Box
                          direction="row"
                          colorIndex="brand"
                          wrap={false}
                          align="end"
                          separator="all"
                          style={{ padding: "5px" }}
                          onClick={this._doBatchImport}
                        >
                          Import
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Layer>
            )}
          </Box>
        </Box>
      </Grommet>
    );
  }
}
FieldHeaderStorie.propTypes = {
  schema: PropTypes.object,
  rawDescription: PropTypes.string
};

storiesOf("Field Header", module)
  .addDecorator(withKnobs)
  .add("Default", () => {
    let props = {
      title: text("Title:", "Title", "field header"),
      required: boolean("Required", true, "field header"),
      description: text("Description:", "Description", "field header"),
      pasteable: boolean("Pasteable:", true, "field header")
    };
    let enableLatex = boolean("Enable Latex", true, "field header");
    return <FieldHeaderStorie {...props} enableLatex={enableLatex} />;
  });
