import React from "react";
import PropTypes from "prop-types";
import { Card, Avatar, Typography, Tag, Row, Col, Space } from "antd";
import { MailOutlined } from "@ant-design/icons";

const Profile = ({ user, cernProfile }) => {
  return (
    <Card size="small">
      <Row>
        <Col span={6} offset={9} style={{ textAlign: "center" }}>
          <Space size="middle" style={{ width: "100%" }} direction="vertical">
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
                  {cernProfile.get("display_name").split(" ")[0] +
                    " " +
                    cernProfile.get("display_name").split(" ")[1]}
                </Typography.Title>
                <Tag color="geekblue">CAP</Tag>
              </React.Fragment>
            )}
            <Col>
              <a
                href={`mailto:${user.get("email")}`}
                style={{ margin: "10px 0 " }}
              >
                <MailOutlined />
                <span style={{ marginLeft: "5px" }}>{user.get("email")}</span>
              </a>
            </Col>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

Profile.propTypes = {};

export default Profile;
