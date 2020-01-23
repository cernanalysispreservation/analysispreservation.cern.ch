import React from "react";

import ReactTooltip from "react-tooltip";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import { TagCloud } from "react-tagcloud";
import { withRouter } from "react-router";

const data = [
  {
    value: "from CADI and edited",
    count: 3,
    link: "/drafts?q=fetched_from:cadi user_edited:true"
  },
  {
    value: "from CADI and not edited",
    count: 3,
    link: "/drafts?q=fetched_from:cadi NOT user_edited:true"
  },
  { value: "EXO", count: 3, link: "/search?q=&cms_wg=EXO" },
  { value: "muon", count: 2, link: "/search?q=object:muon" },
  { value: "draft", count: 2, link: "/drafts?q=" },
  { value: "published by me", count: 1, link: "/search?q=&by_me=True" },
  { value: "TOP", count: 3, link: "/search?q=&cms_wg=TOP" },
  { value: "electron", count: 3, link: "/search?q=object:electron" },
  { value: "QCD", count: 2, link: "/search?q=&cms_wg=QCD" },
  { value: "my drafts", count: 1, link: "/drafts?q=&by_me=True" },
  { value: "higgs boson", count: 3, link: "/search?q=higgs boson" },
  { value: "proton-proton", count: 3, link: "/search?q=proton-proton" },
  { value: "MET", count: 2, link: "/search?q=object:MET" },
  { value: "shared with me", count: 1, link: "/drafts?q=&by_me=False" },
  { value: "jet", count: 3, link: "/search?q=object:jet" },
  { value: "black holes", count: 3, link: "/search?q=black holes" },
  { value: "higgs", count: 2, link: "/search?q=higgs" },
  { value: "vertex", count: 3, link: "/search?q=object:vertex" },
  { value: "T quark pair", count: 2, link: "/search?q=T quark pair" },
  { value: "Z → e+e− decays", count: 1, link: "/search?q=Z → e+e− decays" },
];

class DashboardQuickSearch extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box flex={false}>
        <Box pad="none">
          <Box flex={true} direction="row" pad="small" justify="center">
            <Heading
              tag="h5"
              uppercase={true}
              justify="center"
              margin="none"
              truncate={true}
            >
              Quick Search
            </Heading>
          </Box>
          <ReactTooltip />
        </Box>

        <Box
          pad="small"
          align="center"
          style={{ overflow: "hidden" }}
          flex={false}
          wrap
          size={{ height: "medium" }}
          colorIndex="light-1"
        >
          <TagCloud
            style={{ cursor: "pointer" }}
            minSize={15}
            maxSize={20}
            tags={data}
            colorOptions={{ luminosity: "random", hue: "monochrome" }}
            align="center"
            onClick={tag => this.props.history.push(tag.link)}
          />
        </Box>
      </Box>
    );
  }
}

DashboardQuickSearch.propTypes = {
  history: PropTypes.object
};
export default withRouter(DashboardQuickSearch);
