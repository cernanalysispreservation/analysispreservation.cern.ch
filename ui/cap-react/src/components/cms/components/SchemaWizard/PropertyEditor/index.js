import React from "react";

import Box from "grommet/components/Box";

import { PropTypes } from "prop-types";
import CustomizeField from "../../../containers/CustomizeField";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { Heading } from "grommet";
import ActionHeaderBox from "./ActionHeaderBox";
import DeleteModal from "./DeletePropertyModal";
import EditableField from "../../../../partials/EditableField";

const renderPath = (pathToUpdate, rename) => {
  let prev;
  let content;
  let result = [];

  let path = pathToUpdate.getIn(["path"]).toJS();

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
          <div
            style={{
              border: "1px solid #000",
              borderRadius: "2px",
              float: "left",
              padding: "5px 10px",
              marginRight: "5px",
              backgroundColor: "#fff"
            }}
          >
            <span>{content}</span>
          </div>
        );
    });

  if (prev)
    result.push(
      <div
        style={{
          border: "1px solid #fff",
          borderRadius: "2px",
          float: "left",
          backgroundColor: "#007298",
          padding: "1px 3px",
          marginRight: "5px",
          color: "#fff"
        }}
      >
        <EditableField
          hoverTitle
          value={prev}
          emptyValue={prev}
          onUpdate={value => rename(pathToUpdate.toJS(), value)}
          iconsColor="#fff"
        />
      </div>
    );
  return result;
};

class PropertyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeleteLayer: false
    };
  }
  render() {
    return (
      <Box style={{ gridColumn: "1/3" }} flex colorIndex="grey-2" pad="small">
        <DeleteModal
          show={this.state.showDeleteLayer}
          text={this.props.path
            .toJS()
            .path.filter(item => item != "properties" && item != "items")
            .map(item => item)
            .join(" > ")}
          onClose={() => this.setState({ showDeleteLayer: false })}
          onDelete={() => {
            this.props.deleteByPath(this.props.path.toJS());
            this.setState({ showDeleteLayer: false });
          }}
        />
        <Box margin={{ bottom: "small" }} direction="row" justify="between">
          <ActionHeaderBox
            onClick={this.props.enableCreateMode}
            text="add new"
            icon={<AiOutlinePlus size={25} />}
          />
          <ActionHeaderBox
            icon={<AiOutlineDelete size={25} />}
            text="delete"
            type="delete"
            onClick={() => this.setState({ showDeleteLayer: true })}
          />
        </Box>
        <Box
          margin={{ bottom: "small" }}
          colorIndex="light-2"
          style={{ borderRadius: "5px" }}
        >
          <Box pad="small" separator="bottom">
            <Heading tag="h3" margin="none">
              Selected field
            </Heading>
          </Box>
          <Box direction="row" responsive={false} wrap pad="small">
            {renderPath(this.props.path, this.props.renameId)}
          </Box>
        </Box>
        <Box flex={true}>
          <CustomizeField
            path={this.props.path}
            cancel={this.props.cancel}
            key="customize"
          />
        </Box>
      </Box>
    );
  }
}

PropertyEditor.propTypes = {
  cancel: PropTypes.func,
  onFormSchemaChange: PropTypes.func,
  enableCreateMode: PropTypes.func,
  // field: PropTypes.object,
  path: PropTypes.array,
  deleteByPath: PropTypes.func,
  renameId: PropTypes.func
};

export default PropertyEditor;
