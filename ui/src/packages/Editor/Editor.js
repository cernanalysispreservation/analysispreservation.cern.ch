import React, { Component } from "react";
import AceEditor from "react-ace";
import { Box, Heading } from "grommet";
import PropTypes from "prop-types";

const monacoEditorOptions = {
  minimap: {
    enabled: false
  },
  automaticLayout: true
};

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { valid: true, code: props.code };
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({ valid: true, code: props.code });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.dark === !nextProps.dark) {
      return true;
    }
    if (this.state.valid) {
      return (
        JSON.stringify(JSON.parse(nextProps.code)) !==
        JSON.stringify(JSON.parse(this.state.code))
      );
    }

    return false;
  }

  onCodeChange = code => {
    try {
      const parsedCode = JSON.parse(code);
      this.setState({ valid: true, code }, () =>
        this.props.onChange(parsedCode)
      );
    } catch (err) {
      this.setState({ valid: false, code });
    }
  };

  render() {
    const { title } = this.props;
    const icon = this.state.valid ? "ok" : "remove";
    const cls = this.state.valid ? "valid" : "invalid";
    return (
      <Box>
        <Box colorIndex="light-2" align="center">
          <Heading tag="h2">{title}</Heading>
        </Box>
        <Box>
          <AceEditor
            language="json"
            value={this.state.code}
            theme={this.props.dark ? "monokai" : "github"}
            onChange={this.onCodeChange}
            height={400}
            options={monacoEditorOptions}
          />
        </Box>
      </Box>
    );
  }
}

Editor.propTypes = {};

export default Editor;
