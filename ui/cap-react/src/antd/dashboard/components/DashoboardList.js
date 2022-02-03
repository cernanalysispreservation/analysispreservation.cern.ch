import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Row, List, Col } from "antd";
import DashboardListLoader from "./Loader";
import DashboardListItem from "./DashboardListItem";
import TypeTags from "../../partials/TypeTags";

const DashoboardList = ({ header = "", listType, list, loading }) => {
  let listKeys = Object.keys(list);
  const [activeList, setActiveList] = useState(listKeys.sort()[0]);
  return loading ? (
    <DashboardListLoader />
  ) : (
    <List
      className="__DashboardList__"
      size="small"
      header={
        <Row style={{ padding: "0 10px" }}>
          <Col flex="auto">
            <strong>{header}</strong>
          </Col>
          <Col flex="none">
            <TypeTags
              types={listKeys}
              updateActiveList={type => setActiveList(type)}
            />
          </Col>
        </Row>
      }
      data-cy={`${header.replace(/\s/g, "")}-list`}
      itemLayout="horizontal"
      dataSource={list[activeList].list}
      renderItem={item => (
        <Link
          data-cy={
            item.metadata ? item.metadata.general_title : "Untitled Document"
          }
          to={
            listType == "draft" ? `/drafts/${item.id}` : `/published/${item.id}`
          }
        >
          <DashboardListItem item={item} listType={listType} />
        </Link>
      )}
      footer={
        ["draft", "published"].includes(listType) && (
          <Link to={list[activeList].more || "#"}>
            <div style={{ textAlign: "center" }}>Show All</div>
          </Link>
        )
      }
    />
  );
};

DashoboardList.propTypes = {
  header: PropTypes.string,
  listType: PropTypes.string,
  emptyMessage: PropTypes.element,
  loading: PropTypes.bool,
  list: PropTypes.object
};

export default DashoboardList;
