import React from "react";
import PropTypes from "prop-types";
import { PageHeader, Tag } from "antd";
import EditableField from "../../partials/EditableField";
const renderPath = (pathToUpdate, rename) => {
  let prev;
  let content;
  let result = [];

  let path = pathToUpdate.getIn(["path"]).toJS();
  console.log("====================================");
  console.log(path);
  console.log("====================================");
  path &&
    path.map(item => {
      if (result.length == 0) {
        if (item == "properties") content = "{ } root";
        else if (item == "items") content = "[ ] root";
      } else {
        if (item == "properties") {
          content = `{ } ${prev || ""}`;
          prev = null;
        } else if (item == "items") {
          content = `[ ] ${prev || ""}`;
          prev = null;
        } else prev = item;
      }

      if (!prev)
        result.push(
          <Tag
            text={content}
            size="large"
            margin="0 5px 5px 0"
            color={{
              bgcolor: "#fff",
              border: "rgba(0,0,0,0.5)",
              color: "rgba(0,0,0,1)"
            }}
          />
        );
    });

  if (prev)
    result.push(
      <Tag
        margin="0 5px 5px 0"
        color={{
          bgcolor: "#007298",
          border: "#007298",
          color: "#fff"
        }}
        maxWidth="100%"
        text={
          <EditableField
            hoverTitle
            value={prev}
            emptyValue={prev}
            onUpdate={value => rename(pathToUpdate.toJS(), value)}
          />
        }
      />
    );
  return result;
};
const PropertyEditor = ({ path, renameId, enableCreateMode }) => {
  renderPath(path, renameId);

  return (
    <React.Fragment>
      <PageHeader onBack={enableCreateMode} title={"ljhfdjhjfdhjh"} />
    </React.Fragment>
  );
};

PropertyEditor.propTypes = {};

export default PropertyEditor;
