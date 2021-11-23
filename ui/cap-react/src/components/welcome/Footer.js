import React from "react";

import Anchor from "../partials/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Label from "grommet/components/Label";

import { AliceIcon } from "../drafts/form/themes/grommet/fields/components/Alice";
import { AtlasIcon } from "../drafts/form/themes/grommet/fields/components/Atlas";
import { CmsIcon } from "../drafts/form/themes/grommet/fields/components/Cms";

import LHCbLogo from "../../img/lhcb-logo.svg";
import SocialTwitterIcon from "grommet/components/icons/base/SocialTwitter";
import SocialMailIcon from "grommet/components/icons/base/SocialMail";
import SocialGithubIcon from "grommet/components/icons/base/SocialGithub";

import capPackageJSON from "../../../package";

class Footer extends React.Component {
  render() {
    return (
      <span>
        <Box flex={true} justify="between" align="center" colorIndex="light-2">
          <Box flex={false} size={{ width: "xxlarge" }}>
            <Box
              flex={true}
              justify="center"
              align="center"
              direction="row"
              pad={{ vertical: "medium" }}
            >
              <Box flex={false} colorIndex="light-2" pad={{ between: "small" }}>
                <Anchor
                  icon={<SocialMailIcon />}
                  label={<Label>analysis-preservation-support@cern.ch</Label>}
                  href="mailto:analysis-preservation-support@cern.ch"
                />
                <Anchor
                  icon={<SocialTwitterIcon />}
                  label={<Label>@analysispreserv</Label>}
                  target="_blank"
                  href="https://twitter.com/analysispreserv"
                />
                <Anchor
                  icon={<SocialGithubIcon />}
                  label={<Label>@cernnanalysispreservation</Label>}
                  target="_blank"
                  href="https://github.com/cernanalysispreservation/analysispreservation.cern.ch"
                />
              </Box>
              <Box flex={true} align="end">
                <Box align="center" size={{ width: "small" }}>
                  <Heading tag="h4">Supported by:</Heading>
                  <Box
                    direction="row"
                    align="center"
                    justify="center"
                    size={{ width: "xxlarge" }}
                    margin={{ top: "medium" }}
                    responsive={false}
                  >
                    <Box
                      margin="small"
                      pad={{ between: "small" }}
                      justify="center"
                      align="center"
                    >
                      <AtlasIcon size="medium" />
                      <CmsIcon size="medium" />
                    </Box>
                    <Box
                      margin="small"
                      pad={{ between: "small" }}
                      justify="center"
                      align="center"
                    >
                      <AliceIcon size="medium" />
                      <LHCbLogo height="40px" />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </span>
    );
  }
}

export default Footer;
