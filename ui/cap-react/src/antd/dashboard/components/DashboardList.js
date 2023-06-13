import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Row, List, Col, Typography, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import DashboardListLoader from "./Loader";
import DashboardListItem from "./DashboardListItem";
import TypeTags from "../../partials/TypeTags";

const DashboardList = ({
  header = "",
  listType,
  list,
  loading,
  description,
  displayShowAll,
}) => {
  let listKeys = Object.keys(list);
  const [activeList, setActiveList] = useState(listKeys.sort()[0]);
  return loading ? (
    <DashboardListLoader />
  ) : (
    <List
      style={{
        background: "#fff",
        height: "100%",
      }}
      size="small"
      header={
        <Row style={{ padding: "0 15px" }}>
          <Col flex="auto">
            <Typography.Text strong style={{ marginRight: "10px" }}>
              {header}
            </Typography.Text>
            {description && (
              <Tooltip title={description} placement="right">
                <InfoCircleOutlined />
              </Tooltip>
            )}
          </Col>
          <Col flex="none">
            <TypeTags
              types={listKeys}
              updateActiveList={type => setActiveList(type)}
            />
          </Col>
        </Row>
      }
      data-cy={`${header.replace(/\s/g, "").replace(/[^\w\s]/gi, "")}-list`}
      itemLayout="horizontal"
      dataSource={list[activeList].list}
      renderItem={item => (
        <div style={{ borderBottom: "1px solid #f0f0f0", margin: "0 10px" }}>
          <Link
            data-cy={
              item.metadata ? item.metadata.general_title : "Untitled Document"
            }
            to={
              listType == "draft"
                ? `/drafts/${item.id}`
                : `/published/${item.id}`
            }
            style={{
              boxShadow: "0px 20px 1px -20px darkgray",
              backgroundColor: "blue !important",
            }}
          >
            <DashboardListItem item={item} listType={listType} />
          </Link>
        </div>
      )}
      footer={
        displayShowAll && (
          <Link to={list[activeList].more || "#"}>
            <div style={{ textAlign: "center" }}>Show All</div>
          </Link>
        )
      }
    />
  );
};

DashboardList.propTypes = {
  header: PropTypes.string,
  listType: PropTypes.string,
  description: PropTypes.element,
  loading: PropTypes.bool,
  list: PropTypes.object,
  displayShowAll: PropTypes.bool,
};

export default DashboardList;
