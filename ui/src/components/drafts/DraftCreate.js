import React from "react";

import { connect, Provider } from "react-redux";
import store from "../../store/configureStore";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Button from "grommet/components/Button";
import Layer from "grommet/components/Layer";
import Label from "grommet/components/Label";
import Paragraph from "grommet/components/Paragraph";
import CheckmarkIcon from "grommet/components/icons/base/Checkmark";
import CloseIcon from "grommet/components/icons/base/Close";

import FormField from "grommet/components/FormField";

import { TextInput } from "grommet";
import { createDraft } from "../../actions/draftItem";

class DraftCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type: null
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
    let { history, location } = this.props;

    return (
      <Layer overlayClose closer flush onClose={this.props.toggle}>
        <Provider store={store}>
          <Box pad="large" size={{ width: "xlarge" }} wrap={false} flex>
              <Box flex={false} size="xlarge">
                  <Heading tag="h4">
                          Select the content type you want to create, give a title to
                          distinguish from other records and start preserving!
                  </Heading>
                  <Box pad={{ vertical: "small" }}>
                      <FormField flex={false} label="General Title">
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
                                      {this.props.contentTypes && this.props.contentTypes.map(type => (
                                        <Box
                                            key={type.get("deposit_group")}
                                            onClick={() => this._selectType(type.get("deposit_group"))}
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
                                                    style={{overflow: "visible"}}
                                                >
                                                    <Label size="small">{type.get("name")}</Label>
                                                    <Box flex={false} justify="center">
                                                        {type.get("deposit_group") ==
                                                            this.state.type ? (
                                                              <CheckmarkIcon colorIndex="ok" size="xsmall"/>
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
                        label="Start Preserving"
                        onClick={this._createDraft}
                        primary={true} />
                </Box>
            </Box>
        </Provider>
      </Layer>
    );
  }
}

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
