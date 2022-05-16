import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown, Space, Typography, Row, Col } from "antd";
import { DownOutlined } from "@ant-design/icons";
import prettyBytes from "pretty-bytes";

import EllipsisText from "../../EllipsisText";
import DropDownMenu from "./DropDownMenu";

const { Text } = Typography;

const DropDownFiles = props => {
  const [isShown, setIsShown] = useState(false);

  if (!props.file) return null;

  return (
    <React.Fragment>
      <Row
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
        flex
      >
        <Col span={18} lex="auto">
          <Row
            flex={1}
            justify="space-between"
            align="center"
            style={{ width: "100%" }}
            wrap={false}
          >
            <Space>
              {props.file.icon}
              <EllipsisText
                middle
                tooltip
                length={30}
                suffixCount={10}
                type="secondary"
              >
                {props.file.name}
              </EllipsisText>
            </Space>
          </Row>
        </Col>
        <Col span={6} align="center" justify="end">
          <Row align="end">
            <Space>
              <Text
                style={{ wrap: false, textOverflow: "" }}
                type="secondary"
              >{`${prettyBytes(props.file.data.size).toUpperCase()}`}</Text>
              {isShown && (
                <Dropdown
                  trigger="click"
                  overlay={DropDownMenu(
                    props.file,
                    () => props.infoClick(props.file),
                    () => props.getFileVersions(),
                    (link, path) => props.deleteFile(link, path)
                  )}
                >
                  <DownOutlined style={{ fontSize: "10px" }} />
                </Dropdown>
              )}
            </Space>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

DropDownFiles.propTypes = {
  file: PropTypes.object,
  versions: PropTypes.object,
  deleteFile: PropTypes.func,
  getFileVersions: PropTypes.func,
  infoClick: PropTypes.func
};

export default DropDownFiles;
