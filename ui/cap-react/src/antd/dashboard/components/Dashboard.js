import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Row, Col, Statistic, Card, Divider, Typography } from "antd";
import { _getList } from "../utils";
import DashboardList from "./DashboardList";
import DashboardQuickSearch from "../containers/QuickSearch";

const Dashboard = ({ fetchDashboard, results, loading }) => {
  useEffect(() => {
    fetchDashboard();
  }, []);
  let lists = _getList(results);

  const statisticValueStyle = { textAlign: "center" };

  return (
    <Row style={{ padding: "10px" }}>
      <Col
        xs={{ span: 24, order: 2 }}
        md={{ span: 12, order: 1 }}
        style={{ padding: "10px" }}
      >
        <DashboardList
          loading={loading}
          listType="draft"
          list={lists["drafts"]}
          header="Draft Documents"
          description="Draft analyses that your collaborators have given you read/write access to."
          displayShowAll
        />
      </Col>
      <Col
        xs={{ span: 24, order: 1 }}
        md={{ span: 12, order: 2 }}
        style={{ padding: "10px" }}
      >
        <Card style={{ paddingBottom: "10px" }}>
          <Row justify="space-around" align="middle">
            <Statistic
              value={results.user_drafts_count}
              title="Drafts"
              loading={loading}
              valueStyle={statisticValueStyle}
            />
            <Divider type="vertical" />
            <Statistic
              value={results.user_published_count}
              title="Published"
              loading={loading}
              valueStyle={statisticValueStyle}
            />
            <Divider type="vertical" />
            <Statistic
              value={results.user_count}
              title="Total"
              loading={loading}
              valueStyle={statisticValueStyle}
            />
          </Row>
        </Card>

        <Card
          title={<Typography.Text strong>Quick Search</Typography.Text>}
          size="small"
          headStyle={{ height: "46px", textAlign: "center" }}
          style={{ marginTop: "20px" }}
        >
          <DashboardQuickSearch />
        </Card>
      </Col>
      <Col
        xs={{ span: 24, order: 3 }}
        md={{ span: 12 }}
        style={{ padding: "10px" }}
      >
        <DashboardList
          loading={loading}
          listType="published"
          list={lists["published"]}
          header="Published Documents in CAP"
          description="All analyses published on CAP by members of your collaboration."
          displayShowAll
        />
      </Col>
      <Col
        xs={{ span: 24, order: 4 }}
        md={{ span: 12 }}
        style={{ padding: "10px" }}
      >
        <DashboardList
          loading={loading}
          listType="workflows"
          list={lists["workflows"]}
          header="Workflows"
          description="Recent workflows attached to your content."
        />
      </Col>
    </Row>
  );
};

Dashboard.propTypes = {
  fetchDashboard: PropTypes.func,
  results: PropTypes.object,
  loading: PropTypes.bool,
};

export default Dashboard;
