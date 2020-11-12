import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import _sortBy from "lodash/sortBy";

import Box from "grommet/components/Box";

import Heading from "grommet/components/Heading";
import TextInput from "grommet/components/TextInput";

import Button from "../../../partials/Button";

import { handlePermissions } from "../../../../actions/draftItem";

import { AiOutlinePlus, AiOutlineUser } from "react-icons/ai";
import AccessModal from "./DepositAccessModal";
import PermissionTable from "./PermissionTable";
import { Paragraph } from "grommet";

import "./DepositAccess.css";

class DepositAccess extends React.Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      showModal: false,
      filterResultsBy: "all"
    };
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

    let users_roles = _sortBy(Object.keys(access));
    let all_roles_length = users_roles.length;
    let users_only = users_roles.filter(item => access[item].type === "user");
    let egroups_only = users_roles.filter(
      item => access[item].type === "egroup"
    );

    if (this.state.filterResultsBy !== "all") {
      users_roles =
        this.state.filterResultsBy === "user" ? users_only : egroups_only;
    }

    if (this.state.inputValue) {
      users_roles = users_roles.filter(item =>
        item.includes(this.state.inputValue)
      );
    }

    return (
      <Box className="deposit-access">
        <Box margin={{ bottom: "medium" }}>
          <Heading tag="h3">Access & Permissions</Heading>
          <Box
            pad="small"
            style={{
              border: "1px solid #e6e6e6",
              borderRadius: "3px",
              padding: "10px"
            }}
          >
            <Box pad={{ between: "small" }}>
              {this.props.canAdmin && (
                <Box flex={true} direction="row" justify="center">
                  <Box
                    flex
                    direction="row"
                    align="center"
                    justify="between"
                    responsive={false}
                  >
                    <TextInput
                      placeHolder="Filter list by name or group"
                      value={this.state.inputValue}
                      onDOMChange={e =>
                        this.setState({ inputValue: e.target.value })
                      }
                    />
                    <Button
                      size="small"
                      text="Add"
                      primary
                      icon={<AiOutlinePlus color="#fff" />}
                      onClick={() => this.setState({ showModal: true })}
                    />
                  </Box>
                </Box>
              )}
              <Box pad="small" align="start" margin={{ top: "small" }}>
                <Box direction="row" responsive={false}>
                  <Button
                    text={`All (${all_roles_length})`}
                    background={
                      this.state.filterResultsBy === "all" ? "#e1e1e1" : "#fff"
                    }
                    onClick={() => this.setState({ filterResultsBy: "all" })}
                    size="small"
                  />
                  <Button
                    text={`Users (${users_only.length})`}
                    margin="0 5px"
                    size="small"
                    background={
                      this.state.filterResultsBy === "user" ? "#e1e1e1" : "#fff"
                    }
                    onClick={() => this.setState({ filterResultsBy: "user" })}
                  />
                  <Button
                    text={`E-Groups (${egroups_only.length})`}
                    background={
                      this.state.filterResultsBy === "egroup"
                        ? "#e1e1e1"
                        : "#fff"
                    }
                    size="small"
                    onClick={() => this.setState({ filterResultsBy: "egroup" })}
                  />
                </Box>
              </Box>
              <Box >
                {users_roles.length > 0 ? (
                  <PermissionTable users={users_roles} access={access} />
                ) : (
                  <Box pad="small" align="center">
                    <Box
                      colorIndex="light-2"
                      align="center"
                      pad="small"
                      style={{ borderRadius: "50%" }}
                    >
                      <AiOutlineUser size={20} />
                    </Box>
                    <Paragraph>No results</Paragraph>
                  </Box>
                )}
                <AccessModal
                  open={this.state.showModal}
                  onClose={() => this.setState({ showModal: false })}
                  permissions={permissions}
                  users={users_roles}
                />
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
