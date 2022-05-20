import React from "react";
import { Row, Col, Typography, Space, Card } from "antd";

const Explain = () => {
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
    <Row gutter={[32, 32]} align="center">
      {explainBoxes.map(item => (
        <Col key={item.title} xs={22} md={12} lg={8} xxl={6}>
          <Card
            style={{
              height: "100%"
            }}
            title={item.title}
          >
            <Space direction="vertical">
              {item.data.map(box => (
                <React.Fragment key={box.title}>
                  <Typography.Title level={5}>{box.title}</Typography.Title>
                  <Typography.Paragraph>{box.description}</Typography.Paragraph>
                </React.Fragment>
              ))}
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Explain;
