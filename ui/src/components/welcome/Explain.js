import React from "react";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";

import "../../styles/styles.scss";

class Explain extends React.Component {
  render() {
    return (
      <span ref={this.props.scrollToRef}>
        <Box colorIndex="light-2" pad="medium">
          <Box flex={true} justify="center" align="center" pad="large">
            <Heading>Start preserving..</Heading>
          </Box>
          <Box>
            <Box
              flex={true}
              direction="row"
              justify="center"
              align="center"
              pad={{ between: "large" }}
              margin={{ bottom: "large" }}
            >
              <Box
                colorIndex="light-1"
                size={{ width: { max: "medium", min: "small" } }}
                align="center"
                margin={{ horizontal: "small", vertical: "medium" }}
              >
                <Box margin={{ top: "small" }} align="center" pad="small">
                  <Heading tag="h2" strong>
                    Who
                  </Heading>
                  <Box pad="medium" size={{ height: "large" }} flex={false}>
                    <Paragraph size="large" align="center">
                      <strong>CERN members</strong>, with collaborations
                      e-groups
                    </Paragraph>
                    <Paragraph size="large" align="center">
                      Access your <strong>collaborations dashboard</strong>
                    </Paragraph>
                    <Paragraph size="large" align="center">
                      Browse <strong>published analysis</strong> from same
                      collaboration
                    </Paragraph>
                    <Paragraph size="large" align="center">
                      Work on draft <strong>analysis created or shared</strong>{" "}
                      with you
                    </Paragraph>
                  </Box>
                </Box>
              </Box>
              <Box
                colorIndex="light-1"
                size={{ width: { max: "medium", min: "small" } }}
                align="center"
                margin={{ horizontal: "small", vertical: "medium" }}
              >
                <Box margin={{ top: "small" }} align="center" pad="small">
                  <Heading tag="h2" strong>
                    What
                  </Heading>
                  <Box pad="medium" size={{ height: "large" }} flex={false}>
                    <Paragraph size="large" align="center">
                      <strong>Metadata</strong> - Analysis description, wikis,
                      plots, tables
                    </Paragraph>
                    <Paragraph size="large" align="center">
                      <strong>Files</strong> - Plots, tables, formulas,
                      likelihoods
                    </Paragraph>
                    <Paragraph size="large" align="center">
                      <strong>Code</strong> - user scripts, code repositories
                    </Paragraph>
                    <Paragraph size="large" align="center">
                      <strong>Workflows</strong> - containerized images,
                      computational workflows
                    </Paragraph>
                  </Box>
                </Box>
              </Box>
              <Box
                colorIndex="light-1"
                size={{ width: { max: "medium", min: "small" } }}
                align="center"
                margin={{ horizontal: "small", vertical: "medium" }}
              >
                <Box margin={{ top: "small" }} align="center" pad="small">
                  <Heading tag="h2" strong>
                    How
                  </Heading>
                  <Box pad="medium" size={{ height: "large" }} flex={false}>
                    <Paragraph size="large" align="center">
                      There are different ways to submit analysis content,
                      depending on your....
                    </Paragraph>
                    <Paragraph size="large" align="center">
                      (1) Via the <strong>user interface:</strong> <br />
                      Through the interactive submission forms
                    </Paragraph>
                    <Paragraph size="large" align="center">
                      (2) Via the <strong>`cap-client`</strong>
                      <br />
                      by integrating it into your scripts
                    </Paragraph>
                    <Paragraph size="large" align="center">
                      (3) Via the <strong>RESTful API:</strong>
                      <br />
                      make HTTP request
                    </Paragraph>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </span>
    );
  }
}

Explain.propTypes = {};

export default Explain;
