import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";

import Anchor from "../partials/Anchor";

import Paragraph from "grommet/components/Paragraph";
import Table from "grommet/components/Table";
import TableHeader from "grommet/components/TableHeader";
import TableRow from "grommet/components/TableRow";

import cogoToast from "cogo-toast";
import { Label } from "grommet";

import Button from "../partials/Button";

import AddIcon from "grommet/components/icons/base/Add";
import CloseIcon from "grommet/components/icons/base/Close";

import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

import Form from "../drafts/form/GrommetForm";

import { getUsersAPIKeys, createToken, revokeToken } from "../../actions/auth";

import { applicationSchema, tokenSchema } from "./utils";

import Modal from "../partials/Modal";
import { DH_UNABLE_TO_CHECK_GENERATOR } from "constants";

class SettingsIndex extends React.Component {
  constructor(props) {
    super(props);

    this.formRef = React.createRef();

    this.state = {
      layer: {
        active: false
      }
    };
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
    });
  }

  _onSubmit(type, data) {
    // FIX for frontend validation from schema
    let _data = Object.assign({}, data.formData);
    _data.scopes = ["deposit:write"];
    if (type == "token") {
      this.props.createToken(_data);
    }

    // toast message after token submission
    cogoToast.warn(
      "Do not share any personal access token. It gives full access to your account.",
      {
        position: "top-center",
        bar: { size: "0" },
        hideAfter: 3
      }
    );
    this.setState({ layer: { active: false } });

    this.formRef.submit();
  }

  getLayer() {
    return (
      <Modal
        position="right"
        full
        separator
        title="New OAuth Application"
        animated
        onClose={() => {
          this.setState({ layer: { active: false } });
        }}
      >
        <Box
          flex={true}
          size="medium"
          pad={{ vertical: "large" }}
          data-cy="settings-token-form"
        >
          <Paragraph align="start" margin="none" />
          <Form
            schema={
              this.state.layer.type == "token" ? tokenSchema : applicationSchema
            }
            onSubmit={this._onSubmit.bind(this, this.state.layer.type)}
            validate={true}
            hideErrorList
            formRef={f => (this.formRef = f)}
          >
            <Box flex={true} margin={{ vertical: "small" }} align="center">
              <Button
                text="Create token"
                type="submit"
                primary
                onClick={() => this.formRef.submit()}
              />
            </Box>
          </Form>
        </Box>
      </Modal>
    );
  }

  _revokeToken(token, key) {
    this.props.revokeToken(token, key);
  }

  render() {
    return (
      <Box flex>
        {this.state.layer.active ? this.getLayer() : null}
        <Box pad="none">
          <Box flex={true} direction="row" pad="small" justify="between">
            <Label uppercase align="start" justify="center" margin="none">
              Your OAuth Tokens
            </Label>
            <Box align="center" data-cy="settings-add-token">
              <Anchor
                icon={<AddIcon size="xsmall" />}
                label={
                  <Label size="small" uppercase>
                    Add token
                  </Label>
                }
                onClick={this.activateLayer.bind(this, "token")}
              />
            </Box>
          </Box>
          <Box colorIndex="light-1">
            <Box>
              {!this.props.tokens.isEmpty() ? (
                <Box flex>
                  <Table>
                    <TableHeader
                      key="token_header"
                      labels={["ID", "Name", "API key", "Revoke"]}
                    />
                    <tbody>
                      {this.props.tokens.map((token, key) => {
                        return token && token.t_id ? (
                          <TableRow
                            key={token.name}
                            data-cy="settings-table-token-id"
                          >
                            <td key="id">{token.t_id}</td>
                            <td key="name">{token.name}</td>
                            <td key="access_token">{token.access_token}</td>
                            <td key="action" data-cy={token.name}>
                              <Anchor
                                dataCy={token.name}
                                icon={<CloseIcon size="xsmall" />}
                                size="xsmall"
                                onClick={this._revokeToken.bind(
                                  this,
                                  token.t_id,
                                  key
                                )}
                              />
                            </td>
                          </TableRow>
                        ) : null;
                      })}
                    </tbody>
                  </Table>
                </Box>
              ) : (
                <ListPlaceholder
                  label="Add token"
                  primary={true}
                  a11yTitle="Add item"
                  emptyMessage="You do not have any items at the moment."
                  unfilteredTotal={0}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

SettingsIndex.propTypes = {
  tokens: PropTypes.object,
  getUsersAPIKeys: PropTypes.func,
  createToken: PropTypes.func,
  revokeToken: PropTypes.func
};

function mapStateToProps(state) {
  return {
    tokens: state.auth.get("tokens")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getUsersAPIKeys: () => dispatch(getUsersAPIKeys()),
    createToken: data => dispatch(createToken(data)),
    revokeToken: (t_id, key) => dispatch(revokeToken(t_id, key))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsIndex);
