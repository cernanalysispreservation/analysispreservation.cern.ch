import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";
import JSONViewer from "./JSONViewer";
import { Header, Anchor } from "grommet";
import SchemaTree from "../../../containers/SchemaTree";
import CodeIcon from "grommet/components/icons/base/Code";
import TreeIcon from "grommet/components/icons/base/Tree";

class SchemaPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = { view: "tree" };
  }

  render() {
    return (
      <Box
        dirrection="column"
        flex={false}
        size={{ width: "medium" }}
        justify="between"
        colorIndex="grey-3"
      >
        <Header
          size="small"
          margin="none"
          justify="end"
          pad={{ horizontal: "small" }}
        >
          {this.state.view == "tree" ? (
            <Anchor
              icon={<CodeIcon />}
              onClick={() => this.setState({ view: "json" })}
            />
          ) : (
            <Anchor
              icon={<TreeIcon />}
              onClick={() => this.setState({ view: "tree" })}
            />
          )}
        </Header>
        <Box flex={true}>
          {this.state.view == "tree" ? (
            [
              <Box
                onClick={() =>
                  this.props.selectProperty({ schema: [], uiSchema: [] })
                }
              >
                Roots
              </Box>,
              <SchemaTree />
            ]
          ) : (
            <Box>
              <JSONViewer title="Schema" data={this.props.schema} />
              <JSONViewer title="UI Schema" data={this.props.uiSchema} />
            </Box>
          )}
        </Box>
      </Box>
    );
  }
}

SchemaPreview.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

export default SchemaPreview;
