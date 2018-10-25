import React from "react";
import PropTypes from "prop-types";

import { Select, Box } from "grommet";

import axios from "axios";

class ImportDataField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      selected: {}
    };
  }

  componentDidMount() {
    const query = this.props.uiSchema["ui:options"].query || undefined;
    let selected = this.state.selected;

    if (query) {
      axios.get(query).then(res => {
        let results = res.data.hits.hits.map(item => {
          let _item = {
            value: item.links.self,
            label: item.metadata.general_title || item.id
          };
          if (item.links.self === this.props.formData) selected = _item.label;
          return _item;
        });

        results.unshift({
          value: undefined,
          label: "none"
        }); // adds option to remove selection

        this.setState({
          data: results,
          selected: selected
        });
      });
    }
  }

  _saveSelection = ({ option }) => {
    this.setState({ selected: option.label }, () =>
      this.props.onChange(option.value)
    );
  };

  render() {
    return (
      <Select
        options={this.state.data}
        onChange={this._saveSelection}
        value={this.state.selected}
        placeHolder="Pick created statistics questionnaire"
        style={{ height: "3.4em" }}
      />
    );
  }
}

ImportDataField.propTypes = {
  onChange: PropTypes.func,
  uiSchema: PropTypes.object,
  formData: PropTypes.object
};

export default ImportDataField;
