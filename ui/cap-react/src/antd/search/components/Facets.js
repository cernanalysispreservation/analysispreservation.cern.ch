import React from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import { Empty, Radio, Row, Space, Switch, Typography } from "antd";
import Facet from "./Facet";
import FacetsLoading from "../Loaders/Facets";

const Facets = ({
  aggs,
  selectedAggs,
  removeType,
  history,
  loading,
  match,
  pathname,
  results
}) => {
  const constructFacets = aggs => {
    let facets = {};
    let keys = Object.keys(aggs).filter(key => {
      return typeof aggs[key] === "object";
    });
    for (let key of keys) {
      let obj = {};
      if (key.startsWith("facet_")) {
        obj[key.replace("facet_", "")] =
          "filtered" in aggs[key] ? aggs[key]["filtered"] : aggs[key];
      } else {
        obj = constructFacets(aggs[key]);
      }
      Object.assign(facets, obj);
    }

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
      )}`
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
      search: `${queryString.stringify(currentParams)}`
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
        search: queryString.stringify(currentParams)
      };
    }

    history.push(newLocation);
  };

  let facets_result = null;

  if (aggs) {
    let facets = constructFacets(aggs);

    if (removeType) {
      delete facets.collection;
    }

    // Get and sort by order aggregations
    let categories = [];
    for (let key in facets) {
      categories.push([
        key,
        facets[key].meta && facets[key].meta.order
          ? facets[key].meta.order
          : 9999
      ]);
    }
    categories.sort((a, b) => a[1] - b[1]);
    categories = categories.map(c => c[0]);

    facets_result = categories.map(category => {
      return (
        facets[category].buckets.length > 0 && (
          <Facet
            category={category}
            facets={facets}
            isAggSelected={isAggSelected}
            selectedAggs={selectedAggs}
            onChange={_onChange}
          />
        )
      );
    });
  }

  if (loading) {
    return <FacetsLoading />;
  }

  return (
    <Space style={{ width: "100%" }} direction="vertical" size="large">
      <Row
        justify="space-between"
        style={{ background: "#fff", padding: "10px" }}
      >
        <Space direction="vertical">
          <Typography.Title level={5}>Search for:</Typography.Title>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            value={pathname.startsWith("/search") ? "published" : "drafts"}
            onChange={() => updateCategory()}
          >
            <Radio.Button value="published">Published</Radio.Button>
            <Radio.Button value="drafts">Drafts</Radio.Button>
          </Radio.Group>
        </Space>
        <Space direction="vertical">
          <Typography.Title level={5}>Created by: </Typography.Title>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            value={
              "by_me" in queryString.parse(location.search) ? "yours" : "all"
            }
            onChange={() => _filter_by_yours()}
          >
            <Radio.Button value="yours">You</Radio.Button>
            <Radio.Button value="all">All team</Radio.Button>
          </Radio.Group>
        </Space>
      </Row>
      {results.getIn(["hits", "total"]) > 0 ? (
        <Row
          justify="space-between"
          style={{ background: "#fff", padding: "10px" }}
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
  results: PropTypes.object
};

export default withRouter(Facets);
