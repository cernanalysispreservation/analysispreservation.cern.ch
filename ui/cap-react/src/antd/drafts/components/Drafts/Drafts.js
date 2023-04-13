import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  DRAFT_ITEM,
  DRAFT_ITEM_EDIT,
  DRAFT_ITEM_SETTINGS,
  DRAFT_ITEM_INTEGRATIONS
} from "../../../routes";
import { Switch, Route } from "react-router-dom";
import DraftPreview from "../../containers/Overview";
import DraftEditor from "../../containers/Editor";
import DraftSettings from "../../containers/Settings";
import DraftIntegrations from "../../containers/Connect";
import DocumentTitle from "../../../partials/DocumentTitle";

import { Col, Layout, Row } from "antd";
import DraftItemNav from "../../containers/DraftItemNav";
import DraftSideBar from "../SideBar";
import DraftHeader from "../../containers/DraftHeader";
import Error from "../../../partials/Error/";
import Guard from "../Guard/Guard";

const Drafts = ({
  id,
  match,
  getDraftById,
  metadata = { general_title: {} },
  errors
}) => {
  useEffect(() => {
    let { draft_id } = match.params;

    if (draft_id == id) return;
    if (draft_id) {
      getDraftById(draft_id);
    }
  }, []);

  const [visibleMenuDrawer, setVisibleMenuDrawer] = useState(false);
  const [visibleFileDrawer, setVisibleFileDrawer] = useState(false);

  const formRef = useRef(null);

  if (errors && [403, 404, 500, 410].includes(errors.status))
    return <Error error={errors} />;

  return (
    <DocumentTitle
      title={
        metadata.general_title ? `${metadata.general_title} | Draft` : "Draft"
      }
    >
      <Layout style={{ width: "100%", height: "100%", padding: 0 }}>
        <DraftHeader
          openMenuDrawer={() => setVisibleMenuDrawer(true)}
          openFileDrawer={() => setVisibleFileDrawer(true)}
        />
        <Guard draft_id={match.params.draft_id} />

        <Layout style={{ padding: 0 }}>
          <DraftItemNav
            visibleMenuDrawer={visibleMenuDrawer}
            onClose={() => setVisibleMenuDrawer(false)}
          />
          <Layout style={{ padding: 0 }}>
            <Row
              justify="space-between"
              style={{ overflowX: "hidden", height: "100%" }}
            >
              <Col xs={24} xxl={18} style={{ height: "100%" }}>
                <Row
                  justify="center"
                  style={{ height: "100%", overflowX: "hidden" }}
                >
                  <Switch>
                    <Route exact path={DRAFT_ITEM} component={DraftPreview} />
                    <Route
                      path={DRAFT_ITEM_EDIT}
                      render={props => (
                        <DraftEditor {...props} formRef={formRef} />
                      )}
                    />
                    <Route
                      path={DRAFT_ITEM_SETTINGS}
                      component={DraftSettings}
                    />
                    <Route
                      path={DRAFT_ITEM_INTEGRATIONS}
                      component={DraftIntegrations}
                    />
                  </Switch>
                </Row>
              </Col>
              <DraftSideBar
                visibleFileDrawer={visibleFileDrawer}
                onClose={() => setVisibleFileDrawer(false)}
              />
            </Row>
          </Layout>
        </Layout>
      </Layout>
    </DocumentTitle>
  );
};

Drafts.propTypes = {
  id: PropTypes.string,
  match: PropTypes.object,
  getDraftById: PropTypes.func,
  metadata: PropTypes.object,
  errors: PropTypes.object
};

export default Drafts;
