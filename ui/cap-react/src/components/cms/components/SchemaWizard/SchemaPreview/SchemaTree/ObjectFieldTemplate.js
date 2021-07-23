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

      // if there is difference between the two arrays means that something changed
      // an item might be deleted, and we want to re fetch everything from properties and update the cards
      if (propsLength < cardsLength) {
        let temp = props.properties.map((prop, index) => {
          return {
            id: index + 1,
            name: prop.name,
            prop: prop
          };
        });
        setCards(temp);
      }
    },
    [props.properties]
  );
  // this effect will be enabled when there is no delete or add of items
  // and there is an update on the keys props
  useEffect(
    () => {
      let propsLength = props.properties.length;
      let cardsLength = cards.length;
      if (propsLength === cardsLength) {
        let isAllKeysSame = cards.every((card, index) => {
          return card.name == props.properties[index].name;
        });
        if (!isAllKeysSame) {
          let temp = props.properties.map((prop, index) => {
            return {
              id: index + 1,
              name: prop.name,
              prop: prop
            };
          });
          setCards(temp);
        }
      }
    },
    [props.properties]
  );
  // this effect will be enabled when there is no delete or add of items
  // and there is an update on the schema props
  useEffect(
    () => {
      let propsLength = props.properties.length;
      let cardsLength = cards.length;
      if (propsLength == cardsLength) {
        let isPropsSame = cards.every((card, index) => {
          return (
            JSON.stringify(card.prop.content.props.schema) ===
            JSON.stringify(props.properties[index].content.props.schema)
          );
        });
        if (!isPropsSame) {
          let temp = props.properties.map((prop, index) => {
            return {
              id: index + 1,
              name: prop.name,
              prop: prop
            };
          });
          setCards(temp);
        }
      }
    },
    [props.properties]
  );
  // this effect will be enabled when there is no delete or add of items
  // and there is an update on the uiSchema props
  useEffect(
    () => {
      let propsLength = props.properties.length;
      let cardsLength = cards.length;
      if (propsLength === cardsLength) {
        let isUiPropsSame = cards.every((card, index) => {
          return (
            JSON.stringify(card.prop.content.props.uiSchema) ===
            JSON.stringify(props.properties[index].content.props.uiSchema)
          );
        });
        if (!isUiPropsSame) {
          let temp = props.properties.map((prop, index) => {
            return {
              id: index + 1,
              name: prop.name,
              prop: prop
            };
          });
          setCards(temp);
        }
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
    [cards]
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
