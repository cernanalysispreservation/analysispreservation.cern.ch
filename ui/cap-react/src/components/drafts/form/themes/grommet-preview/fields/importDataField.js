import React from "react";
import PropTypes from "prop-types";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";

import axios from "axios";

class ImportDataField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      link: null
    };
  }

  componentDidMount() {
    let { $ref: refLink = null } = this.props.formData;
    if (refLink) {
      axios.get(refLink).then(res => {
        if (res.data && res.data.links) {
          this.setState({
            link: res.data.links.html
          });
        }
      });
    }
  }

  render() {
    return (
      this.state.link && (
        <Box wrap={true} pad="none">
          <Anchor
            label="view"
            href={this.state.link}
            style={{ textDecoration: "none" }}
          />
        </Box>
      )
    );
  }
}

ImportDataField.propTypes = {
  formData: PropTypes.object
};

export default ImportDataField;
