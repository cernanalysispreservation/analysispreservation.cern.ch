import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Heading,
  Sidebar,
  Header,
  Title,
  Label
} from 'grommet';

import DepositFilesList from '../../deposit/components/DepositFilesList';

class AlicePublished extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.item;
    let created = item ? item.created : null;
    return (
      <Box colorIndex="neutral-1-a" direction="row" justify="between" flex={true} wrap={false}>
        <Sidebar full={false} size="small">
          <Header pad="medium"
                  justify="between">
            <Title>
              Files
            </Title>
          </Header>
          <DepositFilesList files={this.props.files || []} draftId={this.props.draftId}/>
        </Sidebar>
        <Box size={{width: {min: "large"}}} flex={true} pad='medium' wrap={false}>
          <Box alignContent="center" align="center" flex={true} wrap={false}>
            <Title>{item && item.analysis_title? item.analysis_title : item.general_title}</Title>
            <Box size="xlarge" pad="large" flex={false} wrap={false}>
              <Box flex={true}>
                <Title>Train ID</Title>
                {item && item.train_analysis && item.train_analysis[0].train_id}
                <Title>Run ID</Title>
                {item &&  item.train_analysis && item.train_analysis[0].run_id}
                <Title>Wagon names</Title>
                {item && item.train_analysis && item.train_analysis[0].wagon_names}
                <Title>Dataset</Title>
                {item && item.train_analysis && item.train_analysis[0].dataset}
                <Title>Reference production</Title>
                {item && item.train_analysis && item.train_analysis[0].reference_production}
                <Title>Dataset AOD</Title>
                {item && item.train_analysis && item.train_analysis[0].dataset_aod}
                <Title>Ali Physics</Title>
                {item && item.train_analysis && item.train_analysis[0].ali_physics}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

AlicePublished.propTypes = {
  item: PropTypes.object
};


export default AlicePublished;
