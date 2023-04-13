import { Skeleton, Space } from "antd";

const OverviewLoading = () => {
  return (
    <Space size="middle" direction="vertical" style={{ width: "100%" }}>
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
    </Space>
  );
};

export default OverviewLoading;
