import PropTypes from "prop-types";
import { DatePicker } from "antd";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
const { RangePicker } = DatePicker;

const RangeDate = ({ category, history }) => {
  const onChange = (dateRange) => {
    let params = queryString.parse(history.location.search);

    const location = {
      search: `${queryString.stringify(
        Object.assign(params, {
          [category]: `${dateRange[0]}--${dateRange[1]}`,
        })
      )}`,
    };

    history.push(location);
  };

  return <RangePicker onChange={(_d, ds) => (ds ? onChange(ds) : null)} />;
};

RangeDate.propTypes = {
  items: PropTypes.object,
  category: PropTypes.string,
  history: PropTypes.object,
};

export default withRouter(RangeDate);
