import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";

import _debounce from "lodash/debounce";
import _filter from "lodash/filter";
import _sortBy from "lodash/sortBy";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Heading from "grommet/components/Heading";
import Table from "grommet/components/Table";
import TableRow from "grommet/components/TableRow";
import TableHeader from "grommet/components/TableHeader";
import CheckBox from "grommet/components/CheckBox";
import RadioButton from "grommet/components/RadioButton";
import FormField from "grommet/components/FormField";
import TextInput from "grommet/components/TextInput";

import { handlePermissions } from "../../../actions/draftItem";

import AddIcon from "grommet/components/icons/base/Add";
import Spinning from "grommet/components/icons/Spinning";

class DepositAccess extends React.Component {
  constructor() {
    super();
    this.state = {
      suggestions: [],
      type: "user",
      inputValue: ""
    };
  }

  fetchLdapData = _debounce(url => {
    axios.get(url).then(({ data }) => {
      this.setState({
        suggestions: data
      });
    });
  }, 500);

  onSuggestionsFetchRequested = value => {
    this.setState({
      inputValue: value
    });

    // let url =
    //   this.state.type === "user"
    //     ? `/api/services/ldap/user/mail?query=${value}`
    //     : `/api/services/ldap/egroup/mail?query=${value}&sf=mail`;
    // this.fetchLdapData(url);
  };

  handleChange = event => {
    this.setState({
      type: event.target.value
    });
  };

  onSuggestionSelect = selected => {
    this.setState({
      inputValue: selected.suggestion
    });
  };

  addPermissions = draft_id => {
    this.props.handlePermissions(
      draft_id,
      this.state.type,
      this.state.inputValue,
      "deposit-read",
      "add"
    );
    this.setState({ inputValue: "" });
  };

  permissionExists(grouped, action) {
    let actionExists = _filter(grouped, ["action", action]);
    return actionExists.length > 0 ? true : false;
  }

  render() {
    if (!this.props.draft_id) return null;
    let permissions = this.props.permissions || {};

    let access = {};
    Object.keys(permissions).map(action => {
      permissions[action].users.map(user => {
        if (!access[user])
          access[user] = {
            actions: [],
            type: "user"
          };
        access[user].actions.push(action);
      });

      permissions[action].roles.map(role => {
        if (!access[role])
          access[role] = {
            actions: [],
            type: "egroup"
          };
        access[role].actions.push(action);
      });
    });

    let owner = this.props.created_by;
    let draft_id = this.props.draft_id
      ? this.props.draft_id
      : this.props.match.params.draft_id;

    let users_roles = _sortBy(Object.keys(access));

    return (
      <Box>
        <Box margin={{ bottom: "medium" }}>
          <Heading tag="h3">Access & Permissions</Heading>
          <Box pad="small" colorIndex="light-2">
            <Box flex={false} pad={{ between: "small" }}>
              {this.props.canAdmin && (
                <Box flex={true} direction="row" justify="center">
                  <Box direction="row" pad="small">
                    <RadioButton
                      id="user"
                      name="user"
                      label="User email"
                      value="user"
                      checked={this.state.type === "user"}
                      onChange={this.handleChange}
                    />
                    <RadioButton
                      id="egroup"
                      name="egroup"
                      label="Egroup email"
                      value="egroup"
                      checked={this.state.type === "egroup"}
                      onChange={this.handleChange}
                    />
                  </Box>
                  <Box
                    direction="row"
                    flex={true}
                    justify="center"
                    align="center"
                  >
                    <Box size="medium">
                      <FormField>
                        <TextInput
                          placeHolder={`Type to  ADD access rights`}
                          value={this.state.inputValue}
                          onDOMChange={e =>
                            this.onSuggestionsFetchRequested(e.target.value)
                          }
                          onSelect={this.onSuggestionSelect}
                          suggestions={this.state.suggestions}
                        />
                      </FormField>
                    </Box>
                    {this.props.loading ? (
                      <Box pad="small">
                        <Spinning />
                      </Box>
                    ) : (
                      <Button
                        icon={<AddIcon />}
                        size="small"
                        onClick={() => {
                          this.addPermissions(draft_id);
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )}
              <Box>
                <Table>
                  <TableHeader
                    labels={["User/Role", "Read", "Write", "Admin"]}
                  />
                  <tbody>
                    {users_roles.map((key, index) => {
                      let { actions: actions = [], type: type } = access[key];
                      let canRead = actions.indexOf("deposit-read") > -1;
                      let canUpdate = actions.indexOf("deposit-update") > -1;
                      let canAdmin = actions.indexOf("deposit-admin") > -1;

                      return (
                        <TableRow key={`${key}-${index}`}>
                          <td>
                            {key}
                            {owner && owner === key ? (
                              <strong> (owner)</strong>
                            ) : null}
                          </td>
                          <td>
                            <CheckBox
                              toggle={true}
                              checked={canRead ? true : false}
                              disabled={
                                !this.props.canAdmin || (owner && owner === key)
                              }
                              onChange={() =>
                                this.props.handlePermissions(
                                  draft_id,
                                  type,
                                  key,
                                  "deposit-read",
                                  canRead ? "remove" : "add"
                                )
                              }
                            />
                          </td>
                          <td>
                            <CheckBox
                              toggle={true}
                              checked={canUpdate ? true : false}
                              disabled={
                                !this.props.canAdmin || (owner && owner === key)
                              }
                              onChange={() =>
                                this.props.handlePermissions(
                                  draft_id,
                                  type,
                                  key,
                                  "deposit-update",
                                  canUpdate ? "remove" : "add"
                                )
                              }
                            />
                          </td>
                          <td>
                            <CheckBox
                              toggle={true}
                              checked={canAdmin ? true : false}
                              disabled={
                                !this.props.canAdmin || (owner && owner === key)
                              }
                              onChange={() =>
                                this.props.handlePermissions(
                                  draft_id,
                                  type,
                                  key,
                                  "deposit-admin",
                                  canAdmin ? "remove" : "add"
                                )
                              }
                            />
                          </td>
                        </TableRow>
                      );
                    })}
                  </tbody>
                </Table>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

DepositAccess.propTypes = {
  match: PropTypes.object,
  getDraftById: PropTypes.func,
  loading: PropTypes.bool,
  draft_id: PropTypes.string,
  draft: PropTypes.object,
  getUsers: PropTypes.func,
  permissions: PropTypes.object,
  handlePermissions: PropTypes.func,
  created_by: PropTypes.string,
  canAdmin: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    draft_id: state.draftItem.get("id"),
    created_by: state.draftItem.get("created_by"),
    draft: state.draftItem.get("data"),
    permissions: state.draftItem.get("access"),
    loading: state.draftItem.get("loading"),
    canAdmin: state.draftItem.get("can_admin")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // getDraftById: (id, fet) => dispatch(getDraftById(id, fet)),
    handlePermissions: (draft_id, type, email, action, operation) =>
      dispatch(handlePermissions(draft_id, type, email, action, operation))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositAccess);
