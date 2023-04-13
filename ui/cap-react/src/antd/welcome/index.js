import Intro from "./Intro";
import Discover from "./Discover";
import Explain from "./Explain";
import Integrations from "./Integrations";
import Documentation from "./Documentation";
import Contact from "./Contact";
import { Row } from "antd";

const index = () => {
  return (
    <Row justify="center">
      <Intro />
      <Discover />
      <Explain />
      <Integrations />
      <Documentation />
      <Contact />
    </Row>
  );
};

export default index;
