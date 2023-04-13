import { List, Row, Skeleton } from "antd";

const DashboardLoader = () => {
  return (
    <List
      style={{ background: "#fff" }}
      size="small"
      header={
        <Row
          align="middle"
          justify="space-between"
          style={{ padding: "0 10px" }}
        >
          <Skeleton paragraph={{ rows: 0, width: 10 }} active />
        </Row>
      }
      itemLayout="horizontal"
      dataSource={[1, 2]}
      renderItem={item => (
        <List.Item key={item}>
          <List.Item.Meta
            title={<Skeleton paragraph={{ rows: 0, width: 10 }} active />}
            description={<Skeleton paragraph={{ rows: 0, width: 10 }} active />}
          />
        </List.Item>
      )}
    />
  );
};

DashboardLoader.propTypes = {};

export default DashboardLoader;
