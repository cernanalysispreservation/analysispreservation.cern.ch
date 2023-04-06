import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Avatar, Typography, Tag, Row, Col, Space, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { stringToHslColor } from "../../utils";

const Profile = ({ user, cernProfile }) => {
  console.log("payaya@cern.ch".split("@")[0].split(".")[0]);

  const [emailName] = useState(() => {
    const left = user
      .get("email")
      .split("@")[0]
      .split(".");
    const first = left[0].charAt(0).toUpperCase();
    const second = (left.length > 1
      ? left[1].charAt(0)
      : left[0].charAt(1)
    ).toUpperCase();
    return `${first}${second}`;
  });

  return (
    <Card size="small">
      <Row justify="center">
        <Col xs={18} md={10} style={{ textAlign: "center" }}>
          <Space size="middle" direction="vertical">
            <Avatar
              size={70}
              style={{
                backgroundColor: stringToHslColor(user.get("email"), 40, 70),
              }}
            >
              {emailName}
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
  cernProfile: PropTypes.object,
};

export default Profile;
