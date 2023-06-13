import PropTypes from "prop-types";
import { Empty, Row, Space, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import TimeAgo from "react-timeago";
import ResultsLoading from "../Loaders/Results";

const Results = ({ results, loading }) => {
  const timeOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (loading) return <ResultsLoading />;

  if (!results.size > 0)
    return (
      <Row style={{ background: "#fff" }} justify="center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Typography.Text type="secondary">0 Results</Typography.Text>
          }
        >
          <Typography.Paragraph>
            No search results were found or you have no permission to see them
          </Typography.Paragraph>
        </Empty>
      </Row>
    );

  return results.map((item, index) => (
    <div
      key={index}
      style={{ background: "#fff", padding: "15px", marginBottom: "10px" }}
    >
      <Link
        data-cy={item.getIn(["metadata", "general_title"]) || "No title"}
        to={
          item.get("status") === "published"
            ? `/published/${item.get("id")}`
            : `/drafts/${item.get("id")}`
        }
      >
        <Typography.Title
          level={5}
          type={!item.getIn(["metadata", "general_title"]) && "secondary"}
        >
          {item.getIn(["metadata", "general_title"]) || "No title"}
        </Typography.Title>
      </Link>

      <Space size="small" style={{ marginBottom: "10px", flexWrap: "wrap" }}>
        {[
          item.getIn(["schema", "name"]),
          new Date(item.get("created")).toLocaleString("en-GB", timeOptions),
          ...item.get("labels"),
        ].map(label => (
          <Tag key={label}>{label}</Tag>
        ))}
      </Space>

      {item.hasIn(["metadata", "basic_info", "abstract"]) && (
        <Typography.Paragraph
          ellipsis={{ rows: 2 }}
          style={{ lineHeight: 1.5 }}
        >
          {item.getIn(["metadata", "basic_info", "abstract"])}
        </Typography.Paragraph>
      )}

      <Row justify="space-between">
        {item.get("created_by") && (
          <Typography.Link
            href={`mailto:${item.getIn(["created_by", "email"])}`}
          >
            <Space>
              <UserOutlined />
              {item.hasIn(["created_by", "profile", "display_name"])
                ? item.getIn(["created_by", "profile", "display_name"])
                : item.getIn(["created_by", "email"])}
            </Space>
          </Typography.Link>
        )}

        {item.has("updated") && (
          <Typography.Text type="secondary">
            Updated <TimeAgo date={item.get("updated")} minPeriod="60" />
          </Typography.Text>
        )}
      </Row>
    </div>
  ));
};

Results.propTypes = {
  results: PropTypes.object,
  loading: PropTypes.bool,
};

export default Results;
