import React from "react";

import Box from "grommet/components/Box";

import Header from "./Header";
import Intro from "./Intro";
import Discover from "./Discover";
import Explain from "./Explain";
import Integrations from "./Integrations";
import Documentation from "./Documentation";
import Footer from "./Footer";
import {
  AiOutlineHome,
  AiOutlineShareAlt,
  AiOutlineRead,
  AiOutlineProfile,
  AiOutlineInbox
} from "react-icons/ai";

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.IntroRef = React.createRef();
    this.DiscoverRef = React.createRef();
    this.ExplainRef = React.createRef();
    this.IntegrationsRef = React.createRef();
    this.DocumentationRef = React.createRef();

    this.nav = {
      intro: {
        title: "Home",
        ref: this.IntroRef,
        icon: <AiOutlineHome size={23} color="rgb(110,110,110)" />
      },
      discover: {
        title: "What is CAP?",
        ref: this.DiscoverRef,
        icon: <AiOutlineInbox size={23} color="rgb(110,110,110)" />
      },
      explain: {
        title: "Get Started",
        ref: this.ExplainRef,
        icon: <AiOutlineProfile size={23} color="rgb(110,110,110)" />
      },
      integrations: {
        title: "Integrations",
        ref: this.IntegrationsRef,
        icon: <AiOutlineShareAlt size={23} color="rgb(110,110,110)" />
      },
      docs: {
        title: "Documentation",
        ref: this.DocumentationRef,
        icon: <AiOutlineRead size={23} color="rgb(110,110,110)" />
      }
    };
  }

  scrollToRef = ref => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  render() {
    return (
      <Box>
        <Header nav={this.nav} scrollToRef={this.scrollToRef} />

        <Intro scrollToRef={this.IntroRef} />

        <Discover scrollToRef={this.DiscoverRef} />

        <Explain scrollToRef={this.ExplainRef} />

        <Integrations scrollToRef={this.IntegrationsRef} />

        <Documentation scrollToRef={this.DocumentationRef} />

        <Footer />
      </Box>
    );
  }
}

export default WelcomePage;
