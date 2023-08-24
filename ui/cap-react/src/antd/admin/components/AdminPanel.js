import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "../containers/Header";
import { CMS_NEW } from "../../routes";
import DocumentTitle from "../../partials/DocumentTitle";
import SchemaWizard from "../containers/SchemaWizard";
import Notifications from "../notifications/containers/Notifications";
import { FloatButton, Layout } from "antd";
import Joyride, { STATUS } from "react-joyride";
import { steps } from "../utils/tour/admin";
import TourTooltip from "../utils/tour/TourTooltip";
import { CarOutlined } from "@ant-design/icons";
import useStickyState from "../../hooks/useStickyState";
import { PRIMARY_COLOR } from "../../utils/theme";

const AdminPanel = ({ location, match, schema, schemaInit, getSchema }) => {
  useEffect(() => {
    let { schema_name, schema_version } = match.params;
    const { pathname } = location;

    // fetch schema
    // in order to cover all the potential situations creating from the already exist schemas
    // and create a new one from scratch
    if (schema_name) {
      pathname.startsWith(CMS_NEW)
        ? schema.size == 0 && schemaInit()
        : getSchema(schema_name, schema_version);
    }
  }, []);

  const [display, setDisplay] = useState("builder");

  const [tourDone, setTourDone] = useStickyState(false, "tourDone");

  const getPageTitle = () =>
    location.pathname.includes("notifications")
      ? "Notifications"
      : "Form Builder";

  return (
    <DocumentTitle title={getPageTitle()}>
      <Layout style={{ height: "100%", padding: 0 }}>
        <Header display={display} setDisplay={setDisplay} />
        <Layout.Content>
          <Joyride
            steps={steps}
            continuous
            disableCloseOnEsc
            showProgress
            showSkipButton
            hideCloseButton
            spotlightPadding={0}
            tooltipComponent={joyrideProps => (
              <TourTooltip total={steps.length} {...joyrideProps} />
            )}
            run={!tourDone && display != "notifications"}
            spotlightClicks
            callback={({ status }) =>
              [STATUS.FINISHED, STATUS.SKIPPED].includes(status) &&
              setTourDone(true)
            }
            styles={{
              options: { primaryColor: PRIMARY_COLOR },
              spotlight: { borderRadius: 0 },
            }}
          />
          {display === "notifications" ? <Notifications /> : <SchemaWizard />}
          <FloatButton
            icon={<CarOutlined />}
            type="primary"
            shape="square"
            description="Tour"
            onClick={() => setTourDone(false)}
          />
        </Layout.Content>
      </Layout>
    </DocumentTitle>
  );
};

AdminPanel.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  replacePath: PropTypes.func,
  schema: PropTypes.object,
  schemaInit: PropTypes.func,
  getSchema: PropTypes.func,
};

export default AdminPanel;
