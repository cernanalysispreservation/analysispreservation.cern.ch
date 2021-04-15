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

  return (
    <Menu
      top={50}
      right={15}
      hoverColor="rgba(67,135,170,1)"
      iconWrapperClassName="headerMenuAppp"
      minWidth="300px"
      dataCy="header-menu"
    >
      <MultipleMenus
        onClick={() => setDisplayMenu(undefined)}
        displayMenu={displayMenu}
        menus={{
          Support: (
            <React.Fragment>
              <MenuItem
                hovered
                separator
                title="CERN Ticketing Service"
                target="_blank"
                href="https://cern.service-now.com/service-portal?id=functional_element&name=Data-Analysis-Preservation"
                icon={
                  <Box
                    style={{
                      background: "rgba(0, 114, 152, 0.1)",
                      padding: "5px",
                      borderRadius: "50%"
                    }}
                  >
                    <AiOutlineQuestionCircle color="#007298" size={18} />
                  </Box>
                }
              />
              <MenuItem
                hovered
                separator
                title="CAP Email Support"
                href="mailto:analysis-preservation-support@cern.ch"
                icon={
                  <Box
                    style={{
                      background: "rgba(0, 114, 152, 0.1)",
                      padding: "5px",
                      borderRadius: "50%"
                    }}
                  >
                    <AiOutlineMail color="#007298" size={18} />
                  </Box>
                }
              />
            </React.Fragment>
          ),
          Documentation: (
            <React.Fragment>
              <MenuItem
                hovered
                separator
                target="_blank"
                title="General Docs"
                href="/docs/general"
                icon={
                  <Box
                    style={{
                      background: "rgba(0, 114, 152, 0.1)",
                      padding: "5px",
                      borderRadius: "50%"
                    }}
                  >
                    <AiOutlineBook color="#007298" size={18} />
                  </Box>
                }
              />
              <MenuItem
                hovered
                separator
                target="_blank"
                title="Cap Client"
                href="/docs/cli"
                icon={
                  <Box
                    style={{
                      background: "rgba(0, 114, 152, 0.1)",
                      padding: "5px",
                      borderRadius: "50%"
                    }}
                  >
                    <AiOutlineCode color="#007298" size={18} />
                  </Box>
                }
              />
              <MenuItem
                hovered
                separator
                target="_blank"
                title="Cap API"
                href="/docs/api"
                icon={
                  <Box
                    style={{
                      background: "rgba(0, 114, 152, 0.1)",
                      padding: "5px",
                      borderRadius: "50%"
                    }}
                  >
                    <AiOutlineSchedule color="#007298" size={18} />
                  </Box>
                }
              />
            </React.Fragment>
          )
        }}
      >
        <MenuItem
          hovered
          separator
          title="Documentation"
          onClick={() => setDisplayMenu("Documentation")}
          multipleMenu
          href="#"
          icon={
            <Box
              style={{
                background: "rgba(0, 114, 152, 0.1)",
                padding: "5px",
                borderRadius: "50%"
              }}
            >
              <AiOutlineBook color="#007298" size={18} />
            </Box>
          }
        />
        <MenuItem
          hovered
          separator
          title="Support"
          onClick={() => setDisplayMenu("Support")}
          multipleMenu
          href="#"
          icon={
            <Box
              style={{
                background: "rgba(0, 114, 152, 0.1)",
                padding: "5px",
                borderRadius: "50%"
              }}
            >
              <AiOutlineQuestionCircle color="#007298" size={18} />
            </Box>
          }
        />
        {permissions && (
          <MediaQuery maxWidth={719}>
            <MenuItem
              hovered
              separator
              title="Create"
              onClick={openModal}
              href="#"
              icon={
                <Box
                  style={{
                    background: "rgba(0, 114, 152, 0.1)",
                    padding: "5px",
                    borderRadius: "50%"
                  }}
                >
                  <AiOutlinePlus color="#007298" size={18} />
                </Box>
              }
            />
          </MediaQuery>
        )}
        <MenuItem
          hovered
          separator
          title="Settings"
          icon={
            <Box
              style={{
                background: "rgba(0, 114, 152, 0.1)",
                padding: "5px",
                borderRadius: "50%"
              }}
            >
              <AiOutlineSetting color="#007298" size={18} />
            </Box>
          }
          path="/settings"
          href="#"
          dataCy="settings-menuitem"
        />
        <MenuItem
          hovered
          separator
          title="Logout"
          onClick={logout}
          href="#"
          icon={
            <Box
              style={{
                background: "rgba(0, 114, 152, 0.1)",
                padding: "5px",
                borderRadius: "50%"
              }}
            >
              <AiOutlineLogout color="#007298" size={18} />
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
