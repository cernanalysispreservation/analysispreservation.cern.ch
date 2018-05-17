import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Box, Button, Anchor, Layer, FormField, Paragraph, TextInput, Title} from 'grommet';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';

import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import AddIcon from 'grommet/components/icons/base/Add';
import CloseIcon from 'grommet/components/icons/base/Close';

import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';

import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

import Form from '../deposit/form/GrommetForm';
import axios from 'axios';

import { getUsersAPIKeys, createToken, revokeToken } from '../../actions/auth';

import {applicationSchema, tokenSchema} from './utils';

class SettingsIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layer: {
        active: false
      }
    }
  }

  componentDidMount() {
    this.props.getUsersAPIKeys();
  }

  activateLayer(type, data = null) {
    this.setState({
      layer: {
        active: true,
        type: type || null,
        data: data
      }
    })
  }

  _onSubmit(type, data) {
    // FIX for frontend validation from schema
    let _data = Object.assign({}, data.formData);
    if (!(_data.scopes instanceof Array)) {
      if (_data.scopes) _data.scopes = [_data.scopes];
      else _data.scopes = [];
    }
    if (type == "token") this.props.createToken(_data);
    // else if (type == "application") this.props.createApplication(data.formData);
  }

  getLayer() {
    return (
      <Layer overlayClose={true} closer={true} onClose={()=>{this.setState({layer: {active: false}})}} align="right">
        <Box flex={true} pad="medium" size="large">
          <Heading align="start" margin={{vertical: "medium"}} tag="h3">New OAuth Application</Heading>
          <Paragraph align="start" margin="none">

          </Paragraph>
          <Form schema={this.state.layer.type == "token" ? tokenSchema : applicationSchema} onSubmit={this._onSubmit.bind(this, this.state.layer.type)}>
            <Box flex={true} margin={{vertical: "medium"}}>
              <Button label='Submit'
                type='submit'
                primary={true} />
            </Box>
          </Form>
        </Box>
      </Layer>
    )
  }

  _revokeToken(token, key) {
    this.props.revokeToken(token, key)
  }

  render() {
    return (
      <Box flex={true} pad="medium">
        {this.state.layer.active ? this.getLayer() : null}
        <Box>
          <Box pad="small" direction="row" colorIndex="neutral-1-a" justify="between">
              <Title>Tokens</Title>
              <Button label='Add Token'
                icon={<AddIcon/>}
                onClick={(this.activateLayer.bind(this, "token"))} />
          </Box>

          {
            !this.props.tokens.isEmpty() ?

            <Box colorIndex="light-2">
            <Table colorIndex="light-2">
              <thead key="token_header">
                <tr>
                  <th>id</th>
                  <th>Name</th>
                  <th>Scopes</th>
                  <th>API key</th>
                  <th>Revoke</th>
                </tr>
              </thead>
              <tbody>

                {
                  this.props.tokens.map((token, keyy) =>
                  {
                    return token && token.t_id ?
                    <TableRow key={token.t_id}>
                      {
                        [
                          <td>{token.t_id}</td>,
                          <td>{token.name}</td>,
                          <td>{token.scopes}</td>,
                          <td>{token.access_token}</td>,
                          <td><Anchor icon={<CloseIcon/>} onClick={this._revokeToken.bind(this, token.t_id, keyy)} /></td>
                        ]
                      }
                    </TableRow> : null
                  })
                }
              </tbody>
            </Table>
            </Box> :
            <ListPlaceholder
              label='Add token'
              primary={true}
              a11yTitle='Add item'
              emptyMessage='You do not have any items at the moment.'
              unfilteredTotal={0} />
          }
        </Box>
      </Box>
    );
  }
}

SettingsIndex.propTypes = {
};

function mapStateToProps(state) {
  return {
    tokens: state.auth.get('tokens'),
    // clients: state.auth.get('clients'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getUsersAPIKeys: () => dispatch(getUsersAPIKeys()),
    createToken: (data) => dispatch(createToken(data)),
    revokeToken: (t_id, key) => dispatch(revokeToken(t_id, key))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsIndex);
