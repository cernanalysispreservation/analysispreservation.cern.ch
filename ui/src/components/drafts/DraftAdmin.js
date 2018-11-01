import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Section from "grommet/components/Section";

import { getDraftById } from "../../actions/drafts";

import ReactJson from "react-json-view";

class DraftsItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { id } = this.props.match.params;
    this.props.getDraftById(id);
  }

  render() {
    return (
      <Box flex={true} pad="small" colorIndex="neutral-1-a">
        {this.props.error ? (
          <Box>
            <Heading tag="h5">Errors</Heading>
            <div>{JSON.stringify(this.props.error)}</div>
          </Box>
        ) : null}
        {this.props.item ? (
          <Section pad="none">
            <Header tag="h2" marign="none" separator="bottom">
              <Heading tag="h2" marign="none">
                {this.props.item.metadata.general_title}
              </Heading>
              <Heading tag="h5" marign="none">
                {this.props.match.params.id}
              </Heading>
            </Header>
            {this.props.item ? (
              <Box>
                <Box flex={true} direction="row">
                  <Box flex={true}>
                    <Box flex={true}>
                      <Box pad="small" flex={true}>
                        <Heading tag="h5">Data</Heading>
                        <Box pad="small" flex={true} colorIndex="light-2">
                          {JSON.stringify(this.props.item)}
                        </Box>
                      </Box>
                      <Box pad="small" flex={true}>
                        <Heading tag="h5">Permissions</Heading>
                        <Box pad="small" flex={true} colorIndex="light-2">
                          {JSON.stringify(this.props.item.metadata._access)}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box pad="small" flex={true}>
                    <Heading tag="h5">JSON</Heading>
                    <Box pad="small" flex={true} colorIndex="light-2">
                      <ReactJson src={this.props.item} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            ) : null}
          </Section>
        ) : null}
      </Box>
    );
  }
}

DraftsItem.propTypes = {
  error: PropTypes.object.required,
  getDraftById: PropTypes.func,
  item: PropTypes.object.required,
  match: PropTypes.object.required
};

function mapStateToProps(state) {
  return {
    item: state.drafts.getIn(["current_item", "data"]),
    error: state.drafts.getIn(["current_item", "error"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDraftById: id => dispatch(getDraftById(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftsItem);
