import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  Box,
  Button,
  Anchor,
  Layer,
  Paragraph,
  Title,
  Heading,
  Table,
  TableRow
} from "grommet";

import AddIcon from "grommet/components/icons/base/Add";
import CloseIcon from "grommet/components/icons/base/Close";

import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

import Form from "../drafts/form/GrommetForm";

import { getUsersAPIKeys, createToken, revokeToken } from "../../actions/auth";

import { applicationSchema, tokenSchema } from "./utils";

class SettingsIndex extends React.Component {
  constructor(props) {
    super(props);

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
    if (!(_data.scopes instanceof Array)) {
      if (_data.scopes) _data.scopes = [_data.scopes];
      else _data.scopes = [];
    }
    if (type == "token") this.props.createToken(_data);
    // else if (type == "application") this.props.createApplication(data.formData);
  }

  getLayer() {
    return (
      <Layer
        overlayClose={true}
        closer={true}
        onClose={() => {
          this.setState({ layer: { active: false } });
        }}
        align="right"
      >
        <Box flex={true} pad="medium" size="large">
          <Heading align="start" margin={{ vertical: "medium" }} tag="h3">
            New OAuth Application
          </Heading>
          <Paragraph align="start" margin="none" />
          <Form
            schema={
              this.state.layer.type == "token" ? tokenSchema : applicationSchema
            }
            uiSchema={{
              scopes: {
                "ui:options": {
                  inline: true
                }
              }
            }}
            onSubmit={this._onSubmit.bind(this, this.state.layer.type)}
          >
            <Box flex={true} margin={{ vertical: "medium" }}>
              <Button label="Submit" type="submit" primary={true} />
            </Box>
          </Form>
        </Box>
      </Layer>
    );
  }

  _revokeToken(token, key) {
    this.props.revokeToken(token, key);
  }

  render() {
    return (
      <Box flex={true} pad="medium">
        {this.state.layer.active ? this.getLayer() : null}
        <Box>
          <Box
            pad="small"
            direction="row"
            colorIndex="neutral-1-a"
            justify="between"
          >
            <Title>Tokens</Title>
            <Button
              label="Add Token"
              icon={<AddIcon />}
              onClick={this.activateLayer.bind(this, "token")}
            />
          </Box>

          {!this.props.tokens.isEmpty() ? (
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
                  {this.props.tokens.map((token, keyy) => {
                    return token && token.t_id ? (
                      <TableRow key={token.t_id}>
                        {[
                          <td key="id">{token.t_id}</td>,
                          <td key="name">{token.name}</td>,
                          <td key="scopes">{token.scopes}</td>,
                          <td key="access_token">{token.access_token}</td>,
                          <td key="action">
                            <Anchor
                              icon={<CloseIcon />}
                              onClick={this._revokeToken.bind(
                                this,
                                token.t_id,
                                keyy
                              )}
                            />
                          </td>
                        ]}
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
    // clients: state.auth.get("clients"),
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
