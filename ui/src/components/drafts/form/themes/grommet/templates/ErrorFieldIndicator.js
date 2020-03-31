import React from "react";
import Box from "grommet/components/Box";
import PropTypes from "prop-types";

import { connect } from "react-redux";

const ErrorFieldIndicator = ({
  errors,
  children,
  id,
  hideIndicator = false,
  tab = false,
  formErrors,
  formContext
}) => {
  let errorList = [];
  let errorMessages = {};

  // If "rootId" is passed with the "formContext", replace "id" to be correct
  // for the nested form
  id =
    formContext && formContext.rootId
      ? id.replace("root", formContext.rootId)
      : id;
  // If there is an error that startsWith the "id", probably means that
  //  this is the parent of an erronous field
  let isCurrentErrored = formErrors.some(error => error.startsWith(id));

  if (!isCurrentErrored || hideIndicator) return children;

  let styles = {};
  if (tab) styles["borderRight"] = "2px solid #f04b37";
  else styles["borderLeft"] = "1px solid #f04b37";

  return (
    <Box flex={!tab} style={styles}>
      {children}
    </Box>
  );
  // `${id} -> ${JSON.stringify(formErrors)}`,

  // console.log("INDICATORRRR:: ", id, formErrors.toJS(), )
  // if (tab) {
  //   errors &&
  //     errors.map(errorItem => {
  //       let item = errorItem.property.split(".")[1];
  //       // properties.map(prop => {
  //         if (prop.name === item && !errorList.includes(item)) {
  //           errorList.push(item);
  //         }
  //       });
  //     });

  //   return (
  //     <Box
  //       style={{
  //         borderRight: errorList.includes(id) ? "1px solid #f04b37" : null
  //       }}
  //     >
  //       {children}
  //     </Box>
  //   );
  // } else {
  //   // id = id.replace("root", "").replace("_path", "");

  //   errors &&
  //     errors.map(item => {
  //       let property = item.property
  //         .replace(/\[/g, "_")
  //         .replace(/\]/g, "")
  //         .replace(/\./g, "_");

  //       if (!errorList.includes(property)) {
  //         if (item.message) {
  //           errorMessages[property] = item.message;
  //         }
  //         errorList.push(property);
  //       }
  //     });
  // }

  // return (
  //   <Box
  //     flex={!tab}
  //     style={{
  //       borderLeft: hideIndicator
  //         ? null
  //         : errorList.includes(id)
  //           ? "1px solid #f04b37"
  //           : null
  //     }}
  //   >
  //     {children}

  //     {hideIndicator &&
  //       Object.entries(errorMessages).map(item => {
  //         if (item[0] === id) {
  //           return (
  //             <Box style={{ color: "#f04b37", margin: "1px 0 8px 4px" }}>
  //               ***{id}***
  //               {item[1]}
  //             </Box>
  //           );
  //         }
  //       })}
  //   </Box>
  // );
};

ErrorFieldIndicator.propTypes = {
  errors: PropTypes.array,
  id: PropTypes.string,
  children: PropTypes.element,
  tab: PropTypes.bool,
  hideIndicator: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    formErrors: state.draftItem.get("formErrors")
  };
}

export default connect(
  mapStateToProps,
  null
)(ErrorFieldIndicator);
