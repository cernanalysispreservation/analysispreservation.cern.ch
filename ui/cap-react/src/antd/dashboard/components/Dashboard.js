import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Row, Col, Statistic, Card, Divider } from "antd";
import { _getList } from "../utils";
import DashboardList from "./DashoboardList";
import DashboardQuickSearch from "../containers/QuickSearch";
import "./Dashboard.less";

const Dashboard = ({ fetchDashboard, results, loading }) => {
  useEffect(() => {
    fetchDashboard();
  }, []);
  let lists = _getList(results);

  return (
    <Row
      gutter={[{ xs: 8, sm: 16, md: 24 }, { xs: 8, sm: 16, md: 24 }]}
      className="padding10"
    >
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
  loading: PropTypes.bool
};

export default Dashboard;
