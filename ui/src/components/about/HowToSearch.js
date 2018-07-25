import React from "react";

import { Anchor, Box, Section, Article, Heading } from "grommet";
import Header from "../partials/Header";

class HowToSearchPage extends React.Component {
    render() {
        return (
            <Box flex={true}>
                <Header />
                <Box flex={true} textAlign="center" align="center">
                    <Article size="xxlarge">
                        <Section>
                            <Heading tag="h2" align="center">How To Search</Heading>
                        </Section>
                        <Section colorIndex="grey-4">
                            <Heading tag="h3" margin="none">
                                For our search queries we use <a href="https://lucene.apache.org/core/2_9_4/queryparsersyntax.html" target="_blank"> Lucene Query </a> language 
                            </Heading>
                        </Section>
                        <Section>
                            <Heading tag="h3" margin="none">
                                To perform a free text search, simply enter a text string. This gonna search all the fields for the given term.
                            </Heading>
                        </Section>
                        <Section colorIndex="grey-4">
                            <Heading tag="h3" margin="none">
                                If you look for a value in a specific field, prefix the value with the name or alias of this field
                                <br/>
                                <code>
                                    <small>
                                        object:electron
                                    </small>
                                </code>
                            </Heading>
                        </Section>
                        <Section>
                            <Heading tag="h3" margin="none">
                                To search for the whole phrase, dont forget to put it in quotes!
                                <br/>
                                <code>
                                    <small>
                                        researcher:"John Doe"
                                    </small>
                                </code>
                            </Heading>
                        </Section>
                        <Section colorIndex="grey-4">
                            <Heading tag="h3" margin="none">
                                You can use wildcards in your queries (<b>? </b> for a single character and <b> * </b> for multiple one). <br/>Keep in mind that none of those can be used as a first character of search!
                                <br/>
                                <code>
                                    <small>
                                        dataset:"/MinimumBias/*"
                                    </small>
                                </code>
                            </Heading>
                        </Section>
                        <Section>
                            <Heading tag="h3" margin="none">
                                You can build more complex search criteria using Boolean operators <b>AND</b>, <b>OR</b>, and <b>NOT</b>.
                                <br/>
                                <code>
                                    <small>
                                        dataset:"/MinimumBias/Commissioning10-SD_EG-Jun14thSkim_v1/*" AND trigger:(HLT_MinBiasBSC OR HLT_DiJetAve15U)
                                    </small>
                                </code>
                            </Heading>
                        </Section>
                        <Section colorIndex="grey-4">
                            <Heading tag="h3" margin="none">
                                To point to nested fields in your analysis, use <b> . </b> operator or one of available aliases. 
                                <br/>
                                <code>
                                    <small>
                                        researcher reviewer ananote arxiv status keyword dataset trigger object
                                    </small>
                                </code>
                            </Heading>
                        </Section>
                        <Section>
                            <Anchor path='/search' index={true}>
                                <Heading tag="h2" align="center">Start Searching</Heading>
                            </Anchor>
                        </Section>
                    </Article>
                </Box>
            </Box>
        );
    }
}

export default HowToSearchPage;
