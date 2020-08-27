import React, { useCallback, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { FlexibleWidthXYPlot, VerticalRectSeries, Hint } from "react-vis";

const BarChart = ({ data, highlight, domain, updateLocationOnClick }) => {
  const [hovered, setHovered] = useState(null);

  // calculate the range only when the domain is changing
  const calculateRange = useMemo(
    () => {
      return domain[1] - domain[0];
    },
    [domain]
  );

  // create a const to normalize the width of the bars
  const WIDTH_TRESHOLD = 0.5;

  // if the diff between in domain is less than 5 then do not display the Bar chart
  if (calculateRange < 5) {
    return null;
  }

  const getDataForRect = () => {
    return Object.keys(data).map(item => {
      return {
        x: Number(item) + WIDTH_TRESHOLD,
        x0: Number(item) - WIDTH_TRESHOLD,
        y: data[item],
        color:
          Number(item) >= highlight[0] && Number(item) <= highlight[1]
            ? "rgb(69,150,207)"
            : "rgb(206,206,206)"
      };
    });
  };

  const RECT_DATA = useMemo(() => getDataForRect(), [data]);
  const onMouseOver = useCallback(bar => setHovered(bar), []);
  const onMouseOut = useCallback(() => setHovered(null), []);
  const valueClick = useCallback(item => {
    const date = item.x0 + WIDTH_TRESHOLD;
    updateLocationOnClick(date);
  }, []);


  return (
    <div style={{ position: "relative" }} className="search-plot">
      <FlexibleWidthXYPlot
        height={100}
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {hovered && (
          <Hint
            style={{
              background: "#fff",
              padding: "4px 5px",
              color: "#000",
              width: "fit-content",
              zIndex: 10,
              boxShadow: "1px 1px 10px -6px rgba(0,0,0,0.75)",
              borderRadius: "3px"
            }}
            value={hovered}
            align={{ vertical: "bottom" }}
            format={({ y, x0 }) => {
              const year = x0 + WIDTH_TRESHOLD;
              return [
                {
                  title: "Number of Results",
                  value: y
                },

                { title: "Year", value: year }
              ];
            }}
          />
        )}

        <VerticalRectSeries
          data={RECT_DATA}
          style={{ stroke: "#fff" }}
          colorType="literal"
          onValueMouseOver={onMouseOver}
          onValueMouseOut={onMouseOut}
          onValueClick={valueClick}
        />
      </FlexibleWidthXYPlot>
    </div>
  );
};

BarChart.propTypes = {
  data: PropTypes.object,
  highlight: PropTypes.array,
  domain: PropTypes.array,
  updateLocationOnClick: PropTypes.func,
  total: PropTypes.number
};

export default BarChart;
