import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Paragraph from "grommet/components/Paragraph";
import Label from "grommet/components/Label";

class SelectContentType extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getSchemas();
  }

  render() {
    let that = this;
    return (
      <Box size="large">
        <Header
          flex={true}
          colorIndex="neutral-1"
          pad="small"
          direction="column"
          wrap={true}
        >
          <Label flex="true" size="medium" margin="none">
            Your content types
          </Label>
          <Paragraph flex="true" size="small" align="center">
            Choose from one of the existing schemas
          </Paragraph>
        </Header>
        <Box colorIndex="light-2" pad="small">
          {this.props.list.size > 0 ? (
            this.props.list.entrySeq().map(([schemaId, schema]) => {
              return Object.keys(schema).map(schemaVersion => {
                return (
                  <Box
                    onClick={that.props.select.bind(
                      this,
                      schemaId,
                      schemaVersion
                    )}
                    margin="small"
                    flex={true}
                    pad="small"
                    size="small"
                    colorIndex="grey-4"
                    key={schemaId}
                  >
                    {schemaId} {schemaVersion}
                  </Box>
                );
              });
            })
          ) : (
            <Paragraph justify="center" align="center">
              No content type has been created yet
            </Paragraph>
          )}
        </Box>
      </Box>
    );
  }
}

SelectContentType.propTypes = {
  list: PropTypes.object,
  select: PropTypes.func,
  getSchemas: PropTypes.func
};

export default SelectContentType;
