import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import Results from "../containers/Results";
import DocumentTitle from "../../partials/DocumentTitle";
import { Col, Pagination, Row, Grid, Drawer } from "antd";
import Facets from "../containers/Facets";
import ResultsHeader from "./Header";
import { withRouter } from "react-router-dom";
import Tags from "./Tags";

const Search = ({
  fetchSearch,
  match = { params: {} },
  history,
  results,
  selectedAggs,
}) => {
  useEffect(() => {
    fetchSearch(match);
  }, []);

  const _changePageSize = size => {
    let currentParams = queryString.parse(history.location.search);

    const location = {
      search: `${queryString.stringify(
        Object.assign(currentParams, { size: size })
      )}`,
    };

    history.push(location);
    fetchSearch(match);
  };

  const _updateParams = (parent, child) => {
    let currentParams = queryString.parse(history.location.search);

    if (Array.isArray(currentParams[parent])) {
      currentParams[parent] = currentParams[parent].filter(
        item => item != child
      );
    } else {
      delete currentParams[parent];
    }

    const location = {
      search: queryString.stringify(currentParams),
    };

    history.push(location);
  };

  const _updateSortOption = sort => {
    let currentParams = queryString.parse(history.location.search);

    const location = {
      search: `${queryString.stringify(
        Object.assign(currentParams, { sort: sort })
      )}`,
    };
    history.push(location);
  };

  const _updateSearchQuery = (param, item) => {
    let currentParams = queryString.parse(location.search);
    if (param === "query") {
      currentParams["q"] = "";
    } else {
      if (Array.isArray(currentParams[param])) {
        currentParams[param] = currentParams[param].filter(i => i != item);
      } else {
        delete currentParams[param];
      }
    }
    const location = {
      search: queryString.stringify(currentParams),
    };
    history.push(location);
  };

  const _changePage = (page, size) => {
    let currentParams = queryString.parse(history.location.search);

    const location = {
      search: `${queryString.stringify(
        Object.assign(currentParams, { page: page, size: size })
      )}`,
    };
    history.push(location);
  };

  const clearFilters = () => {
    const location = {
      search: null,
    };
    history.push(location);
  };

  const [displayFilters, setDisplayFilters] = useState(false);

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return (
    <DocumentTitle title="Search">
      <Row style={{ marginTop: "15px", padding: "10px" }}>
        {!screens.lg ? (
          <Drawer
            title="Filters"
            placement="left"
            onClose={() => setDisplayFilters(false)}
            open={displayFilters}
            contentWrapperStyle={{ width: !screens.sm ? "80%" : "50%" }}
          >
            <Facets
              removeType={match.params && match.params.anatype}
              results={results}
              aggs={results.get("aggregations")}
            />
          </Drawer>
        ) : (
          <Col offset={1} lg={6} xl={5}>
            <Facets
              removeType={match.params && match.params.anatype}
              results={results}
              aggs={results.get("aggregations")}
            />
          </Col>
        )}
        <Col
          xxl={{ span: 12, offset: 1 }}
          xl={{ span: 16, offset: 1 }}
          lg={{ span: 16, offset: 1 }}
          xs={{ span: 22, offset: 1 }}
        >
          <ResultsHeader
            location={location}
            results={results}
            onChange={sort => _updateSortOption(sort)}
            shouldDisplayFacetButton={!screens.lg}
            updateDisplayFacet={() => setDisplayFilters(true)}
          />
          <Tags
            clearFilter={() => clearFilters()}
            params={
              history.location && queryString.parse(history.location.search)
            }
            anatype={match.params && match.params.anatype}
            removeAnatype={() => {
              history.push(`/search${history.location.search}`);
            }}
            onClick={_updateParams}
            removeQuery={_updateSearchQuery}
          />
          <Results results={results.getIn(["hits", "hits"]) || []} />
          {results.getIn(["hits", "total"]) > 10 && (
            <Row justify="center">
              <Pagination
                current={selectedAggs.page ? Number(selectedAggs.page) : 1}
                total={results.getIn(["hits", "total"])}
                onShowSizeChange={_changePageSize}
                onChange={_changePage}
                showSizeChanger
                pageSize={selectedAggs.size ? Number(selectedAggs.size) : 10}
              />
            </Row>
          )}
        </Col>
      </Row>
    </DocumentTitle>
  );
};

Search.propTypes = {
  fetchSearch: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
  results: PropTypes.object,
  selectedAggs: PropTypes.object,
};

export default withRouter(Search);
