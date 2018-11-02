import React from "react";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Section from "grommet/components/Section";
import Article from "grommet/components/Article";

class HowToSearchPage extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <Box
          flex={true}
          // full="horizontal"
          align="center"
          textAlign="center"
          colorIndex="light-2"
          pad="medium"
        >
          <Article size="xxlarge">
            <Section>
              <Heading tag="h2" align="center">
                Advanced Search Tips
              </Heading>
            </Section>
            <Section colorIndex="grey-4">
              <Heading tag="h4" margin="none">
                To perform a free text search, simply enter a text string. This
                will search all the fields for the given term.
              </Heading>
            </Section>
            <Section colorIndex="grey-4">
              <Heading tag="h4" margin="none">
                If you look for a value in a specific field, prefix the value
                with the name or alias of this field
                <br />
                <code>
                  <small>object:electron</small>
                </code>
              </Heading>
            </Section>
            <Section>
              <Heading tag="h4" margin="none">
                To search for an exact phrase, you will need to enclose the
                entire phrase in quotation marks.
                <br />
                <code>
                  <small>researcher:"John Doe"</small>
                </code>
              </Heading>
            </Section>
            <Section colorIndex="grey-4">
              <Heading tag="h4" margin="none">
                You can use wildcards in your queries (<b>"?" </b> for a single
                character and <b> "*" </b> for multiple ones). <br />Keep in
                mind that none of those can be used as first character in your
                search!
                <br />
                <code>
                  <small>dataset:"/MinimumBias/*"</small>
                </code>
              </Heading>
            </Section>
            <Section>
              <Heading tag="h4" margin="none">
                You can build more complex search criteria using the Boolean
                operators <b>"AND"</b>, <b>"OR"</b>, and <b>"NOT"</b>.
                <br />
                <code>
                  <small>
                    dataset:"/MinimumBias/Commissioning10-SD_EG-Jun14thSkim_v1/*"
                    AND trigger:(HLT_MinBiasBSC OR HLT_DiJetAve15U)
                  </small>
                </code>
              </Heading>
            </Section>
            <Section colorIndex="grey-4">
              <Heading tag="h4" margin="none">
                To point to nested fields in your analysis, use <b> "." </b>{" "}
                operator or one of available aliases.
                <br />
                <code>
                  <small>
                    researcher reviewer ananote arxiv status keyword dataset
                    trigger object
                  </small>
                </code>
              </Heading>
            </Section>
            <Section colorIndex="grey-4">
              <Heading tag="h4" margin="none">
                You can find more search tips using Lucene query syntax &nbsp;
                <a
                  href="https://lucene.apache.org/core/2_9_4/queryparsersyntax.html"
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  here
                </a>
              </Heading>
            </Section>
          </Article>
        </Box>
      </Box>
    );
  }
}

export default HowToSearchPage;
