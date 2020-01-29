import React from "react";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";

import "../../styles/styles.scss";

const CustomTile = props => {
  return (
    <Box
      colorIndex="light-1"
      size={{ width: "medium" }}
      align="center"
      pad="medium"
    >
      <Box size={{ height: "large" }} align="center" flex={false}>
        <Box separator="bottom">
          <Heading tag="h2" margin="medium">
            {props.header}
          </Heading>
        </Box>
        <Box margin="medium" alignSelf="center" justify="end">
          <Box align="center" pad={{ between: "medium" }}>
            {props.content.map((item, index) => {
              return (
                <Box textAlign="center" align="center">
                  <Heading tag="h3">{item.header}</Heading>
                  <Paragraph size="small" margin="none">
                    {item.paragraph}{" "}
                  </Paragraph>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

class Explain extends React.Component {
  render() {
    return (
      <span ref={this.props.scrollToRef}>
        <Box
          colorIndex="light-2"
          pad={{ horizontal: "large", between: "large", vertical: "large" }}
        >
          <Box flex={true} justify="center" align="center" pad="medium">
            <Heading tag="h1">Start preserving...</Heading>
          </Box>
          <Box margin={{ bottom: "medium" }}>
            <Box
              flex={true}
              direction="row"
              justify="center"
              align="center"
              pad={{ between: "small" }}
            >
              <CustomTile
                header="What"
                content={[
                  {
                    header: "Metadata",
                    paragraph:
                      "your analysis description, input data, sources, referenced analysis, collaborators"
                  },
                  {
                    header: "Files",
                    paragraph: "plots, tables, formulas, likelihoods"
                  },
                  {
                    header: "Code",
                    paragraph: "scripts, instructions, repositories"
                  },
                  {
                    header: "Workflows",
                    paragraph: "containerized images, workflows"
                  },
                  {
                    header: "Documentation",
                    paragraph: "publications, presentations, conferences, notes"
                  }
                ]}
              />
              <CustomTile
                header="How"
                content={[
                  {
                    header: "Web Interface",
                    paragraph:
                      "just login from your browser and explore all the features!"
                  },
                  {
                    header: "Command line",
                    paragraph:
                      "use our command line client to automate a preservation process and make it part of your everyday work cycle"
                  },
                  {
                    header: "RESTful interface",
                    paragraph:
                      "integrate CERN Analysis Preservation with your existing services and tools, by using our REST API"
                  }
                ]}
              />
              <CustomTile
                header="Who"
                content={[
                  {
                    header: "Researchers",
                    paragraph:
                      "it doesn't matter on which stage of your analysis you are, it's never too early or too late to preserve your work!"
                  },
                  {
                    header: "Collaborators",
                    paragraph:
                      "share your work with others and invite to contributing"
                  },
                  {
                    header: "Reviewers",
                    paragraph:
                      "access analysis, its code, results and papers from one place"
                  },
                  {
                    header: "Students",
                    paragraph:
                      "search through older analysis, share yours with supervisors, and finally preserve your work, so will never get lost!"
                  }
                ]}
              />
            </Box>
          </Box>
        </Box>
      </span>
    );
  }
}

Explain.propTypes = {};

export default Explain;
