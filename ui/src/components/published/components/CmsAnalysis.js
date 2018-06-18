import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Sidebar,
  Header,
  Title,
  Label,
  Heading
} from 'grommet';

import DepositFilesList from '../../deposit/components/DepositFilesList';

class CmsPublished extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.item;
    return (
      <Box colorIndex="neutral-1-a" direction="row" justify="between" flex={true} wrap={false}>
        <Sidebar full={false} size="small">
          <Header pad='medium'
                  justify='between'>
            <Title>
              Files
            </Title>
          </Header>
          <DepositFilesList files={this.props.files || []} draftId={this.props.draftId}/>
        </Sidebar>
        <Box size={{width: {min: "large"}}} flex={true} pad='medium' wrap={false}>
          <Box alignContent="center" align="center" flex={true} wrap={false}>
            <Title>{item && item.basic_info? item.basic_info.analysis_title : item.general_title}</Title>
            <Box size="xlarge" pad="large" flex={false} wrap={false}>
              <Box flex={true}>
                {item && item.cadi_info &&
                  <Heading tag="h2">CADI Info</Heading>
                }
                {item && item.cadi_info && item.cadi_info.contact &&
                  <Box>
                    <Title>Contact</Title>
                    {item.cadi_info.contact}
                  </Box>
                }
                {item && item.cadi_info && item.cadi_info.created &&
                  <Box>
                    <Title>Created</Title>
                    {item.cadi_info.created}
                  </Box>
                }
                {item && item.cadi_info && item.cadi_info.description &&
                  <Box>
                    <Title>Description</Title>
                    {item.cadi_info.description}
                  </Box>
                }
                {item && item.cadi_info && item.cadi_info.name &&
                  <Box>
                    <Title>Name</Title>
                    {item.cadi_info.name}
                  </Box>
                }
                {item && item.cadi_info && item.cadi_info.paper &&
                  <Box>
                    <Title>Paper</Title>
                    <a href={item.cadi_info.paper} target="_blank">{item.cadi_info.paper}</a>
                  </Box>
                }
                {item && item.cadi_info && (item.cadi_info.pas || item.cadi_info.pas !== "") &&
                  <Box>
                    <Title>Pas</Title>
                    {item.cadi_info.pas}
                  </Box>
                }
                {item && item.cadi_info && item.cadi_info.publication_status && 
                  <Box>
                    <Title>Publication Status</Title>
                    {item.cadi_info.publication_status}
                  </Box>
                }
                {item && item.cadi_info && item.cadi_info.status &&
                  <Box>
                    <Title>Status</Title>
                    {item.cadi_info.status}
                  </Box>
                }
                {item && item.cadi_info && item.cadi_info.twiki &&
                  <Box>
                    <Title>Twiki</Title>
                    {item.cadi_info.twiki}
                  </Box>
                }
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

CmsPublished.propTypes = {
  item: PropTypes.object
};

export default CmsPublished;

