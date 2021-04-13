import React, { useState, useMemo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Slider, Handles, Tracks, Rail } from "react-compound-slider";
import Handle from "./Handles";
import Track from "./Track";

import BarChart from "./BarChart";
import { withRouter } from "react-router-dom";
import queryString from "query-string";

import Box from "grommet/components/Box";
import CheckBox from "grommet/components/CheckBox";

const RangeSlider = props => {
  const sliderStyle = {
    position: "relative",
    width: "100%",
    height: 80
  };

  const railStyle = {
    position: "absolute",
    width: "100%",
    height: 5,
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: "rgb(206,206,206)"
  };

  // get Total number of Records
  // frequency of data
  // and range from the buckets
  const { total, barChartData, range, displaySlider } = useMemo(
    () => {
      let total = 0;
      let barChartData = {};
      let range = [];

      props.item.get("buckets").map(item => {
        barChartData[item.get("key_as_string")] = item.get("doc_count");
        total += item.get("doc_count");
        range.push(new Date(item.get("key")).getFullYear());
      });

      let displaySlider = range.length > 1;

      return { total, barChartData, range, displaySlider };
    },
    [props.item]
  );

  // calculate the default init values every time that the page is visited
  // 1. if there are URL params then apply those values as default
  // 2. if not then get the range from the props.items
  const defaultArray = useMemo(
    () => {
      let values =
        queryString.parse(props.location.search)[props.category] &&
        queryString.parse(props.location.search)[props.category].split("--");
      let rangeArray = [range[0], range[range.length - 1]];
      if (values && displaySlider) {
        let rangeFromValues = values.map(item => Number(item));
        rangeArray = rangeFromValues;
      }
      return rangeArray;
    },
    [props.location]
  );

  // Before rendering
  // If there are URL params values, check whether there are out of range
  // if yes then update the URL params with the range
  useEffect(() => {
    let values =
      queryString.parse(props.location.search)[props.category] &&
      queryString.parse(props.location.search)[props.category].split("--");
    let rangeArray = [range[0], range[range.length - 1]];
    if (values && displaySlider) {
      let rangeFromValues = values.map(item => Number(item));
      if (
        rangeFromValues[0] < rangeArray[0] ||
        rangeFromValues[rangeFromValues.length - 1] > rangeArray[1]
      ) {
        let currentParams = queryString.parse(props.location.search);
        currentParams[props.category] = rangeArray.join("--");
        props.history.replace({
          search: `${queryString.stringify(currentParams)}`
        });
      }
    }
  }, []);

  // keep track of the updated values and the default ones
  // this will help to identify if an update to the URL params is needed
  const [update, setUpdate] = useState(defaultArray);
  const [calculateValues] = useState(defaultArray);

  // Display the reset box
  // 1. check whether the category exists in the url params
  // if no hide, if yes display
  // 2. When click remove the category from the url params

  const shouldDisplayResetButton = useMemo(
    () => {
      return (
        queryString.parse(props.location.search)[props.category] !== undefined
      );
    },
    [props.location]
  );

  // Remove the Category from url params
  // Update the history object
  const removeCategoryFromUrlParams = useCallback(() => {
    let params = queryString.parse(props.location.search);
    delete params[props.category];

    props.history.replace({
      search: `${queryString.stringify(params)}`
    });
  }, []);

  // Update the URL params
  // 1. Get the updated values from the Slider
  // if these values are the same with the default then do nothing
  // if not then update history
  // 2. if the updated values are the same (e.x 2017) AND the default values are not then update
  useEffect(
    () => {
      let sameDateValue = false;
      if (update[0] === update[1]) {
        sameDateValue = calculateValues.includes(update[0]);
      }
      let diff = update.filter(item => !calculateValues.includes(item));

      if (
        diff.length > 0 ||
        (sameDateValue && calculateValues[0] !== calculateValues[1])
      ) {
        let currentParams = queryString.parse(props.location.search);
        currentParams[props.category] = update.join("--");
        props.history.replace({
          search: `${queryString.stringify(currentParams)}`
        });
      }
    },
    [update]
  );

  // trigger URL params update only when the updated values are different from the current default
  const updateUrlParamsFromSlider = useCallback(values => {
    if (values !== calculateValues) {
      setUpdate(values);
    }
  }, []);

  // update the URL values when the bar is clicked
  const updateUrlParamsOnBarClick = date => {
    let currentParams = queryString.parse(props.location.search);
    currentParams[props.category] = `${date}--${date}`;
    props.history.replace({
      search: `${queryString.stringify(currentParams)}`
    });
  };

  // when there is only one date
  const updateSingleFacetRange = useCallback(() => {
    let currentParams = queryString.parse(props.location.search);

    if (currentParams[props.category]) {
      let params = currentParams[props.category].split("--");
      if (Number(params[0]) !== range[0] || Number(params[1]) !== range[0]) {
        currentParams[props.category] = `${range[0]}--${range[0]}`;
      } else delete currentParams[props.category];
    } else {
      currentParams[props.category] = `${range[0]}--${range[0]}`;
    }

    props.history.replace({
      search: `${queryString.stringify(currentParams)}`
    });
  }, []);

  const isCheckedFacetRange = useMemo(
    () => {
      if (
        queryString.parse(props.location.search)[props.category] &&
        !displaySlider
      ) {
        let params = queryString
          .parse(props.location.search)
          [props.category].split("--");

        // make sure that the selected dates are the ones that are in range
        return Number(params[0]) === range[0] && Number(params[1]) === range[0];
      }

      return false;
    },
    [queryString.parse(props.location.search)[props.category]]
  );

  const getContentByRange = (display, range) => {
    const choices = {
      true: (
        <Box>
          <Slider
            rootStyle={sliderStyle}
            domain={[range[0], range[range.length - 1]]}
            values={calculateValues}
            step={1}
            mode={1}
            onChange={updateUrlParamsFromSlider}
          >
            <Rail>
              {({ getRailProps }) => (
                <div style={railStyle} {...getRailProps()} />
              )}
            </Rail>

            <Handles>
              {({ handles, getHandleProps }) => (
                <div>
                  {handles.map(handle => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      getHandleProps={getHandleProps}
                    />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks right={false} left={false}>
              {({ tracks, getTrackProps }) => (
                <div>
                  {tracks.map(({ id, source, target }) => (
                    <Track
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                    />
                  ))}
                </div>
              )}
            </Tracks>
          </Slider>
          {shouldDisplayResetButton && (
            <Box
              align="end"
              onClick={removeCategoryFromUrlParams}
              style={{ margin: "5px 0", color: "rgb(40,105,146)" }}
            >
              reset
            </Box>
          )}
        </Box>
      ),
      false: (
        <Box
          size="medium"
          direction="row"
          align="center"
          style={{
            fontSize: "0.8em",
            margin: "5px 0"
          }}
        >
          <CheckBox
            label={range[0]}
            checked={isCheckedFacetRange}
            onChange={updateSingleFacetRange}
          />
        </Box>
      )
    };

    return choices[display];
  };

  return (
    <div>
      <BarChart
        domain={[range[0], range[range.length - 1]]}
        highlight={calculateValues}
        data={barChartData}
        total={total}
        updateLocationOnClick={updateUrlParamsOnBarClick}
      />

      {getContentByRange(displaySlider, range)}
    </div>
  );
};

RangeSlider.propTypes = {
  item: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  category: PropTypes.string
};

export default withRouter(RangeSlider);
