import PropTypes from "prop-types";
import { Divider, Row, Space, Tag } from "antd";
import { GithubOutlined, GitlabOutlined } from "@ant-design/icons";

const renderResourceIcon = (host) => {
  switch (host) {
    case "github.com":
      return <GithubOutlined />;
    case "gitlab.cern.ch":
    case "gitlab.com":
      return <GitlabOutlined />;
    default:
      return null;
  }
};

const InfoArrayBox = ({ items }) => {
  return (
    <div>
      {items.map((item, index) => (
        <Row
          justify="space-between"
          key={index}
          style={{ marginBottom: "10px" }}
        >
          <Space>
            {renderResourceIcon(item.host)}
            <div>
              {item.owner}/{item.name}
              {item.branch && (
                <span style={{ marginLeft: "5px" }}>
                  [<b>{item.branch}</b>]
                </span>
              )}
            </div>
          </Space>

          {item.event_type == "release" ? (
            <Tag color="blue">on Release/Tag</Tag>
          ) : (
            <Tag color="geekblue">on Push</Tag>
          )}

          <Divider />
        </Row>
      ))}
    </div>
  );
};

InfoArrayBox.propTypes = {
  items: PropTypes.object,
};

export default InfoArrayBox;
