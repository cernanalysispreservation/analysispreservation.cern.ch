import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import List from "grommet/components/List";
import Box from "grommet/components/Box";
import ListItem from "grommet/components/ListItem";
import Tag from "../../../partials/Tag";

import Button from "../../../partials/Button";

import { connect } from "react-redux";
import { handlePermissions } from "../../../../actions/draftItem";
import { Paragraph } from "grommet";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteModal from "./DeleteModal";
import PermissionPopUp from "./PermissionPopUp";

const PermissionTable = ({
  users,
  addPermissionsModal = false,
  handlePermissions,
  draft_id,
  created_by,
  permissionsObj,
  target,
  access,
  canAdmin,
  displayAsFormField = false,
  updateField = null
}) => {
  const [currentPermissionObj, setCurrentPermissionObj] = useState({});
  const [updated, setUpdated] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null);

  const getTextFromPermission = perm => {
    let permission = "deposit-read";
    if (perm.includes("deposit-update")) permission = "deposit-update";
    if (perm.includes("deposit-admin")) permission = "deposit-admin";
    const choices = {
      "deposit-read": "Role: read",
      "deposit-update": "Role: write",
      "deposit-admin": "Role: admin"
    };

    return choices[permission];
  };

  useEffect(() => {
    setCurrentPermissionObj(permissionsObj);
  }, []);

  useEffect(
    () => {
      if (updated.list) {
        setCurrentPermissionObj(permissionsObj);
      }
    },
    [updated]
  );

  return (
    <Box>
      <List style={{ overflow: "visible" }}>
        {addPermissionsModal
          ? Object.entries(currentPermissionObj).map((item, index) => (
              <ListItem
                justify="between"
                separator="bottom"
                key={index}
                responsive={false}
              >
                <Box direction="row" align="center" responsive={false}>
                  {item[0]}
                  <Box pad={{ horizontal: "small" }}>
                    <Tag text={`${target}`} size="small" />
                  </Box>
                </Box>

                <Box
                  style={{ overflow: "visible" }}
                  direction="row"
                  align="center"
                  responsive={false}
                >
                  {!displayAsFormField && (
                    <Box style={{ position: "relative", overflow: "visible" }}>
                      <Tag
                        size="small"
                        text={
                          <PermissionPopUp
                            title={
                              access[item[0].toLocaleLowerCase()]
                                ? getTextFromPermission(
                                    access[item[0].toLowerCase()].actions
                                  )
                                : getTextFromPermission(item[1])
                            }
                            type={target}
                            email={item[0]}
                            permissions={item[1]}
                            hideMenu={Object.keys(access).includes(
                              item[0].toLowerCase()
                            )}
                            addPermissionsModal
                            updatePermissionsModalObj={list => {
                              permissionsObj[item[0]] = list;
                              setUpdated({ list });
                            }}
                          />
                        }
                      />
                    </Box>
                  )}
                  {Object.keys(access).includes(item[0].toLowerCase()) ? (
                    <Paragraph
                      margin="none"
                      style={{
                        color: "#007298",
                        height: "24px",
                        padding: "0 7px",
                        fontSize: "14px",
                        minWidth: "64px",
                        marginLeft: "5px",
                        textAlign: "center"
                      }}
                    >
                      Added
                    </Paragraph>
                  ) : (
                    <Button
                      text="Add"
                      margin="0 0 0 5px"
                      size="small"
                      primaryOutline
                      onClick={() =>
                        updateField
                          ? updateField(item[0])
                          : handlePermissions(
                              draft_id,
                              target,
                              item[0],
                              item[1],
                              "add"
                            )
                      }
                    />
                  )}
                </Box>
              </ListItem>
            ))
          : users.map((item, index) => (
              <ListItem
                justify="between"
                separator="bottom"
                responsive={false}
                key={index}
                className="permission-li-item"
              >
                <Box align="center" direction="row" responsive={false}>
                  {item}{" "}
                  <Box pad={{ horizontal: "small" }}>
                    <Tag
                      text={
                        created_by && created_by.email === item
                          ? "owner"
                          : access[item].type
                      }
                      size="small"
                    />
                  </Box>
                </Box>

                <Box align="center" direction="row" responsive={false}>
                  <Box style={{ position: "relative" }}>
                    <Tag
                      size="small"
                      text={
                        <PermissionPopUp
                          title={getTextFromPermission(access[item].actions)}
                          type={access[item].type}
                          email={item}
                          permissions={access[item].actions}
                          hideMenu={!canAdmin}
                          isOwner={created_by && created_by.email === item}
                        />
                      }
                    />
                  </Box>
                  {canAdmin && (
                    <Button
                      icon={<AiOutlineDelete />}
                      size="iconSmall"
                      criticalOutline
                      margin="0 0 0 5px"
                      disabled={created_by && created_by.email === item}
                      onClick={() => setItemToDelete(item)}
                    />
                  )}
                </Box>
              </ListItem>
            ))}
      </List>
      <DeleteModal
        open={itemToDelete}
        onClose={() => setItemToDelete(null)}
        onDelete={() => {
          handlePermissions(
            draft_id,
            access[itemToDelete].type,
            itemToDelete,
            access[itemToDelete].actions,
            "remove"
          );
          setItemToDelete(null);
        }}
      />
    </Box>
  );
};

PermissionTable.propTypes = {
  users: PropTypes.array,
  addPermissionsModal: PropTypes.bool,
  handlePermissions: PropTypes.func,
  draft_id: PropTypes.string,
  created_by: PropTypes.object,
  permissionsObj: PropTypes.object,
  target: PropTypes.string,
  access: PropTypes.object,
  permissions: PropTypes.object,
  canAdmin: PropTypes.bool
};

const mapStateToProps = state => ({
  draft_id: state.draftItem.get("id"),
  created_by: state.draftItem.get("created_by"),
  draft: state.draftItem.get("data"),
  loading: state.draftItem.get("loading"),
  canAdmin: state.draftItem.get("can_admin"),
  permissions: state.draftItem.get("access")
});

function mapDispatchToProps(dispatch) {
  return {
    handlePermissions: (draft_id, type, email, action, operation) =>
      dispatch(handlePermissions(draft_id, type, email, action, operation))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionTable);
