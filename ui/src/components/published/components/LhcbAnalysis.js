import React from "react";
import PropTypes from "prop-types";

import { Box, Sidebar, Header, Title, Label } from "grommet";

import DepositFilesList from "../../deposit/components/DepositFilesList";
import { connect } from "react-redux";

class LhcbPublished extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.item;
    return (
      <Box
        colorIndex="neutral-1-a"
        direction="row"
        justify="between"
        flex={true}
        wrap={false}
      >
        <Sidebar full={false} size="small">
          <Header pad="medium" justify="between">
            <Title>Files</Title>
          </Header>
          <DepositFilesList
            files={this.props.files || []}
            draftId={this.props.draftId}
          />
        </Sidebar>
        <Box
          size={{ width: { min: "large" } }}
          flex={true}
          pad="medium"
          wrap={false}
        >
          <Box alignContent="center" align="center" flex={true} wrap={false}>
            <Title>
              {item && item.basic_info
                ? item.basic_info.analysis_title
                : item.general_title}
            </Title>
            <Box size="xlarge" pad="large" flex={false} wrap={false}>
              <Box flex={true}>
                <Title>Proponents</Title>
                {item && item.basic_info ? (
                  item.basic_info.analysis_proponents
                    .map(i => i)
                    .reduce((prev, curr) => [prev, ", ", curr])
                ) : (
                  <Label>No available proponents.</Label>
                )}
                <Title>Reviewers</Title>
                {item && item.basic_info ? (
                  item.basic_info.reviewers
                ) : (
                  <Label>No available reviewers.</Label>
                )}
                <Title>Documentations</Title>
                {item && item.additional_resources ? (
                  item.additional_resources.documentations.map((i, index) => {
                    return (
                      <Box key={`${i.title}-${index}`}>
                        <Label>{i.title}</Label>
                        <a href={i.url}>{i.url}</a>
                      </Box>
                    );
                  })
                ) : (
                  <Label>No available documentations.</Label>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

LhcbPublished.propTypes = {
  item: PropTypes.object,
  files: PropTypes.array,
  draftId: PropTypes.string
};

function mapStateToProps(state) {
  return {
    files: state.drafts.getIn(["current_item", "files"])
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LhcbPublished);
