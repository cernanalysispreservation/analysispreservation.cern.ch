import React from "react";

import Box from "grommet/components/Box";
import Tiles from "grommet/components/Tiles";

import CustomTile from "./CustomTile";

class HowToSearchPage extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <Box
          flex={true}
          full="horizontal"
          textAlign="center"
          colorIndex="light-2"
          pad="medium"
        >
          <Tiles fill={true}>
            <CustomTile
              header={
                <span>
                  To perform a free text search, simply enter a text string.
                  This will search for given terms in the whole document
                </span>
              }
              code="validation data 2011"
            />
            <CustomTile
              header="To make more detailed query ask for terms in a specific fields"
              code="object:electron"
            />
            <CustomTile
              header={
                <span>
                  To point to nested fields use <b> . </b> operator or one of
                  many available aliases
                </span>
              }
              code="researcher reviewer ananote arxiv status keyword dataset
                            trigger object"
            />
            <CustomTile
              header={
                <span>
                  To make your query more generic, use wildcards: <br />
                  <b>? </b> &nbsp;for a single character <br />
                  <b> * </b> &nbsp; for multiple ones <br />
                </span>
              }
              code="/DoubleMu*/*/AOD"
            />
            <CustomTile
              header={
                <span>
                  {" "}
                  To search for terms contatining special characters escape them
                  with <b>/</b>
                </span>
              }
              code="* ? . : ! ( ) { } [ ] &quot; ~"
            />
            <CustomTile
              header={
                <span>
                  To search for the whole phrase, put it in quotes. Keep in mind
                  that <b>phrases are not analyzed</b>, hence all special
                  characters (like wildcards) do not have
                  any effect.
                </span>
              }
              code="researcher:&quot;John Doe&quot;"
            />
          </Tiles>
        </Box>
      </Box>
    );
  }
}

export default HowToSearchPage;
