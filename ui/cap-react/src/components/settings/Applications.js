import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";

import Anchor from "../partials/Anchor";

import Paragraph from "grommet/components/Paragraph";
import Heading from "grommet/components/Heading";
import Table from "grommet/components/Table";
import TableHeader from "grommet/components/TableHeader";
import TableRow from "grommet/components/TableRow";

import cogoToast from "cogo-toast";
import { Label } from "grommet";
import NoData from "../../img/nodata.svg";

import Button from "../partials/Button";

import Form from "../drafts/form/GrommetForm";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";

import { getUsersAPIKeys, createToken, revokeToken } from "../../actions/auth";

import { applicationSchema, tokenSchema } from "./utils";

import Modal from "../partials/Modal";

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
        <Box flex={true} size="medium" pad={{ vertical: "large" }}>
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

  getTokenSize = () => {
    return this.props.tokens.filter(t => t !== undefined).size;
  };

  render() {
    return (
      <Box flex>
        {this.state.layer.active ? this.getLayer() : null}
        <Box pad="none">
          <Box
            flex={true}
            colorIndex="light-1"
            pad="small"
            style={{ borderRadius: "3px" }}
          >
            <Box
              direction="row"
              justify="between"
              align="center"
              margin={{ bottom: "medium" }}
            >
              <Heading margin="none" tag="h3">
                Your OAuth Tokens
              </Heading>
              {this.getTokenSize() > 0 && (
                <Button
                  text="Add Token"
                  icon={<AiOutlinePlus />}
                  onClick={this.activateLayer.bind(this, "token")}
                />
              )}
            </Box>
            <Box>
              {this.getTokenSize() > 0 ? (
                <Box flex>
                  <Table>
                    <TableHeader
                      key="token_header"
                      labels={["ID", "Name", "API key", "Revoke"]}
                    />
                    <tbody>
                      {this.props.tokens.map((token, key) => {
                        return token && token.t_id ? (
                          <TableRow key={token.t_id}>
                            <td key="id">{token.t_id}</td>
                            <td key="name">{token.name}</td>
                            <td key="access_token">{token.access_token}</td>
                            <td key="action">
                              <Anchor
                                icon={<AiOutlineClose />}
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
                <Box align="center">
                  <NoData />
                  <Label style={{ color: "#666" }}>
                    Add a new token to grant access to CAP client and API
                  </Label>
                  <Button
                    text="Add Token"
                    icon={<AiOutlinePlus />}
                    onClick={this.activateLayer.bind(this, "token")}
                    primaryOutline
                  />
                </Box>
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
