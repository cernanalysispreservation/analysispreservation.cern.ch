import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Paragraph from "grommet/components/Paragraph";
import Label from "grommet/components/Label";

import Tabs from "grommet/components/Tabs";
import Tab from "grommet/components/Tab";

import Spinning from "grommet/components/icons/Spinning";

class SelectContentType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recommended: [
        {
          schemaId: "cms-analysis",
          schemaVersion: "0.0.1"
        },
        {
          schemaId: "lhcb",
          schemaVersion: "0.0.1"
        },
        {
          schemaId: "alice-analysis",
          schemaVersion: "0.0.1"
        }
      ]
    };
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
        <Box colorIndex="light-2" pad={{ vertical: "small" }} align="center">
          <Tabs>
            <Tab title="recommended">
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  align: "center"
                }}
              >
                {this.state.recommended.map(schema => {
                  return (
                    <Box
                      onClick={that.props.select.bind(
                        this,
                        schema.schemaId,
                        schema.schemaVersion
                      )}
                      margin="small"
                      flex={true}
                      pad="small"
                      size="small"
                      colorIndex="grey-4"
                      key={schema.schemaId}
                      align="center"
                    >
                      {schema.schemaId} {schema.schemaVersion}
                    </Box>
                  );
                })}
              </Box>
            </Tab>
            <Tab title="all">
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)"
                }}
              >
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
                          align="center"
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
                  <Box
                    align="center"
                    style={{
                      gridColumn: "2/3"
                    }}
                  >
                    <Paragraph justify="center" align="center">
                      No content type has been created yet
                    </Paragraph>
                    <Spinning />
                  </Box>
                )}
              </Box>
            </Tab>
          </Tabs>
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
