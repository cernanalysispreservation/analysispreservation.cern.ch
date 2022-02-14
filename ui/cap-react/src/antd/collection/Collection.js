import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchRecordsResults } from "../../actions/common";
import { Card, Col, Empty, Row, Select, Space, Tag, Typography } from "antd";
import RichEditorWidget from "../../components/drafts/form/themes/grommet-preview/widgets/RichEditor/RichEditorWidget";
import NoDocs from "../../img/noDocs.svg";
import DashboardList from "../dashboard/components/DashoboardList";
import { _getCollectionList } from "../dashboard/utils";
import CollectionPermissions from "./CollectionPermissions";
import "./Collection.less";
import ErrorScreen from "../partials/Error";

const Collection = props => {
  useEffect(() => {
    // get URL params collection_name and version
    let { collection_name, version = null } = props.match.params;

    // fetch results for the deposit/records
    props.fetchRecordsResults(collection_name, version);
  }, []);
  // //  display error screen when error occurs
  if (props.error) {
    return <ErrorScreen message={props.error} />;
  }

  let { collection_name, version } = props.match.params;

  let lists = _getCollectionList(props.results);

  return (
    <Row
      justify="center"
      style={{ padding: "10px 0" }}
      className="__Collection__"
    >
      <Col lg={18} xs={22} xl={14}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div className="banner">
            <Row justify="space-between" style={{ marginBottom: "20px" }}>
              <Space direction="vertical">
                <Typography.Title level={3}>
                  {props.schema_data.has("fullname") &&
                    props.schema_data.get("fullname")}
                </Typography.Title>
                <Tag>{props.schema_data.get("name")} </Tag>
              </Space>
              <div>
                <Select
                  defaultValue={version ? version : "allversions"}
                  style={{ width: 110 }}
                  size="small"
                  onChange={val =>
                    val == "allversions"
                      ? props.history.push(`/collection/${collection_name}`)
                      : props.history.push(
                          `/collection/${collection_name}/${val}`
                        )
                  }
                >
                  {[
                    "allversions",
                    ...(props.schema_data.has("versions") &&
                      props.schema_data.get("versions").map(item => item))
                  ].map(item => (
                    <Select.Option value={item} key={item}>
                      {item === "allversions" ? "All Versions" : item}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Row>
            <Typography.Text>
              {props.schema_data.hasIn(["config", "description"])
                ? props.schema_data.getIn(["config", "description"])
                : "No Description"}
            </Typography.Text>
          </div>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Card title="Read me">
                  {props.schema_data.has("config") && (
                    <div className="collection-rich-editor">
                      {props.schema_data.hasIn(["config", "readme"]) ? (
                        <RichEditorWidget
                          value={props.schema_data.getIn(["config", "readme"])}
                          canViewProps={{ menu: false }}
                          viewProps={{ html: true, md: false }}
                          readonly
                        />
                      ) : (
                        <Empty image={<NoDocs />} description="No Content" />
                      )}
                    </div>
                  )}
                </Card>
                <Card>
                  <DashboardList
                    header="Latest Drafts"
                    loading={props.loading}
                    listType="draft"
                    list={lists["drafts"]}
                  />
                </Card>
                <Card>
                  <DashboardList
                    header="Latest Published"
                    loading={props.loading}
                    listType="published"
                    list={lists["published"]}
                  />
                </Card>
              </Space>
            </Col>

            <Col xs={24} md={12}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Card title="Permissions">
                  <CollectionPermissions
                    permissions={props.schema_data.getIn([
                      "config",
                      "permissions"
                    ])}
                  />
                </Card>
              </Space>
            </Col>
          </Row>
        </Space>
      </Col>
    </Row>
  );
};

Collection.propTypes = {
  schema: PropTypes.object,
  schema_data: PropTypes.object,
  match: PropTypes.object,
  results: PropTypes.object,
  history: PropTypes.object,
  error: PropTypes.object,
  loading: PropTypes.bool,
  fetchRecordsResults: PropTypes.func
};

const mapStateToProps = state => ({
  results: state.collection.getIn(["results"]),
  depositGroups: state.auth.getIn(["currentUser", "depositGroups"]),
  schema_data: state.collection.get("schema_data"),
  loading: state.collection.get("loading"),
  error: state.collection.get("error")
});

const mapDispatchToProps = dispatch => ({
  fetchRecordsResults: (name, version) =>
    dispatch(fetchRecordsResults(name, version))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Collection);
