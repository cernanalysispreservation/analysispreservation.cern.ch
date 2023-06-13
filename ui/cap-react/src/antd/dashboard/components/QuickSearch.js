import PropTypes from "prop-types";
import { TagCloud } from "react-tagcloud";
const data = [
  {
    value: "from EXO group",
    count: 3,
    link: "/search?q=&cms_working_group=EXO",
  },
  { value: "see all drafts", count: 2, link: "/drafts?q=" },
  { value: "search for muon", count: 2, link: "/search?q=object:muon" },
  { value: "by TOP group", count: 3, link: "/search?q=&cms_working_group=TOP" },
  {
    value: "all my published analysis",
    count: 1,
    link: "/search?q=&by_me=True",
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
    link: "/drafts?q=fetched_from:cadi NOT user_edited:true",
  },
  {
    value: "all from HIG group",
    count: 2,
    link: "/search?q=&cms_working_group=HIG",
  },
];
const QuickSearch = ({ push }) => {
  return (
    <TagCloud
      style={{ cursor: "pointer", padding: 5 }}
      shuffle={false}
      minSize={18}
      maxSize={18}
      tags={data}
      colorOptions={{
        luminosity: "dark",
        hue: "blue",
      }}
      align="center"
      onClick={tag => push(tag.link)}
    />
  );
};

QuickSearch.propTypes = {
  push: PropTypes.func,
};

export default QuickSearch;
