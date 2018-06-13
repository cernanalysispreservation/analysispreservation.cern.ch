import React from 'react';
import {connect} from 'react-redux';
// import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  Anchor,
  Box,
  Button,
  Label,
  Menu,
  Table,
  TableRow,
} from 'grommet';

import {getPermissions, addPermissions, removePermissions, getUsers} from '../../../actions/drafts';
import CheckBox from 'grommet/components/CheckBox';

import Autosuggest from 'react-autosuggest';

const renderSuggestion = suggestion => {
  return <Menu responsive={true}
                inline={true}
                size='small'
                primary={false}>
            <Anchor href='#'
              className='active'>
              {suggestion.email}
            </Anchor>
        </Menu>
}

const theme = {
  input: {
    width: 350,
    padding: '10px 20px',
    fontWeight: 300,
    fontSize: 16,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  suggestionsContainer: {
    display: 'none'
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    width: 350,
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px'
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd'
  }
}

class DepositSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: [],
      selected: ''
    };
  }

  componentDidMount() {
    this.props.getPermissions(this.props.draft_id);
    this.props.getUsers();
  }

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.props.users.filter(item =>
      item.email.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  getSuggestionValue = suggestion => {
    this.setState({selected:suggestion.email})
    return suggestion.email
  };

  onChange = (event, { newValue }) =>
    this.setState({ value: newValue });

  onSuggestionsFetchRequested = ({ value }) =>
    this.setState({ suggestions: this.getSuggestions(value) });

  onSuggestionsClearRequested = () =>
    this.setState({ suggestions: [] });

  permissionExists(grouped, action){
    let actionExists = _.filter(grouped, ['action', action]);
    return actionExists.length > 0 ? true: false
  }

  render() {
    let permissions = this.props.permissions;
    var grouped = _.groupBy(permissions, function(permission) {
      return permission.identity;
    });

    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type email to FILTER or ADD access rights',
      onChange: this.onChange,
      value,
    };

    return (
      <Box>
        <Box flex={true} pad='small' size='large' justify="center" direction='row'>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              theme={theme}
            />
            <Button label='Add rights'
                    primary={true}
                    plain={false}
                    onClick={() => {this.props.addPermissions(this.props.draft_id, this.state.selected, 'deposit-read')}}
            />
        </Box>
        <Box flex={true}>
          <Table>
            <thead>
              <tr>
                <th>
                  <Label>
                    User/Role
                  </Label>
                </th>
                <th>
                  <Label>
                     Read
                  </Label>
                </th>
                <th>
                  <Label>
                    Write
                  </Label>
                </th>
                <th>
                  <Label>
                    Admin
                  </Label>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                Object.keys(grouped).map((key) => (
                  <TableRow>
                    <td>
                      {key}
                    </td>
                    <td>
                    {this.permissionExists(grouped[key], 'deposit-read') ?
                      <CheckBox toggle={true}
                                checked={true}
                                onClick={() => this.props.removePermissions(this.props.draft_id, key, 'deposit-read')} />:
                      <CheckBox toggle={true}
                                checked={false}
                                onClick={() => this.props.addPermissions(this.props.draft_id, key, 'deposit-read')} />
                    }
                    </td>
                    <td>
                    {this.permissionExists(grouped[key], 'deposit-update') ?
                      <CheckBox toggle={true}
                                checked={true}
                                onClick={() => this.props.removePermissions(this.props.draft_id, key, 'deposit-update')} />:
                      <CheckBox toggle={true}
                                checked={false}
                                onClick={() => this.props.addPermissions(this.props.draft_id, key, 'deposit-update')} />
                    }
                    </td>
                    <td>
                    {this.permissionExists(grouped[key], 'deposit-admin') ?
                      <CheckBox toggle={true}
                                checked={true}
                                onClick={() => this.props.removePermissions(this.props.draft_id, key, 'deposit-admin')} />:
                      <CheckBox toggle={true}
                                checked={false}
                                onClick={() => this.props.addPermissions(this.props.draft_id, key, 'deposit-admin')} />
                    }
                    </td>
                  </TableRow>
                  ))
                }
            </tbody>
          </Table>
        </Box>
      </Box>
    );
  }
}

DepositSettings.propTypes = {};

function mapStateToProps(state) {
  return {
    draft_id: state.drafts.getIn(['current_item', 'id']),
    permissions: state.drafts.getIn(['current_item', 'permissions']),
    users: state.drafts.get('users')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPermissions: (draft_id) => dispatch(getPermissions(draft_id)),
    removePermissions: (draft_id, email, action) => dispatch(removePermissions(draft_id, email, action)),
    addPermissions: (draft_id, email, action) => dispatch(addPermissions(draft_id, email, action)),
    getUsers: () => dispatch(getUsers())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositSettings);