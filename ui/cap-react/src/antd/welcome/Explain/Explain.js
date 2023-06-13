import { Row, Col, Typography, Space, Card, Divider } from "antd";

const Explain = () => {
  const explainBoxes = [
    {
      title: "What",
      data: [
        {
          title: "Metadata",
          description:
            "Your analysis description, input data, sources, referenced analyses, collaborators",
        },
        {
          title: "Files",
          description: "Plots, tables, formulas, likelihoods",
        },
        {
          title: "Code",
          description: "Scripts, instructions, repositories",
        },
        {
          title: "Workflows",
          description: "Containerized images, workflows",
        },
        {
          title: "Documentation",
          description: "Publications, presentations, conferences, notes",
        },
      ],
    },
    {
      title: "How",
      data: [
        {
          title: "Web Interface",
          description: "Login from your browser and explore all the features",
        },
        {
          title: "Command Line",
          description:
            "Use our command line client to automate the preservation process and make it part of your everyday work cycle",
        },
        {
          title: "RESTful Interface",
          description:
            "Integrate CERN Analysis Preservation with your existing services and tools by using our REST API",
        },
      ],
    },
    {
      title: "Who",
      data: [
        {
          title: "Researchers",
          description:
            "It doesn't matter on which stage of your analysis you are, it's never too early or too late to preserve your work",
        },
        {
          title: "Collaborators",
          description:
            "Share your work with others and invite them to contribute",
        },
        {
          title: "Reviewers",
          description:
            "Access analyses and all their components from one central place",
        },
        {
          title: "Students",
          description:
            "Search through older analyses, share with your supervisors, and preserve your work so that it never gets lost",
        },
      ],
    },
  ];
  return (
    <Col xs={24} style={{ padding: "30px" }} id="explain">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Title
          style={{ textAlign: "center", fontSize: "3rem" }}
          italic
        >
          Start Preserving
        </Typography.Title>

        <Row gutter={[64, 64]} align="center">
          {explainBoxes.map(item => (
            <Col key={item.title} xs={22} md={10} lg={8} xl={6} xxl={5}>
              <Card
                style={{
                  height: "100%",
                }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Typography.Title
                    level={3}
                    style={{ textAlign: "center", margin: 0 }}
                  >
                    {item.title}
                  </Typography.Title>
                  <Divider />
                  {item.data.map(box => (
                    <Space
                      direction="vertical"
                      size="small"
                      key={box.title}
                      style={{
                        width: "100%",
                        padding: "0.2rem",
                        textAlign: "center",
                      }}
                    >
                      <Typography.Title level={5}>{box.title}</Typography.Title>
                      <Typography.Paragraph
                        type="secondary"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {box.description}
                      </Typography.Paragraph>
                    </Space>
                  ))}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </Col>
  );
};

export default Explain;
