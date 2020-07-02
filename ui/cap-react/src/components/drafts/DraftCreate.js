import React from "react";

import { connect, Provider } from "react-redux";
import store from "../../store/configureStore";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Layer from "grommet/components/Layer";
import Label from "grommet/components/Label";
import CheckmarkIcon from "grommet/components/icons/base/Checkmark";
import Button from "../partials/Button";

import FormField from "grommet/components/FormField";

import { TextInput } from "grommet";
import { createDraft } from "../../actions/draftItem";

import PropTypes from "prop-types";

class DraftCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type:
        this.props.contentTypes && this.props.contentTypes.size === 1
          ? this.props.contentTypes.toJS()[0]["deposit_group"]
          : null
    };
  }

  _selectType = type => {
    this.setState({ type });
  };

  _titleChange = event => {
    let title = event.target.value;
    this.setState({ title });
  };

  _createDraft = () => {
    let { title, type } = this.state;
    let data = {
      general_title: title
    };

    this.props.createDraft(data, { name: type });
  };

  render() {
    return (
      <Layer overlayClose closer flush onClose={this.props.toggle}>
        <Provider store={store}>
          <Box pad="large" size={{ width: "xlarge" }} wrap={false} flex>
            <Box size="xlarge">
              <Heading tag="h4">
                Select the content type you want to create, give a title to
                distinguish from other records and start preserving!
              </Heading>
              <Box pad={{ vertical: "small" }}>
                <FormField label="General Title">
                  <Box pad={{ horizontal: "medium" }}>
                    <TextInput onDOMChange={this._titleChange} />
                  </Box>
                </FormField>
              </Box>
              <Box pad={{ vertical: "small" }}>
                <Box>
                  <Box>
                    <Box size={{ height: { max: "medium" } }}>
                      <Box direction="row" wrap justify="between">
                        {this.props.contentTypes &&
                          this.props.contentTypes.map(type => (
                            <Box
                              key={type.get("deposit_group")}
                              onClick={() =>
                                this._selectType(type.get("deposit_group"))
                              }
                              basis="1/2"
                              pad="small"
                              colorIndex="light-2"
                              separator="all"
                            >
                              <Box
                                flex
                                justify="between"
                                direction="row"
                                wrap={false}
                                style={{ overflow: "visible" }}
                              >
                                <Label size="small">{type.get("name")}</Label>
                                <Box justify="center">
                                  {type.get("deposit_group") ==
                                  this.state.type ? (
                                    <CheckmarkIcon
                                      colorIndex="ok"
                                      size="xsmall"
                                    />
                                  ) : null}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box align="end">
              <Button
                text="Start Preserving"
                onClick={this.state.type ? this._createDraft : null}
                primary
                disabled={this.state.type === null}
              />
            </Box>
          </Box>
        </Provider>
      </Layer>
    );
  }
}

DraftCreate.propTypes = {
  contentTypes: PropTypes.object,
  toggle: PropTypes.func,
  createDraft: PropTypes.func
};

function mapStateToProps(state) {
  return {
    id: state.draftItem.get("id"),
    errors: state.draftItem.get("errors"),
    contentTypes: state.auth.getIn(["currentUser", "depositGroups"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createDraft: (data, type) => dispatch(createDraft(data, type))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftCreate);
