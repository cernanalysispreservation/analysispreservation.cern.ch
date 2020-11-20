import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import RenderSortable from "./renderSortable";
import update from "immutability-helper";
import { connect } from "react-redux";
import { updateUiSchemaByPath } from "../../../../../../actions/schemaWizard";

const ObjectFieldTemplate = function(props) {
  const [cards, setCards] = useState([]);

  useEffect(
    () => {
      let propsLength = props.properties.length;
      let cardsLength = cards.length;
      let uiCards = cards.map(item => item.name);
      let uiProperties = props.properties.map(item => item.name);
      let different = false;
      uiProperties.map(item => {
        if (!uiCards.includes(item)) different = true;
      });

      if (
        propsLength < cardsLength ||
        (propsLength === cardsLength && different)
      ) {
        let temp = [];
        props.properties.map((prop, index) => {
          let item = {
            id: index + 1,
            name: prop.name,
            prop: prop
          };

          temp.push(item);
        });
        setCards(temp);
      }

      if (props.properties.length === cards.length && !different) {
        cards.map((card, index) => {
          card.prop = props.properties[index];
        });
      }
    },
    [props.properties]
  );

  // update the uiSchema after the cards update
  // removes the ids and updates the ui:orded with the new one
  // everytyhing else remains the same
  useEffect(
    () => {
      let uiCards = cards.map(item => item.name);
      let uiProperties = props.properties.map(item => item.name);
      let { ...rest } = props.uiSchema;

      uiCards = uiProperties.length < uiCards.length ? uiProperties : uiCards;

      props.onUiSchemaChange(
        props.formContext.uiSchema.length > 0 ? props.formContext.uiSchema : [],
        {
          ...rest,
          "ui:order": [...uiCards, "*"]
        }
      );
    },
    [props.properties, cards]
  );

  // create a new array to keep track of the changes in the order
  props.properties.map((prop, index) => {
    if (index != cards.length) {
      return;
    }

    let item = {
      id: index + 1,
      name: prop.name,
      prop: prop
    };

    setCards([...cards, item]);
  });

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
    onUiSchemaChange: (path, schema) =>
      dispatch(updateUiSchemaByPath(path, schema))
  };
}

export default connect(
  state => state,
  mapDispatchToProps
)(ObjectFieldTemplate);
