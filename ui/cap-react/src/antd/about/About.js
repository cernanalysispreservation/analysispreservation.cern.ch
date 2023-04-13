import DocumentTitle from "../partials/DocumentTitle";
import { Row, Col, Typography, Space } from "antd";

const About = () => {
  return (
    <DocumentTitle title="About">
      <Row justify="center">
        <Col xs={20} md={16} lg={10}>
          <Typography.Title>What is it?</Typography.Title>
          <Space direction="vertical" size="middle">
            <Typography.Paragraph>
              CERN Analysis Preservation (CAP) is an open source preservation
              service developed by the Scientific Information Service at CERN
              for physicists to preserve and document the various materials
              produced in the analysis process, e.g. datasets, code,
              documentation, so that they are reusable and understandable in the
              future. By using this tool, researchers ensure these outputs are
              preserved and also findable and accessible by their (internal)
              collaborators.
            </Typography.Paragraph>
            <Typography.Paragraph>
              To make the tool as easy to use as possible, an API and a
              dedicated client are available, as well as integrations with
              long-established collaboration databases and platforms. This
              reduces the burden on the users and minimises duplication of
              information. The researchers remain in full control of their
              information, while being able to preserve and share their data and
              materials easily with their colleagues and reviewers.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Please refer to our full documentation for more details on how to
              use CAP, use cases, frequently asked questions and more at &nbsp;
              <Typography.Link
                href="https://analysispreservation.cern.ch/docs/general/"
                target="_blank"
              >
                cernanalysispreservation.readthedocs.io/en/latest/
              </Typography.Link>
            </Typography.Paragraph>
          </Space>
          <Typography.Title>How can I use the service?</Typography.Title>

          <Typography.Paragraph>
            It is possible to interact with the service in three different ways:
          </Typography.Paragraph>
          <ul>
            <Space direction="vertical">
              <li>
                It is possible to interact with the service in three different
                ways:
              </li>
              <li>
                The command-line client &nbsp;
                <Typography.Link
                  target="_blank"
                  href="https://analysispreservation.cern.ch/docs/cli/"
                >
                  (cap-client)
                </Typography.Link>
              </li>
              <li>
                The REST API &nbsp;
                <Typography.Link
                  target="_blank"
                  href="https://analysispreservation.cern.ch/docs/api/"
                >
                  (API docs)
                </Typography.Link>
              </li>
            </Space>
          </ul>

          <Typography.Title>Who has access to my work?</Typography.Title>
          <Typography.Paragraph>
            As we are preserving sensitive data, we apply safety measures and
            access control to all information added to CAP. Access will always
            be restricted to members of the collaboration associated with an
            analysis. Permissions within a collaboration can be adjusted by the
            creator of the analysis, defaulting to creator-only access. More
            specifically:
          </Typography.Paragraph>
          <ul>
            <Space direction="vertical">
              <li>
                only collaboration members have access to a collaboration’s
                area, can create analyses and can see shared analyses
              </li>
              <li>
                only a certain collaboration’s members have access to this
                collaboration’s analyses
              </li>
              <li>
                only members granted specific rights can see or edit a draft
                version of an analysis
              </li>
              <li>
                only the creator can see or edit an analysis with default
                permission settings For more detailed information please refer
                to our documentation.
              </li>
            </Space>
          </ul>
          <Typography.Title>Contact</Typography.Title>
          <Typography.Paragraph>
            You can contact us by opening tickets for requests and incidents
            through the &nbsp;
            <Typography.Link href="https://cern.service-now.com/service-portal?id=functional_element&name=Data-Analysis-Preservation">
              analysis-preservation-support@cern.ch
            </Typography.Link>
            We welcome everyone to test and use the system. If you or your
            team/working group/collaboration would like to start using CAP,
            please get in touch.
          </Typography.Paragraph>
        </Col>
      </Row>
    </DocumentTitle>
  );
};

export default About;
