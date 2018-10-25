import React from "react";
import PropTypes from "prop-types";

import { Box, Anchor } from "grommet";

import axios from "axios";

class ImportDataField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      link: "#"
    };
  }

  componentDidMount() {
    let url = this.props.formData || undefined;
    if (url) {
      axios.get(url).then(res => {
        if (res.data && res.data.links) {
          this.setState({
            link: res.data.links.html || "#"
          });
        }
      });
    }
  }

  render() {
    return (
      <Box wrap={true} pad="none">
        <Anchor
          label="view"
          href={this.state.link}
          style={{ textDecoration: "none" }}
        />
      </Box>
    );
  }
}

ImportDataField.propTypes = {
  formData: PropTypes.object
};

export default ImportDataField;
