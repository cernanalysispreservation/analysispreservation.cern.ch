import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "../containers/Header";
import DocumentTitle from "../../partials/DocumentTitle";
import SchemaWizard from "../components/SchemaWizard";
import Notifications from "../notifications/containers/Notifications";
import { FloatButton, Layout } from "antd";
import Joyride, { STATUS } from "react-joyride";
import { steps } from "../utils/tour/admin";
import TourTooltip from "../utils/tour/TourTooltip";
import { CarOutlined } from "@ant-design/icons";
import useStickyState from "../../hooks/useStickyState";
import { PRIMARY_COLOR } from "../../utils/theme";
import { MosesContext, getMosesState } from "cap-moses";
import { isEmpty } from "lodash-es";
import { initMosesSchemaWithNotifications } from "../utils";

const AdminPanel = ({ location, match, getSchema, loading }) => {
  const [schema, setSchema] = useState();
  const [uiSchema, setUiSchema] = useState();
  const [initialSchema, setInitialSchema] = useState();
  const [initialUiSchema, setInitialUiSchema] = useState();

  useEffect(() => {
    let { schema_name, schema_version } = match.params;

    if (schema_name == "new") {
      // If the schema hasn't been initialized yet (i.e. the user has navigated directly to /new), initialize it
      if (isEmpty(getMosesState().current.schema)) {
        initMosesSchemaWithNotifications();
      }
      // Otherwise do nothing as it means it's been already initialized in CreateForm or DropDownBox
    } else {
      getSchema(schema_name, schema_version);
    }
  }, []);

  const synchronizeState = newState => {
    setSchema(newState.current.schema);
    setUiSchema(newState.current.uiSchema);
    setInitialSchema(newState.initial.schema);
    setInitialUiSchema(newState.initial.uiSchema);
  };

  const [display, setDisplay] = useState("builder");

  const [tourDone, setTourDone] = useStickyState(false, "tourDone");

  const getPageTitle = () =>
    location.pathname.includes("notifications")
      ? "Notifications"
      : "Form Builder";

  return (
    <DocumentTitle title={getPageTitle()}>
      <Layout style={{ height: "100%", padding: 0 }}>
        <MosesContext
          synchronizeState={synchronizeState}
          theme={{
            token: {
              colorPrimary: PRIMARY_COLOR,
              colorLink: PRIMARY_COLOR,
              colorLinkHover: "#1a7fa3",
              borderRadius: 2,
              colorBgLayout: "#f0f2f5",
              fontFamily: "Titillium Web",
            },
          }}
        >
          <Header
            schema={schema}
            uiSchema={uiSchema}
            initialSchema={initialSchema}
            initialUiSchema={initialUiSchema}
            display={display}
            setDisplay={setDisplay}
          />
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
            {display === "notifications" ? (
              <Notifications />
            ) : (
              <SchemaWizard
                loading={isEmpty(getMosesState().current.schema) || loading}
              />
            )}
            <FloatButton
              icon={<CarOutlined />}
              type="primary"
              shape="square"
              description="Tour"
              onClick={() => setTourDone(false)}
            />
          </Layout.Content>
        </MosesContext>
      </Layout>
    </DocumentTitle>
  );
};

AdminPanel.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  getSchema: PropTypes.func,
  loading: PropTypes.bool,
};

export default AdminPanel;
