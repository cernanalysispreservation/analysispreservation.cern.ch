import React from "react";
import PropTypes from "prop-types";
import { Card, Avatar, Typography, Tag, Row, Col, Space, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";

const Profile = ({ user, cernProfile }) => {
  return (
    <Card size="small">
      <Row justify="center">
        <Col xs={18} md={10} style={{ textAlign: "center" }}>
          <Space size="middle" direction="vertical">
            <Avatar size="large" className="avatar">
              {`${user
                .get("email")
                .split(".")[0]
                .charAt(0)
                .toUpperCase()}${user
                .get("email")
                .split(".")[1]
                .charAt(0)
                .toUpperCase()}`}
            </Avatar>
            {cernProfile && (
              <React.Fragment>
                <Typography.Title level={4}>
                  {cernProfile.get("display_name")}
                </Typography.Title>
                <Space direction="horizontal">
                  {cernProfile.has("department") && (
                    <Tag color="geekblue">{cernProfile.get("department")}</Tag>
                  )}
                  {cernProfile.has("common_name") && (
                    <Tag color="geekblue">{cernProfile.get("common_name")}</Tag>
                  )}
                </Space>
              </React.Fragment>
            )}
            <Col>
              <Button
                icon={<MailOutlined />}
                href={`mailto:${user.get("email")}`}
                type="link"
              >
                {user.get("email")}
              </Button>
            </Col>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
  cernProfile: PropTypes.object
};

export default Profile;
