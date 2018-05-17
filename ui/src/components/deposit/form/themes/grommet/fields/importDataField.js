import React from 'react';
import PropTypes from 'prop-types';

import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import Anchor from 'grommet/components/Anchor';
import Layer from 'grommet/components/Layer';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';

import FieldHeader from '../components/FieldHeader';
import Edit from 'grommet/components/icons/base/Edit';

class ImportDataField extends React.Component {
  constructor(props) {
    super(props);

    this._userRecords = [
      { "title": "XXXXX CMS Questionnaire 11/03/18" , "$ref": "recid:54323"},
      { "title": "CMS Questionnaire 02/02/18" , "$ref": "recid:1234"},
      { "title": "XXXXX CMS Questionnaire 14/01/18" , "$ref": "recid:9876"},
      { "title": "NNN CMS Questionnaire 23/12/17" , "$ref": "recid:777777"},
    ];

    this.state = {
      layerActive: false,
      selected: {}
    };
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
      <Box flex={true} pad="small">
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
              this._userRecords.map((r, index) => (
                <ListItem key={index} onClick={this._selectItem.bind(this, r)}>
                  <span>{r.title}</span>
                </ListItem>
              ))
            }
            </List>
             <Label>
              <span>You have selected {this.props.schema.title}: <strong>{this.state.selected.title}</strong>, with reference to </span>
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
      <Box direction="row">
        <FieldHeader
          title={this.props.schema.title}
          required={this.props.schema.required}
          description={this.props.schema.description}
          />
          {
            this.state.selected.$ref ?
            <Box flex={true} direction="row">
              <Box flex={true} direction="row" colorIndex="light-2" pad="small">
                <Heading tag="h5" strong={true} >
                  {this.state.selected.title}, {this.state.selected.$ref}
                </Heading>
              </Box>
              <Button
                icon={<Edit/>}
                onClick={this._toggleLayer.bind(this)}
              />
            </Box> :
            <Button
              label="Import"
              onClick={this._toggleLayer.bind(this)}
            />
          }
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