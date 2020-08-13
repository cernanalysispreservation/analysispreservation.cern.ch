import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5);
`;

const Content = styled.div`
  border-radius: 3px;
  min-width: 340px;
  max-width: 90%;
  overflow: scroll;
  background: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 50px;
  padding: 10px 15px;
  border-bottom: ${props =>
    props.separator ? "0.1px solid rgba(0, 0, 0, 0.3)" : ""};
  color: #000;
`;

const Body = styled.div`
  padding: ${props => props.padding};
`;

const Heading = styled.div`
  grid-column: 2/3;
  justify-self: center;
`;

const CloseButton = styled.div`
  grid-column: 3/4;
  justify-self: end;
  align-self: center;
  &:hover {
    cursor: pointer;
  }
`;
const Modal = ({
  Tag = "h3",
  onClose = null,
  children,
  padding = "10px",
  title = "",
  separator = false
}) => {
  const modal = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  const escFunction = event => {
    // when the user clicks the ESC button
    // the menu will hide
    if (event.keyCode === 27) {
      onClose();
    }
  };

  // useEffect in order to capture clicks that are not in the menu
  useEffect(
    () => {
      function handleClickOutside(event) {
        const dom = ReactDOM.findDOMNode(modal.current);
        if (modal.current && !dom.contains(event.target)) {
          onClose();
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    },
    [modal]
  );
  return (
    <Wrapper id="cap-modal">
      <Content ref={modal}>
        <Header separator={separator}>
          <Heading>
            <Tag>{title}</Tag>
          </Heading>
          <CloseButton onClick={onClose} className="func-close">
            <AiOutlineClose size={25} color="rgba(0,0,0,0.6)" />
          </CloseButton>
        </Header>
        <Body padding={padding}>{children}</Body>
      </Content>
    </Wrapper>
  );
};

Modal.propTypes = {
  Tag: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]),
  onClose: PropTypes.func,
  children: PropTypes.node,
  padding: PropTypes.string,
  title: PropTypes.string,
  separator: PropTypes.bool
};

export default Modal;
