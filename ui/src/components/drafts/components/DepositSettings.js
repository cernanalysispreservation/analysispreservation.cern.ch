import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import _ from "lodash";

import {
  Box,
  Button,
  Table,
  TableRow,
  TableHeader,
  CheckBox,
  RadioButton,
  FormField,
  TextInput,
  Toast
} from "grommet";

import {
  getDraftById,
  handlePermissions,
  clearError
} from "../../../actions/drafts";
import AddIcon from "grommet/components/icons/base/Add";
import Spinning from "grommet/components/icons/Spinning";

import SectionHeader from "./SectionHeader";

class DepositSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      suggestions: [],
      type: "user",
      inputValue: ""
    };
  }

  componentDidMount() {
    if (
      this.props.match.params.draft_id &&
      this.props.match.params.draft_id !== this.props.draft_id
    ) {
      this.props.getDraftById(this.props.match.params.draft_id, true);
    }
  }

  fetchLdapData = _.debounce(url => {
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

    let url =
      this.state.type === "user"
        ? `/api/ldap/user/mail?query=${value}`
        : `/api/ldap/egroup/mail?query=${value}&sf=mail`;
    this.fetchLdapData(url);
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
    let actionExists = _.filter(grouped, ["action", action]);
    return actionExists.length > 0 ? true : false;
  }

  render() {
    let permissions = this.props.permissions;
    let grouped = _.groupBy(permissions, function(permission) {
      return permission.identity;
    });

    let error = this.props.error ? this.props.error.message : null;
    let owner = this.props.draft ? this.props.draft._deposit.owners[0] : null;
    let draft_id = this.props.draft_id
      ? this.props.draft_id
      : this.props.match.params.draft_id;

    let users = _.sortBy(Object.keys(grouped));

    return (
      <Box>
        {error ? (
          <Toast status="critical" onClose={() => this.props.clearError()}>
            {error}
          </Toast>
        ) : null}

        <SectionHeader label="Access" />
        <Box flex={true} align="center">
          <Box size="xxlarge">
            <Box
              margin={{ top: "small" }}
              flex={true}
              alignSelf="start"
              direction="row"
            >
              <Box direction="row" align="start" pad="small">
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
              <Box direction="row" flex={true} align="start">
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
            <Box margin="small">
              <Table>
                <TableHeader labels={["User/Role", "Read", "Write", "Admin"]} />
                <tbody>
                  {users.map((key, index) => (
                    <TableRow key={`${key}-${index}`}>
                      <td>
                        {key}
                        {owner && owner === key ? (
                          <strong> (owner)</strong>
                        ) : null}
                      </td>
                      <td>
                        {this.permissionExists(grouped[key], "deposit-read") ? (
                          <CheckBox
                            toggle={true}
                            checked={true}
                            disabled={owner && owner === key}
                            onChange={() =>
                              this.props.handlePermissions(
                                draft_id,
                                grouped[key][0]["type"],
                                key,
                                "deposit-read",
                                "remove"
                              )
                            }
                          />
                        ) : (
                          <CheckBox
                            toggle={true}
                            checked={false}
                            disabled={owner && owner === key}
                            onChange={() =>
                              this.props.handlePermissions(
                                draft_id,
                                grouped[key][0]["type"],
                                key,
                                "deposit-read",
                                "add"
                              )
                            }
                          />
                        )}
                      </td>
                      <td>
                        {this.permissionExists(
                          grouped[key],
                          "deposit-update"
                        ) ? (
                          <CheckBox
                            toggle={true}
                            checked={true}
                            disabled={owner && owner === key}
                            onChange={() =>
                              this.props.handlePermissions(
                                draft_id,
                                grouped[key][0]["type"],
                                key,
                                "deposit-update",
                                "remove"
                              )
                            }
                          />
                        ) : (
                          <CheckBox
                            toggle={true}
                            checked={false}
                            disabled={owner && owner === key}
                            onChange={() =>
                              this.props.handlePermissions(
                                draft_id,
                                grouped[key][0]["type"],
                                key,
                                "deposit-update",
                                "add"
                              )
                            }
                          />
                        )}
                      </td>
                      <td>
                        {this.permissionExists(
                          grouped[key],
                          "deposit-admin"
                        ) ? (
                          <CheckBox
                            toggle={true}
                            checked={true}
                            disabled={owner && owner === key}
                            onChange={() =>
                              this.props.handlePermissions(
                                draft_id,
                                grouped[key][0]["type"],
                                key,
                                "deposit-admin",
                                "remove"
                              )
                            }
                          />
                        ) : (
                          <CheckBox
                            toggle={true}
                            checked={false}
                            disabled={owner && owner === key}
                            onChange={() =>
                              this.props.handlePermissions(
                                draft_id,
                                grouped[key][0]["type"],
                                key,
                                "deposit-admin",
                                "add"
                              )
                            }
                          />
                        )}
                      </td>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

DepositSettings.propTypes = {
  match: PropTypes.object,
  error: PropTypes.object,
  getDraftById: PropTypes.func,
  loading: PropTypes.bool,
  clearError: PropTypes.func,
  draft_id: PropTypes.string,
  draft: PropTypes.object,
  getUsers: PropTypes.func,
  permissions: PropTypes.array,
  handlePermissions: PropTypes.func
};

function mapStateToProps(state) {
  return {
    draft_id: state.drafts.getIn(["current_item", "id"]),
    draft: state.drafts.getIn(["current_item", "data"]),
    permissions: state.drafts.getIn(["current_item", "permissions"]),
    error: state.drafts.getIn(["current_item", "error"]),
    loading: state.drafts.getIn(["current_item", "loading"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDraftById: (id, fet) => dispatch(getDraftById(id, fet)),
    handlePermissions: (draft_id, type, email, action, operation) =>
      dispatch(handlePermissions(draft_id, type, email, action, operation)),
    clearError: () => dispatch(clearError())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositSettings);
