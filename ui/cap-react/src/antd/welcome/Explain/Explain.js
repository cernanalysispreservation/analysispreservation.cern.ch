import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Typography, Divider, Space } from "antd";

const Explain = props => {
  const explainBoxes = [
    {
      title: "What",
      data: [
        {
          title: "Metadata",
          description:
            "Your analysis description, input data, sources, referenced analyses, collaborators"
        },
        {
          title: "Files",
          description: "Plots, tables, formulas, likelihoods "
        },
        {
          title: "Code",
          description: "Scripts, instructions, repositories"
        },
        {
          title: "Workflows",
          description: "Containerized images, workflows "
        },
        {
          title: "Documentation",
          description: "Publications, presentations, conferences, notes "
        }
      ]
    },
    {
      title: "How",
      data: [
        {
          title: "Web Interface",
          description: "Login from your browser and explore all the features"
        },
        {
          title: "Command Line",
          description:
            "Use our command line client to automate the preservation process and make it part of your everyday work cycle"
        },
        {
          title: "RESTful Interface",
          description:
            "Integrate CERN Analysis Preservation with your existing services and tools by using our REST API "
        }
      ]
    },
    {
      title: "Who",
      data: [
        {
          title: "Researchers",
          description:
            "It doesn't matter on which stage of your analysis you are, it's never too early or too late to preserve your work"
        },
        {
          title: "Collaborators",
          description:
            "Share your work with others and invite them to contribute "
        },
        {
          title: "Reviewers",
          description:
            "Access analyses and all their components from one central place  "
        },
        {
          title: "Students",
          description:
            "Search through older analyses, share with your supervisors, and preserve your work so that it never gets lost "
        }
      ]
    }
  ];
  return (
    <Row
      justify="space-around"
      style={{ textAlign: "center", height: "90vh" }}
      gutter={10}
    >
      <Col span={24}>
        <Typography.Title level={1}>Start Preserving</Typography.Title>
      </Col>

      {explainBoxes.map(item => (
        <Col
          key={item.title}
          span={5}
          style={{
            background: "white",
            textAlign: "center",
            padding: "25px 10px"
          }}
        >
          <Typography.Title level={3}>{item.title}</Typography.Title>
          <Divider />
          <Space direction="vertical">
            {item.data.map(box => (
              <React.Fragment key={box.title}>
                <Typography.Title level={5}>{box.title}</Typography.Title>
                <Typography.Paragraph>{box.description}</Typography.Paragraph>
              </React.Fragment>
            ))}
          </Space>
        </Col>
      ))}
    </Row>
  );
};

Explain.propTypes = {};

export default Explain;
