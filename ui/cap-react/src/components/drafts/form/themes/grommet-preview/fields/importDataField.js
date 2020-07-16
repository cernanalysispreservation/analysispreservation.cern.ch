import React from "react";
import PropTypes from "prop-types";

import Anchor from "../../../../../partials/Anchor";
import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import { AiOutlineLink } from "react-icons/ai";

import axios from "axios";

// schema for the importDataField
// "statistics_questionnaire": {
//   "properties": {
//     "$ref": {
//       "type": "string"
//     }
//   },
//   "title": "Statistics Questionnare"
// }
// uiSchema for the ImportDataField
// "statistics_questionnaire": {
//   "ui:field": "ImportDataField",
//   "ui:options": {
//     "query": "/api/records/?type=cms-stats-questionnaire-v0.0.1"
//   },
//   "ui:object": "accordionObjectField"
// }
class ImportDataField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      link: null,
      fetched: undefined
    };
  }

  componentDidMount() {
    let { $ref: refLink = null, fetched = undefined } = this.props.formData;

    if (refLink) {
      axios.get(refLink).then(res => {
        if (res.data && res.data.links) {
          this.setState({
            link: res.data.links.html,
            fetched
          });
        }
      });
    }
  }

  render() {
    return this.state.link ? (
      <Box wrap={true} pad={{ horizontal: "medium" }}>
        <Anchor target="_blank" href={this.state.link}>
          <Box direction="row" align="center" responsive={false}>
            <Label size="small" style={{ marginRight: "5px" }}>
              {this.state.fetched ? this.state.fetched.id : "View"}
            </Label>

            <AiOutlineLink />
          </Box>
        </Anchor>
      </Box>
    ) : (
      <Box pad={{ horizontal: "medium" }}>-</Box>
    );
  }
}

ImportDataField.propTypes = {
  formData: PropTypes.object
};

export default ImportDataField;
