import { Skeleton } from "antd";

const Results = () => {
  return [...Array(5)].map(item => (
    <div
      key={item}
      style={{ background: "#fff", padding: "15px", marginBottom: "10px" }}
    >
      <Skeleton active />
    </div>
  ));
};

export default Results;
