import React from "react";

import { connect, Provider } from "react-redux";
import store from "../../store/configureStore";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Layer from "grommet/components/Layer";
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
      <Layer overlayClose flush onClose={this.props.toggle}>
        <Provider store={store}>
          <Box size={{ width: "xlarge" }} wrap={false} flex={true}>
            <Box
              colorIndex="brand"
              pad="small"
              flex={false}
              align="center"
              justify="between"
              direction="row"
            >
              <Heading margin="none" strong tag="h5">
                Create new content
              </Heading>
              <Anchor onClick={() => this.toggle()} icon={<CloseIcon />} />
            </Box>
            <Box
              flex={false}
              size={{ height: "medium" }}
              pad={{ horizontal: "large" }}
              margin={{ bottom: "large" }}
            >
              <Paragraph margin="medium">
                Select the content type you want to create, give a title to
                distinguish from other records and start preserving
              </Paragraph>
              <Box flex={false}>
                <FormField flex={false} label="General Title">
                  <Box pad={{ horizontal: "medium" }}>
                    <TextInput onDOMChange={this._titleChange} />
                  </Box>
                </FormField>
              </Box>
              <Box flex={false}>
                <FormField
                  flex="false"
                  style={{ marginTop: "-1px" }}
                  label="Select type to create"
                >
                  <Box pad={{ horizontal: "medium" }} flex={true}>
                    <Box flex={false} size={{ height: { max: "medium" } }}>
                      <Box flex={false} direction="row" wrap justify="between">
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
                              margin={{ bottom: "small" }}
                            >
                              <Heading tag="h6">
                                <Box
                                  flex={true}
                                  justify="between"
                                  align="center"
                                  direction="row"
                                  wrap={false}
                                >
                                  <Box flex={true}>{type.get("name")}</Box>
                                  <Box flex={false}>
                                    {type.get("deposit_group") ==
                                    this.state.type ? (
                                      <CheckmarkIcon
                                        colorIndex="ok"
                                        size="xsmall"
                                      />
                                    ) : null}
                                  </Box>
                                </Box>
                              </Heading>
                              <Paragraph margin="none">
                                {type.get("description")}
                              </Paragraph>
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  </Box>
                </FormField>
              </Box>
            </Box>
            <Box flex={false} pad="small">
              <Box
                flex={false}
                colorIndex="neutral-1"
                size="small"
                alignSelf="end"
                align="center"
                pad="small"
                onClick={this._createDraft}
              >
                Start New
              </Box>
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
