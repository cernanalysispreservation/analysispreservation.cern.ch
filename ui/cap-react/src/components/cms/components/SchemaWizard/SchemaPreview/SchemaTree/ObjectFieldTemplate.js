import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import RenderSortable from "./renderSortable";
import update from "immutability-helper";
import { connect } from "react-redux";
import {
  addByPath,
  updateUiSchemaByPath
} from "../../../../../../actions/schemaWizard";

const ObjectFieldTemplate = function(props) {
  const [cards, setCards] = useState([]);
  useEffect(
    () => {
      cards.map((card, index) => {
        card.prop = props.properties[index];
      });
    },
    [props.properties]
  );

  // create a new array to keep track of the changes in the order
  props.properties.map((prop, index) => {
    if (index != cards.length) {
      return;
    }
    let item = {
      id: index + 1,
      text: prop.name,
      prop: prop
    };

    setCards([...cards, item]);
  });
  // update the uiSchema after the cards update
  // removes the ids and updates the ui:orded with the new one
  // everytyhing else remains the same
  useEffect(
    () => {
      let uiCards = cards.map(item => item.text);
      let { ...rest } = props.uiSchema;
      // when the ui:order is updated, the asterisk is appended in the end,
      // in order to accept new added components and order them in the end of the list
      props.onUiSchemaChange(
        props.formContext.uiSchema.length > 0 ? props.formContext.uiSchema : [],
        {
          ...rest,
          "ui:order": [...uiCards, "*"]
        }
      );
    },
    [cards, props.properties]
  );

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex];
      if (dragCard) {
        setCards(
          update(cards, {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
          })
        );
      }
    },
    [cards]
  );
  if (props.idSchema.$id == "root") {
    return (
      <Box>
        {cards.map((card, i) =>
          RenderSortable(props.formContext.uiSchema, card, i, moveCard)
        )}
      </Box>
    );
  }
};

ObjectFieldTemplate.propTypes = {
  idSchema: PropTypes.object,
  properties: PropTypes.array,
  formContext: PropTypes.object,
  onUiSchemaChange: PropTypes.func,
  uiSchema: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    addProperty: (path, data) => dispatch(addByPath(path, data)),
    onUiSchemaChange: (path, schema) =>
      dispatch(updateUiSchemaByPath(path, schema))
  };
}

export default connect(
  state => state,
  mapDispatchToProps
)(ObjectFieldTemplate);
