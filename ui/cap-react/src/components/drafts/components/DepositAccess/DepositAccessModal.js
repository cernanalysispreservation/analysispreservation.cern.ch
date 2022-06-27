import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "../../../partials/Modal";
import Button from "../../../partials/Button";
import PermissionTable from "./PermissionTable";
import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import TextInput from "grommet/components/TextInput";

import _debounce from "lodash/debounce";
import axios from "axios";
import { AiOutlineUser, AiOutlineCloudDownload } from "react-icons/ai";

const DepositAccessModal = ({
  open,
  onClose,
  access,
  displayAsFormField = false,
  updateField = null,
}) => {
  const [target, setTarget] = useState("user");
  const [permissionsObj, setPermissionsObj] = useState({});
  const [cernUsers, setCernUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState(undefined);

  const fetchLdapData = _debounce((url) => {
    setPermissionsObj({});
    setLoading(true);
    axios.get(url).then(({ data }) => {
      let perm = {};
      let c_perm = {};
      data.map((item) => {
        let objTarget = target === "user" ? item.email : item;
        perm[objTarget] = ["deposit-read"];
        c_perm[objTarget] = item;
      });
      setLoading(false);
      setPermissionsObj(perm);
      setCernUsers(c_perm);
    });
  }, 500);

  useEffect(() => {
    setPermissionsObj({});
    if (userInput && userInput != "") {
      fetchLdapData(`/api/services/ldap/${target}/mail?query=${userInput}`);
    }
  }, [userInput, target]);

  return (
    open && (
      <Modal
        onClose={() => {
          setPermissionsObj({});
          setUserInput(undefined);
          onClose();
        }}
        title="Add new members"
        separator
        overflowVisible
      >
        <Box pad="medium" size="xxlarge">
          <Box
            margin={{ bottom: "large" }}
            direction="row"
            align="center"
            style={{ position: "relative" }}
            responsive={false}
          >
            <Box direction="row" align="center" responsive={false}>
              <Paragraph margin="none">Search for:</Paragraph>
              <Button
                text="Users"
                size="small"
                primary={target === "user"}
                margin="0 5px"
                onClick={() => setTarget("user")}
              />
              <Button
                text="Egroups"
                size="small"
                margin="0 10px 0 0"
                primary={target === "egroup"}
                onClick={() => setTarget("egroup")}
              />
            </Box>
            <TextInput
              placeHolder={`Search ${target}`}
              onDOMChange={() => setUserInput(event.target.value)}
            />
          </Box>

          {loading ? (
            <Box pad="small" align="center">
              <Box
                colorIndex="light-2"
                align="center"
                pad="small"
                style={{ borderRadius: "50%" }}
              >
                <AiOutlineCloudDownload size={20} />
              </Box>
              <Paragraph>Loading...</Paragraph>
            </Box>
          ) : Object.keys(permissionsObj).length > 0 ? (
            <PermissionTable
              addPermissionsModal
              permissionsObj={displayAsFormField ? cernUsers : permissionsObj}
              target={target}
              access={access}
              displayAsFormField={displayAsFormField}
              updateField={updateField}
            />
          ) : (
            <Box pad="small" align="center">
              <Box
                colorIndex="light-2"
                align="center"
                pad="small"
                style={{ borderRadius: "50%" }}
              >
                <AiOutlineUser size={20} />
              </Box>

              <Paragraph>
                {userInput && userInput !== ""
                  ? `No ${target} with name '${userInput}'`
                  : "No results"}
              </Paragraph>
            </Box>
          )}

          <Box
            direction="row"
            responsive={false}
            justify="end"
            margin={{ top: "large" }}
          >
            <Button
              text="Close"
              primary
              onClick={() => {
                setPermissionsObj({});
                setUserInput(undefined);
                onClose();
              }}
            />
          </Box>
        </Box>
      </Modal>
    )
  );
};

DepositAccessModal.propTypes = {
  open: PropTypes.bool,
  displayAsFormField: PropTypes.bool,
  onClose: PropTypes.func,
  access: PropTypes.object,
};

export default DepositAccessModal;
