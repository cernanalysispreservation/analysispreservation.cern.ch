import PropTypes from "prop-types";
import { connect } from "react-redux";

const ErrorFieldIndicator = ({ id, children, formErrors }) => {
  const isFieldWithError = formErrors.some(item => item.startsWith(id));
  if (!isFieldWithError) return children;
  return <div style={{ border: "1px solid #ffccc7" }}>{children}</div>;
};

ErrorFieldIndicator.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  formErrors: PropTypes.object
};

const mapStateToProps = state => ({
  formErrors: state.draftItem.get("formErrors")
});

export default connect(
  mapStateToProps,
  null
)(ErrorFieldIndicator);
