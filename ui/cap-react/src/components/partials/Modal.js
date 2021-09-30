import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import Heading from "grommet/components/Heading";

const rightAnimation = keyframes`
  0% {right:-100% }
  100%{ right:0}
  `;

const leftAnimation = keyframes`
0% {left:-100% }
100%{ left:0}
`;

const centerAnimation = keyframes`
  0%{transform: translate(-50%, -50%);opacity:0}
  100%{transform:translate(-50%, -50%);opacity:1}
`;

const getAnimationFromPosition = position => {
  const choices = {
    left: leftAnimation,
    right: rightAnimation,
    center: centerAnimation
  };

  return choices[position];
};

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
  min-width: 320px;
  max-width: 90%;
  max-height: ${props => (props.full ? "100%" : "90%")};
  height: ${props => (props.full ? "100%" : null)};
  overflow: scroll;
  background: ${props => props.background};
  display: flex;
  flex-direction: column;
  overflow: ${props => (props.overflowVisible ? "visible" : "auto")};

  position: absolute;
  top: ${props => props.position.top};
  left: ${props => props.position.left};
  right: ${props => props.position.right};
  bottom: ${props => props.position.bottom};
  transform: ${props => props.position.transform};
  animation-name: ${props =>
    props.animated && getAnimationFromPosition(props.align)};
  animation-duration: 0.3s;
  animation-iteration-count: 1;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 50px;
  padding: 10px 15px;
  border-bottom: ${props => (props.separator ? "0.1px solid #e6e6e6" : "")};
  color: #000;
`;

const Body = styled.div`
  padding: ${props => props.padding};
`;

const RelativeBody = styled.div`
  position: relative;
`;

const Icon = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
  padding: 3px;
  &:hover {
    background: #e6e6e6;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const HeadingWrapper = styled.div`
  grid-column: 2/3;
  justify-self: center;
  align-self: center;
`;

const CloseButton = styled.div`
  grid-column: 3/4;
  justify-self: end;
  align-self: center;
  display: flex;
  align-items: center;
  padding: 5px;
  &:hover {
    background: #e6e6e6;
    border-radius: 50%;
    cursor: pointer;
  }
`;
const Modal = ({
  tag = "h4",
  onClose = null,
  children,
  padding = "10px",
  title = "",
  separator = false,
  position = "center",
  background = "rgb(255,255,255)",
  full = false,
  animated = false,
  flush = false,
  disableClickHandlers = false,
  disableEscHandlder = false,
  overflowVisible = false
}) => {
  const modal = useRef(null);

  useEffect(() => {
    {
      !disableEscHandlder &&
        document.addEventListener("keydown", escFunction, false);
    }
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
      {
        !disableClickHandlers &&
          document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    },
    [modal]
  );

  const getPositionByName = name => {
    const choices = {
      left: {
        top: 0,
        left: 0
      },
      right: {
        top: 0,
        right: 0
      },
      center: {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }
    };
    return choices[name];
  };

  return (
    <Wrapper>
      <Content
        ref={modal}
        position={getPositionByName(position)}
        background={background}
        full={full}
        animated={animated}
        align={position}
        overflowVisible={overflowVisible}
      >
        {flush ? (
          <RelativeBody>
            <Icon onClick={onClose}>
              <AiOutlineClose size={18} color="rgba(0,0,0,0.6)" />
            </Icon>
            {children}
          </RelativeBody>
        ) : (
          <React.Fragment>
            <Header separator={separator}>
              <HeadingWrapper>
                <Heading tag={tag} margin="none">
                  {title}
                </Heading>
              </HeadingWrapper>
              <CloseButton onClick={onClose} className="func-close">
                <AiOutlineClose size={20} color="rgba(0,0,0,0.6)" />
              </CloseButton>
            </Header>
            <Body padding={padding}>{children}</Body>
          </React.Fragment>
        )}
      </Content>
    </Wrapper>
  );
};

Modal.propTypes = {
  tag: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]),
  onClose: PropTypes.func,
  children: PropTypes.node,
  padding: PropTypes.string,
  title: PropTypes.string,
  separator: PropTypes.bool,
  background: PropTypes.string,
  position: PropTypes.string,
  full: PropTypes.bool,
  animated: PropTypes.bool,
  flush: PropTypes.bool,
  disableClickHandlers: PropTypes.bool,
  disableEscHandlder: PropTypes.bool,
  overflowVisible: PropTypes.bool
};

export default Modal;
