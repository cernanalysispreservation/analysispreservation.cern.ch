import { COLLECTION_BASE } from "../../routes";
import DashboardQuickSearch from "../containers/QuickSearch";
import { _getList } from "../utils";
import DashboardList from "./DashboardList";
import {
  Row,
  Col,
  Statistic,
  Card,
  Divider,
  Typography,
  Tag,
  Space,
  Modal,
  Button,
} from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MAX_DISPLAYED_COLLECTIONS = 20;

const Dashboard = ({ fetchDashboard, results, loading, groups }) => {
  const [showModal, setShowModal] = useState();

  useEffect(() => {
    fetchDashboard();
  }, []);
  let lists = _getList(results);

  const generateCollectionTags = groups =>
    groups.map(e => (
      <Link
        key={e["deposit_group"]}
        to={`${COLLECTION_BASE}/${e["deposit_group"]}`}
      >
        <Tag>{e["deposit_group"]}</Tag>
      </Link>
    ));

  return (
    <Row style={{ padding: "10px" }}>
      {showModal && (
        <Modal
          title="Your Collections"
          visible={showModal}
          onCancel={() => setShowModal(false)}
          footer={null}
        >
          <Space size={[0, 8]} wrap style={{ margin: "20px 0" }}>
            {generateCollectionTags(groups.toJS())}
          </Space>
        </Modal>
      )}
      <Col
        xs={{ span: 24, order: 2 }}
        md={{ span: 12, order: 1 }}
        className="padding10"
      >
        <DashboardList
          loading={loading}
          listType="draft"
          list={lists["drafts"]}
          header="Draft Documents"
          emptyMessage="Draft analyses that your collaborators have given you read/write access to."
        />
      </Col>
      <Col
        xs={{ span: 24, order: 1 }}
        md={{ span: 12, order: 2 }}
        className="padding10"
      >
        <Card>
          <Row justify="space-around" align="middle">
            <Statistic
              value={results.user_drafts_count}
              title="Drafts"
              loading={loading}
            />
            <Divider type="vertical" />
            <Statistic
              value={results.user_published_count}
              title="Published"
              loading={loading}
            />
            <Divider type="vertical" />
            <Statistic
              value={results.user_count}
              title="Total"
              loading={loading}
            />
          </Row>
        </Card>

        <Card title="Quick Search">
          <DashboardQuickSearch />
        </Card>

        <Card
          title={<Typography.Text strong>Your Collections</Typography.Text>}
          size="small"
          headStyle={{ height: "46px" }}
          style={{ marginTop: "20px" }}
        >
          <Space size={[0, 8]} wrap>
            {generateCollectionTags(
              groups.toJS().slice(0, MAX_DISPLAYED_COLLECTIONS)
            )}
            {groups.size > MAX_DISPLAYED_COLLECTIONS && (
              <Button
                type="link"
                size="small"
                onClick={() => setShowModal(true)}
                style={{ textAlign: "center" }}
              >
                Show All
              </Button>
            )}
          </Space>
        </Card>
      </Col>
      <Col xs={{ span: 24, order: 3 }} md={{ span: 12 }} className="padding10">
        <DashboardList
          loading={loading}
          listType="published"
          list={lists["published"]}
          header="Published (in CAP) Documents"
          emptyMessage="All analyses published on CAP by members of your collaboration."
        />
      </Col>
      <Col xs={{ span: 24, order: 4 }} md={{ span: 12 }} className="padding10">
        <DashboardList
          loading={loading}
          listType="workflows"
          list={lists["workflows"]}
          header="workflows"
          emptyMessage="Recent workflows attached to your content"
        />
      </Col>
    </Row>
  );
};

Dashboard.propTypes = {
  fetchDashboard: PropTypes.func,
  results: PropTypes.object,
  loading: PropTypes.bool,
  groups: PropTypes.object,
};

export default Dashboard;
