import React from 'react';
import {Box, Footer, Paragraph, Menu, Anchor} from 'grommet';


class GrommetFooter extends React.Component {
  render() {
    return (
      <Footer justify="center" colorIndex="neutral-1" >
        <Box direction="row"
          align="center"
          justify="center"
          pad={{"between": "medium"}}>
          <Paragraph margin="none">
            Copyright 2016 © CERN. Created & Hosted by CERN. Powered by Invenio Software.
          </Paragraph>
          <Menu direction="row"
            size="small"
            dropAlign={{"right": "right"}}>
            <Anchor 
              label="Team"
              href="#"/>
            <Anchor 
              label="Contact"
              href="#"
              />
            <Anchor
              label="About"
              href="#"
              path="/about" />
            <Anchor 
              label="Source Code"
              href="#"
              />
          </Menu>
        </Box>
      </Footer>
    );
  }
}

export default GrommetFooter;