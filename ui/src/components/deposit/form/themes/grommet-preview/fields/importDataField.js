import React from 'react';
import PropTypes from 'prop-types';

import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Anchor from 'grommet/components/Anchor';
import Layer from 'grommet/components/Layer';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';

import FieldHeader from '../components/FieldHeader';
import Edit from 'grommet/components/icons/base/Edit';
import Link from 'grommet/components/icons/base/Link';

import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

import axios from 'axios';

class ImportDataField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layerActive: false,
      data: null,
      selected: {}
    };
  }

  componentDidMount() {
    const q = this.props.uiSchema["ui:options"].query || undefined;
    if (q) {
      axios.get(q)
        .then((res) => {
          if (res.data && res.data.hits) {
            this.setState({data: res.data.hits.hits})
          }
        })
    }
  }

  _toggleLayer() {
    this.setState(prevState => ({layerActive: !prevState.layerActive}));
  }

  _selectItem(item) {
    this.setState({selected: item});
  }

  _saveSelection() {
    this.setState(
      prevState => ({layerActive: !prevState.layerActive}),
      () => this.props.onChange(this.state.selected)
    );
  }

  render() {
    return (
      <Box flex={true}>
      {
        this.state.layerActive ?
        <Layer
          closer={true}
          onClose={this._toggleLayer.bind(this)}
          overlayClose={true}
        >
          <Box flex={true} size="medium">
            <Label>
              {this.props.schema.title}
            </Label>
            <List>
            {
              this.state.data ? this.state.data.map((r, index) => (
                <ListItem key={index} onClick={this._selectItem.bind(this, r)}>
                  <span>{r.metadata.general_title || r.metadata.$ana_type || "-----"}</span>
                </ListItem>
              )) :
              <ListPlaceholder
                emptyMessage='No results where found for this query.'
                unfilteredTotal={0}/>
            }
            </List>
             <Label>
              <span>You have selected {this.props.schema.title}: <strong>{this.state.selected ? this.state.selected.metadata ? this.state.selected.metadata.general_title : "" : "---"}</strong></span>
               <Anchor
                href="#"
                target="_blank"
                label={this.state.selected.$ref}/>
            </Label>
            <Box flex={true} pad="small" justify="between" direction="row">
              <Button
                label="OK"
                primary={true}
                onClick={this._saveSelection.bind(this)}
              />
              <Button
                label="Cancel"
                onClick={this._toggleLayer.bind(this)}
              />
            </Box>
          </Box>
        </Layer> : null
      }
      <Box>
        <FieldHeader
          title={this.props.schema.title}
          required={this.props.schema.required}
          description={

            this.state.selected && this.state.selected.links ?
            <Box margin={{horizontal: "medium"}} flex={true} direction="row">
              <Box flex={true} direction="row" align="center" colorIndex="light-2" pad={{horizontal: "small"}}>
                {this.state.selected ? this.state.selected.metadata ? this.state.selected.metadata.general_title : "" : "---"}
                <Anchor href={this.state.selected.links.self} icon={<Link size="xsmall"/>}/>
              </Box>
              <Button
                icon={<Edit/>}
                onClick={this._toggleLayer.bind(this)}
              />
            </Box> :
            <Box margin={{horizontal: "medium"}} direction="row">
              <Button
                label="Import"
                onClick={this._toggleLayer.bind(this)}
              />
            </Box>
          }
          />
      </Box>
      </Box>
    );
  }
}

ImportDataField.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  schema: PropTypes.object,
  onChange: PropTypes.func,
  properties: PropTypes.object,
};

export default ImportDataField;