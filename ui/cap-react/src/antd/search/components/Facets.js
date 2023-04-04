import React, { useState } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import {
  Empty,
  Col,
  Divider,
  Modal,
  Row,
  Space,
  Switch,
  Typography,
} from "antd";
import Facet from "./Facet";
import FacetsLoading from "../Loaders/Facets";
import HowToSearchPage from "../../partials/HowToSearch";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Map } from "immutable";

const Facets = ({
  aggs,
  selectedAggs,
  removeType,
  history,
  loading,
  match,
  pathname,
  results,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const constructFacets = aggs => {
    let facets = Map({});
    aggs &&
      aggs.mapEntries(item => {
        if (!Map.isMap(item[1])) return;
        let obj = Map({});
        if (item[0].startsWith("facet_")) {
          let newItem = item[1].has("filtered")
            ? item[1].get("filtered")
            : item[1];
          obj = obj.set(item[0].replace("facet_", ""), newItem);
        } else {
          obj = constructFacets(item[1]);
        }

        facets = facets.merge(obj);
      });

    return facets;
  };

  const _onChange = (category, event) => {
    const name = event.target ? event.target.name : null;
    let currentParams = queryString.parse(history.location.search);

    _toggleAggs(category, name, currentParams);
  };

  const _toggleAggs = (category, name, selectedAggregations) => {
    let _selectedAggregations = Object.assign({}, selectedAggregations);

    if (!_selectedAggregations[category]) {
      _selectedAggregations[category] = [];
    }

    if (typeof _selectedAggregations[category] == "string")
      _selectedAggregations[category] = [_selectedAggregations[category]];

    let index = _selectedAggregations[category].indexOf(name);

    if (index == -1) _selectedAggregations[category].push(name);
    else _selectedAggregations[category].splice(index, 1);

    updateHistory(_selectedAggregations, category);
  };

  const updateHistory = (selectedAggs, category) => {
    let facet = constructFacets(aggs);
    let catType;
    if (facet[category]) {
      let temp = Object.keys(facet[category].buckets[0]).filter(name =>
        name.startsWith("facet_")
      );
      temp.length ? (catType = temp[0].replace("facet_", "")) : null;
    }

    // remove nested filters if the parent is unchecked
    let eligibleItems = [];

    if (facet[category] && facet[category].buckets) {
      selectedAggs[category].map(item => {
        facet[category].buckets.map(bucket => {
          if (item === bucket.key) {
            let bucketListName = Object.keys(bucket).filter(b =>
              b.startsWith("facet_")
            );
            if (bucket[bucketListName[0]]) {
              bucket[bucketListName[0]].buckets.map(bucket_item =>
                eligibleItems.push(bucket_item.key)
              );
            }
          }
        });
      });

      let intersect = [];

      if (selectedAggs[catType]) {
        intersect = eligibleItems.filter(item =>
          selectedAggs[catType].includes(item)
        );
        selectedAggs[catType] = intersect;
      }
    }

    let currentParams = queryString.parse(history.location.search);
    "page" in selectedAggs ? delete selectedAggs["page"] : null;
    "page" in currentParams ? delete currentParams["page"] : null;

    const location = {
      search: `${queryString.stringify(
        Object.assign(currentParams, selectedAggs)
      )}`,
    };

    history.push(location);
  };

  const isAggSelected = (selected, value) => {
    if (selected) {
      if (selected.constructor === Array) {
        return selected.indexOf(value) > -1;
      } else {
        return selected === value;
      }
    }

    return false;
  };

  const _filter_by_yours = () => {
    let currentParams = queryString.parse(history.location.search);

    if ("by_me" in currentParams) {
      delete currentParams["by_me"];
    } else {
      currentParams["by_me"] = "True";
    }

    history.replace({
      search: `${queryString.stringify(currentParams)}`,
    });
  };
  const updateCategory = () => {
    let newLocation = history.location;

    let anatype = match.params.anatype;

    newLocation.pathname = pathname.startsWith("/search")
      ? "/drafts"
      : "/search";

    // if the anatype exists means that the user needs a specific type of analysis
    // in the event that the user wants to search through the drafts, the type should be maintained
    if (anatype) {
      let currentParams = queryString.parse(history.location.search);
      currentParams["collection"] = anatype;
      newLocation = {
        search: queryString.stringify(currentParams),
      };
    }

    history.push(newLocation);
  };

  let facets_result = null;

  if (aggs) {
    let facet = constructFacets(aggs);

    if (removeType) {
      facet = facet.delete("collection");
    }

    // Get and sort by order aggregations
    let categories = [];
    facet.mapEntries(item => {
      categories.push([
        item[0],
        item[1],
        item[1].hasIn(["meta", "order"])
          ? item[1].getIn(["meta", "order"])
          : 9999,
      ]);
    });
    categories.sort((a, b) => a[2] - b[2]);
    categories = categories.map(c => [c[0], c[1]]);

    facets_result = categories.map(item => {
      if (item[1].get("buckets").size > 0)
        return (
          <Facet
            category={item[0]}
            facet={facet}
            isAggSelected={isAggSelected}
            selectedAggs={selectedAggs}
            onChange={_onChange}
          />
        );
    });
  }

  if (loading) {
    return <FacetsLoading />;
  }

  let searchIn =
    history.location &&
    history.location.pathname &&
    history.location.pathname.startsWith("/search")
      ? "published"
      : "drafts";
  let searchParams = queryString.parse(history.location.search);

  return (
    <Space style={{ width: "100%" }} direction="vertical" size="large">
      <Modal
        open={showHelp}
        onCancel={() => setShowHelp(false)}
        background="#f5f5f5"
        title="How to Search"
        footer={null}
        width={950}
      >
        <HowToSearchPage />
      </Modal>
      <Row
        justify="space-between"
        style={{ background: "#fff", padding: "10px" }}
      >
        <Col
          span={24}
          direction="row"
          style={{ padding: "10px" }}
          align="center"
          justify="center"
        >
          <a
            style={{ textDecoration: "underline" }}
            onClick={() => setShowHelp(!showHelp)}
          >
            Check tips on how to search <QuestionCircleOutlined />
          </a>
          <Divider style={{ margin: "10px" }} />
        </Col>
        <Col span={24} direction="row" style={{ padding: "10px" }}>
          <Space align="center">
            <Typography.Title level={5} style={{ margin: "0" }}>
              Status:
            </Typography.Title>
            <Switch
              data-cy="searchStatus"
              checked={searchIn == "drafts"}
              onChange={updateCategory}
              unCheckedChildren="Published"
              checkedChildren="Drafts"
            />
          </Space>
        </Col>
        <Col span={24} direction="row" style={{ padding: "10px" }}>
          <Space align="center">
            <Typography.Title level={5} style={{ margin: "0" }}>
              Created by:
            </Typography.Title>
            <Switch
              data-cy="searchCreated"
              checked={searchParams.by_me}
              onChange={_filter_by_yours}
              unCheckedChildren="All"
              checkedChildren="You"
            />
          </Space>
        </Col>
      </Row>
      {results.getIn(["hits", "total"]) > 0 ? (
        <Row
          justify="space-between"
          style={{ background: "#fff", padding: "20px" }}
        >
          {facets_result}
        </Row>
      ) : (
        <Row justify="center" style={{ background: "#fff", padding: "10px" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No more facets available for your results"
          />
        </Row>
      )}
    </Space>
  );
};

Facets.propTypes = {
  aggs: PropTypes.object,
  selectedAggs: PropTypes.object,
  removeType: PropTypes.string,
  history: PropTypes.object,
  loading: PropTypes.bool,
  match: PropTypes.object,
  pathname: PropTypes.string,
  results: PropTypes.object,
};

export default withRouter(Facets);
