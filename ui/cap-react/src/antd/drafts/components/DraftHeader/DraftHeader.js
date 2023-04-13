import PropTypes from "prop-types";
import { Button, Tag, Grid, Row, Space } from "antd";
import { canEdit } from "../../utils/permissions";
import {
  ArrowLeftOutlined,
  FolderOutlined,
  MenuOutlined
} from "@ant-design/icons";
import EditableField from "../../../partials/EditableField";

const DraftHeader = ({
  metadata = { general_title: "Untitled" },
  location = { from: "/" },
  canAdmin,
  canUpdate,
  pushPath,
  openMenuDrawer,
  openFileDrawer,
  updateGeneralTitle
}) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return (
    <Row
      justify="space-between"
      style={{ height: !screens.lg ? "fit-content" : "60px", padding: "10px" }}
    >
      <Space size="middle">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => pushPath(location.from)}
        />
        <EditableField
          dataCy="EditableTitle"
          isEditable={canEdit(canAdmin, canUpdate)}
          text={metadata.general_title}
          onUpdate={newText =>
            newText.trim() != "" && updateGeneralTitle(newText)
          }
        />
        {!canEdit(canAdmin, canUpdate) && <Tag color="gold">READ ONLY</Tag>}
      </Space>
      <Space size="middle">
        {!screens.lg && (
          <Button
            key="menu"
            type="primary"
            icon={<MenuOutlined />}
            onClick={openMenuDrawer}
          >
            Menu
          </Button>
        )}
        {!screens.xxl && (
          <Button
            key="files"
            icon={<FolderOutlined />}
            type="primary"
            onClick={openFileDrawer}
          >
            Files
          </Button>
        )}
      </Space>
    </Row>
  );
};

DraftHeader.propTypes = {
  metadata: PropTypes.object,
  location: PropTypes.object,
  canAdmin: PropTypes.bool,
  canUpdate: PropTypes.bool,
  showSideBar: PropTypes.bool,
  pushPath: PropTypes.func,
  openMenuDrawer: PropTypes.func,
  openFileDrawer: PropTypes.func,
  updateGeneralTitle: PropTypes.func
};

export default DraftHeader;
