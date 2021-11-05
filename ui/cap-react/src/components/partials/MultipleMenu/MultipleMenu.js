import React, { useState } from "react";
import PropTypes from "prop-types";
import Menu from "../Menu";
import MenuItem from "../MenuItem";
import MultipleMenus from "./MultipleMenus";
import { logout } from "../../../actions/auth";
import MediaQuery from "react-responsive";

import {
  AiOutlineMail,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineSchedule,
  AiOutlineQuestionCircle,
  AiOutlinePlus,
  AiOutlineBook,
  AiOutlineCode
} from "react-icons/ai";
import { Box } from "grommet";
import { connect } from "react-redux";

const MultipleMenu = ({ logout, permissions, openModal }) => {
  const [displayMenu, setDisplayMenu] = useState(undefined);

  const itemStyle = {
    background: "rgba(0, 114, 152, 0.1)",
    padding: "5px",
    borderRadius: "50%",
    marginRight: "5px"
  };

  return (
    <Menu
      top={50}
      right={15}
      hoverColor="rgba(67,135,170,1)"
      iconWrapperClassName="headerMenuAppp"
      minWidth="300px"
      dataCy="header-menu"
      shadow
    >
      <MultipleMenus
        onClick={() => setDisplayMenu(undefined)}
        displayMenu={displayMenu}
        menus={{
          Support: (
            <React.Fragment>
              <MenuItem
                title="CERN Ticketing Service"
                target="_blank"
                href="https://cern.service-now.com/service-portal?id=functional_element&name=Data-Analysis-Preservation"
                icon={
                  <Box style={itemStyle}>
                    <AiOutlineQuestionCircle color="#007298" size={14} />
                  </Box>
                }
              />
              <MenuItem
                title="CAP Email Support"
                href="mailto:analysis-preservation-support@cern.ch"
                icon={
                  <Box style={itemStyle}>
                    <AiOutlineMail color="#007298" size={14} />
                  </Box>
                }
              />
            </React.Fragment>
          ),
          Documentation: (
            <React.Fragment>
              <MenuItem
                target="_blank"
                title="General Docs"
                href="/docs/general"
                icon={
                  <Box style={itemStyle}>
                    <AiOutlineBook color="#007298" size={14} />
                  </Box>
                }
              />
              <MenuItem
                target="_blank"
                title="Cap Client"
                href="/docs/cli"
                icon={
                  <Box style={itemStyle}>
                    <AiOutlineCode color="#007298" size={14} />
                  </Box>
                }
              />
              <MenuItem
                target="_blank"
                title="Cap API"
                href="/docs/api"
                icon={
                  <Box style={itemStyle}>
                    <AiOutlineSchedule color="#007298" size={14} />
                  </Box>
                }
              />
            </React.Fragment>
          )
        }}
      >
        <MenuItem
          title="Documentation"
          onClick={() => setDisplayMenu("Documentation")}
          multipleMenu
          href="#"
          icon={
            <Box style={itemStyle}>
              <AiOutlineBook color="#007298" size={14} />
            </Box>
          }
        />
        <MenuItem
          title="Support"
          onClick={() => setDisplayMenu("Support")}
          multipleMenu
          href="#"
          icon={
            <Box style={itemStyle}>
              <AiOutlineQuestionCircle color="#007298" size={14} />
            </Box>
          }
        />
        {permissions && (
          <MediaQuery maxWidth={719}>
            <MenuItem
              title="Create"
              onClick={openModal}
              href="#"
              icon={
                <Box style={itemStyle}>
                  <AiOutlinePlus color="#007298" size={14} />
                </Box>
              }
            />
          </MediaQuery>
        )}
        <MenuItem
          title="Settings"
          icon={
            <Box style={itemStyle}>
              <AiOutlineSetting color="#007298" size={14} />
            </Box>
          }
          path="/settings"
          href="#"
          dataCy="settings-menuitem"
        />
        <MenuItem
          title="Logout"
          onClick={logout}
          href="#"
          icon={
            <Box style={itemStyle}>
              <AiOutlineLogout color="#007298" size={14} />
            </Box>
          }
        />
      </MultipleMenus>
    </Menu>
  );
};

MultipleMenu.propTypes = {
  logout: PropTypes.func
};

const mapStateToProps = state => ({
  permissions: state.auth.getIn(["currentUser", "permissions"])
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultipleMenu);
