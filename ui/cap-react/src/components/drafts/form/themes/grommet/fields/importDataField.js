import React from "react";
import PropTypes from "prop-types";

import Select from "react-select";
import Box from "grommet/components/Box";

import axios from "axios";

import CustomOption from "./ImportDataFieldSelectComponent";

const EMPTY_VALUE = "---- No Selection ---- ";

class ImportDataField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      selected: undefined
    };
  }

  componentDidMount() {
    const query = this.props.uiSchema["ui:options"].query || undefined;
    let selected = this.state.selected;

    // check if there is saved selected value
    if (this.props.formData && this.props.formData.fetched) {
      selected = this.props.formData.fetched.label;
    }

    // query to fetch options for the select menu
    if (query) {
      axios.get(query).then(res => {
        let results = res.data.hits.hits.map(item => {
          let _item = {
            value: item.links.self,
            label: item.metadata.general_title || item.id,
            id: item.id,
            created: item.created
          };

          return _item;
        });

        // add one more item in order to help users clear theis choice easier
        results.unshift({
          value: undefined,
          label: EMPTY_VALUE,
          noSelection: true
        });

        this.setState({
          data: results,
          selected: selected
        });
      });
    }
  }

  render() {
    return (
      <Box pad={{ horizontal: "medium" }}>
        <Select
          isClearable
          onChange={data => {
            if (!data || !data.value) {
              this.setState({ selected: undefined }, () => {
                this.props.onChange({ $ref: undefined, fetched: undefined });
              });
            } else
              this.setState({ selected: data.label }, () =>
                this.props.onChange({ $ref: data.value, fetched: data })
              );
          }}
          options={this.state.data}
          components={{
            Option: CustomOption
          }}
          placeholder={"Select a Statistic Questionnaire"}
          value={
            this.state.selected && this.state.selected !== EMPTY_VALUE
              ? { label: this.state.selected, value: this.state.selected }
              : null
          }
        />
      </Box>
    );
  }
}

ImportDataField.propTypes = {
  onChange: PropTypes.func,
  uiSchema: PropTypes.object,
  formData: PropTypes.object
};

export default ImportDataField;
