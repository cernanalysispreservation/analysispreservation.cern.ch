import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import { Layer } from "grommet";

class ImportLayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layers: [],
      clipboardData: null
    };

    this.uiOptionImport = this.props.options;
    this.pasteDesctiption =
      this.uiOptionImport && this.uiOptionImport.description
        ? this.uiOptionImport.description
        : "Paste your list here. Insert one item per line:";
    this.pastePlaceholder =
      this.uiOptionImport && this.uiOptionImport.placeholder
        ? this.uiOptionImport.placeholder
        : "ex.\n\nitem1 \n\nitem2 \n\nitem3\n";
  }

  render() {
    return (
      <Layer
        flush={true}
        closer={true}
        overlayClose={true}
        onClose={this._enableImport}
      >
        <Box flex={false} size="large" colorIndex="light-2" pad="medium">
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
              <Box pad={{ vertical: "small" }}>{this.pasteDesctiption}</Box>
              <Box flex={true}>
                <textarea
                  value={this.props.data}
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
                  onChange={this.props.onDataChange}
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
                  onClick={this.props.onImport}
                >
                  Import
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Layer>
    );
  }
}

ImportLayer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  onImport: PropTypes.func,
  onDataChange: PropTypes.func
};

export default ImportLayer;
