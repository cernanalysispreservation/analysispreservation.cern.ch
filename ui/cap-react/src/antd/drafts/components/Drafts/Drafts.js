import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  DRAFT_ITEM,
  DRAFT_ITEM_EDIT,
  DRAFT_ITEM_SETTINGS,
  DRAFT_ITEM_INTEGRATIONS
} from "../../../../components/routes";
import { Switch, Route } from "react-router-dom";
import DraftPreview from "../../../../components/drafts/DraftPreview";
import DraftEditor from "../../../../components/drafts/DraftEditor";
import DraftSettings from "../../../../components/drafts/components/DepositSettings";
import DraftIntegrations from "../../../../components/drafts/components/DraftIntegrations";
import DocumentTitle from "../../../../components/partials/Title";

import { Col, Layout, Row } from "antd";
import DraftItemNav from "../../containers/DraftItemNav";
import DraftSideBar from "../DraftSideBar";
import DraftHeader from "../../containers/DraftHeader";

const Drafts = ({
  id,
  match,
  getDraftById,
  metadata = { general_title: {} }
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

        <Layout style={{ padding: 0 }}>
          <DraftItemNav
            visibleMenuDrawer={visibleMenuDrawer}
            onClose={() => setVisibleMenuDrawer(false)}
          />
          <Layout style={{ padding: 0 }}>
            <Row justify="space-between" style={{ overflowX: "hidden" }}>
              <Col xs={24} xxl={19}>
                <Row justify="center">
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
  metadata: PropTypes.object
};

export default Drafts;
