import { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Button, Alert, Space } from "antd";
import CreateForm from "../drafts/CreateForm";

const Create = ({ contentTypes, match }) => {
  let allow = true;
  const [form, setForm] = useState(null);

  const { anatype } = match.params;

  if (anatype && contentTypes) {
    allow = contentTypes
      .map(item => item.get("deposit_group"))
      .includes(anatype);
  }

  return (
    <Row justify="center" style={{ paddingTop: "15px" }}>
      <Col xs={22} sm={18} md={16} lg={8}>
        <Space direction="vertical" size="large">
          {!allow && (
            <Alert
              data-cy="permission-warning-alert"
              type="warning"
              showIcon
              description="Your account has no permissions for this type of analysis or  the analysis type is incorrect"
            />
          )}
          <Card
            title="Create Analysis"
            actions={[
              <Button
                key="create"
                type="primary"
                disabled={!allow}
                onClick={() => form.submit()}
              >
                Start Preserving
              </Button>,
            ]}
          >
            <CreateForm
              anatype={anatype}
              disabled={!allow}
              updateModal={form => setForm(form)}
            />
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

Create.propTypes = {
  contentTypes: PropTypes.object,
  match: PropTypes.object,
};

export default Create;
