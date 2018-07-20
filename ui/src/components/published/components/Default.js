import React from "react";
import PropTypes from "prop-types";

import { Box, Heading, Sidebar, Header, Title, Button } from "grommet";

import { withRouter } from "react-router";

import DepositFilesList from "../../deposit/components/DepositFilesList";
import CirclePlayIcon from "grommet/components/icons/base/CirclePlay";
import { connect } from "react-redux";

const RerunButton = withRouter(({ history, record_id = record_id }) => (
  <Button
    icon={<CirclePlayIcon />}
    label="Rerun"
    onClick={() => history.push(`/published/${record_id}/rerun`)}
  />
));

class DefaultPublished extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.item;
    let created = item ? item.created : null;
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
            <Title>{item.general_title}</Title>
            <Box size="xlarge" pad="large" flex={false} wrap={false}>
              <Box flex={true}>
                <Heading tag="h5">Description</Heading>
                <Heading tag="h5">Started</Heading>
                <div>{created}</div>
                <Heading tag="h5">Members</Heading>
                <Heading tag="h5">Files</Heading>
              </Box>
            </Box>
          </Box>
        </Box>
        <Sidebar full={false} size="small">
          <Header pad="medium" justify="between">
            <RerunButton record_id={this.props.item.control_number} />
          </Header>
        </Sidebar>
      </Box>
    );
  }
}

DefaultPublished.propTypes = {
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
)(DefaultPublished);
