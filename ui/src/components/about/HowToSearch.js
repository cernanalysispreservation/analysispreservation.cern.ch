import React from "react";

import Box from "grommet/components/Box";
import Tiles from "grommet/components/Tiles";
import Tile from "grommet/components/Tile";
import Heading from "grommet/components/Heading";

function CustomTile(props) {
  return (
    <Tile basis={props.basis || "1/3"} pad="large">
      <Heading tag="h5">{props.header}</Heading>
      <code style={{ color: "#C094bf" }}>
        <span>{props.code}</span>
      </code>
    </Tile>
  );
}

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
                  For our search queries we use &nbsp;
                  <a
                    href="https://lucene.apache.org/core/2_9_4/queryparsersyntax.html"
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    Lucene Query
                  </a>
                  &nbsp;language
                </span>
              }
            />
            <CustomTile
              header="To perform a free text search, simply enter a text string. This
                            gonna search all the fields for the given term."
            />
            <CustomTile
              header="If you look for a value in a specific field, prefix the value
                            with the name or alias of this field "
              code="object:electron"
            />
            <CustomTile
              header="To search for the whole phrase, dont forget to put it in quotes!"
              code="researcher:&quot;John Doe&quot;"
            />
            <CustomTile
              header={
                <span>
                  You can use wildcards in your queries (<b>? </b> for a single
                  character and <b> * </b> for multiple one). <br />Keep in mind
                  that none of those can be used as a first character of search!
                </span>
              }
              code="dataset:&quot;/MinimumBias/*&quot;"
            />
            <CustomTile
              header={
                <span>
                  You can build more complex search criteria using Boolean
                  operators <b>AND</b>, <b>OR</b>, and <b>NOT</b>.
                </span>
              }
              code="dataset:&quot;/MinimumBias/Commissioning10-SD_EG-Jun14thSkim_v1/*&quot;
                            AND trigger:(HLT_MinBiasBSC OR HLT_DiJetAve15U)"
            />
            <CustomTile
              header={
                <span>
                  To point to nested fields in your analysis, use <b> . </b>{" "}
                  operator or one of available aliases.
                </span>
              }
              code="researcher reviewer ananote arxiv status keyword dataset
                            trigger object"
            />
          </Tiles>
        </Box>
      </Box>
    );
  }
}

export default HowToSearchPage;
