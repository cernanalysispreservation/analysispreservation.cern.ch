import React from "react";

import ReactTooltip from "react-tooltip";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import { TagCloud } from "react-tagcloud";
import { withRouter } from "react-router";

const data = [
  {
    value: "from EXO group",
    count: 3,
    link: "/search?q=&cms_working_group=EXO"
  },
  { value: "see all drafts", count: 2, link: "/drafts?q=" },
  { value: "search for muon", count: 2, link: "/search?q=object:muon" },
  { value: "by TOP group", count: 3, link: "/search?q=&cms_working_group=TOP" },
  {
    value: "all my published analysis",
    count: 1,
    link: "/search?q=&by_me=True"
  },
  { value: "from QCD", count: 2, link: "/search?q=&cms_working_group=QCD" },
  { value: "my drafts", count: 1, link: "/drafts?q=&by_me=True" },
  { value: "higgs boson", count: 3, link: "/search?q=higgs boson" },
  { value: "proton-proton", count: 3, link: "/search?q=proton-proton" },
  { value: "MET", count: 2, link: "/search?q=object:MET" },
  { value: "electron", count: 3, link: "/search?q=object:electron" },
  { value: "drafts shared with me", count: 1, link: "/drafts?q=&by_me=False" },
  { value: "jet", count: 3, link: "/search?q=object:jet" },
  { value: "higgs", count: 2, link: "/search?q=higgs" },
  { value: "vertex", count: 3, link: "/search?q=object:vertex" },
  { value: "T quark pair", count: 2, link: "/search?q=T quark pair" },
  {
    value: "harvested from CADI and not edited yet",
    count: 3,
    link: "/drafts?q=fetched_from:cadi NOT user_edited:true"
  },
  {
    value: "all from HIG group",
    count: 2,
    link: "/search?q=&cms_working_group=HIG"
  }
];

class DashboardQuickSearch extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box size={{ width: { max: "xlarge" } }} flex={false}>
        <Box pad="none">
          <Box flex={true} direction="row" pad="small" justify="start">
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
          colorIndex="light-1"
          justify="center"
        >
          <TagCloud
            style={{ cursor: "pointer", padding: 5 }}
            shuffle={false}
            minSize={18}
            maxSize={18}
            tags={data}
            colorOptions={{
              luminosity: "dark",
              hue: "blue"
            }}
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
