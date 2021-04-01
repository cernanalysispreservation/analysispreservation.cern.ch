import React from "react";
import PropTypes from "prop-types";

import { Box, Label } from "grommet";
import Tag from "../../partials/Tag";
import Anchor from "../../partials/Anchor";
import { AiOutlineMail } from "react-icons/ai";
import { connect } from "react-redux";

const Profile = props => {
  const { user, cernProfile } = props;

  return (
    <Box
      colorIndex="light-1"
      align="center"
      pad="small"
      style={{ borderRadius: "3px" }}
    >
      <Box
        style={{
          borderRadius: "50%",
          fontSize: 20,
          height: "50px",
          width: "50px",
          color: "white",
          background: "#007298"
        }}
        align="center"
        justify="center"
      >
        {`${user
          .get("email")
          .split(".")[0]
          .charAt(0)
          .toUpperCase()}${user
          .get("email")
          .split(".")[1]
          .charAt(0)
          .toUpperCase()}`}
      </Box>
      {cernProfile && (
        <React.Fragment>
          <Box margin={{ vertical: "small" }} align="center">
            <Label margin="none" size="large">
              {cernProfile.get("display_name").split(" ")[0]}
            </Label>
            <Label margin="none" size="large">
              {cernProfile.get("display_name").split(" ")[1]}
            </Label>
          </Box>
          <Box direction="row" responsive={false}>
            <Box margin={{ right: "small" }}>
              <Tag
                text={cernProfile.get("department")}
                color={{
                  bgcolor: "rgba(0, 114, 152, 0.15)",
                  border: "rgba(0, 114, 152, 0.45)",
                  color: "#007298"
                }}
              />
            </Box>
            <Tag text={cernProfile.get("common_name")} />
          </Box>
        </React.Fragment>
      )}
      <Anchor
        href={`mailto:${user.get("email")}`}
        label={
          <Box direction="row" align="center" responsive={false}>
            <AiOutlineMail />
            <Label
              size="small"
              style={{ color: "#2883d7", margin: "0 0 0 5px" }}
            >
              {user.get("email")}
            </Label>
          </Box>
        }
      />
    </Box>
  );
};

Profile.propTypes = {
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.auth.getIn(["currentUser", "profile"]),
  cernProfile: state.auth.getIn(["currentUser", "profile", "cern"])
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
