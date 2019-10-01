export default {
  tree: {
    base: {
      listStyle: "none",
      backgroundColor: "#21252B",
      margin: 0,
      padding: 0,
      color: "#9DA5AB",
      // fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
      fontSize: "10px!important",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      flex: 1
    },
    node: {
      base: {
        position: "relative",
        display: "flex",
        flex: "1 1 0"
      },
      link: {
        cursor: "pointer",
        position: "relative",
        padding: "0px 5px",
        display: "block",
        flex: 1,
        flexWrap: false
      },
      activeLink: {
        background: "#31363F"
      },
      toggle: {
        base: {
          position: "relative",
          display: "inline-block",
          verticalAlign: "top",
          marginLeft: "-5px",
          height: "24px",
          width: "24px"
        },
        wrapper: {
          position: "absolute",
          top: "50%",
          left: "50%",
          margin: "-12px 0 0 -7px",
          height: "12px"
        },
        height: 10,
        width: 10,
        arrow: {
          fill: "#9DA5AB",
          strokeWidth: 0
        }
      },
      header: {
        base: {
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          flex: 1,
          // flexDirection: "column",
          verticalAlign: "middle",
          color: "#9DA5AB"
          // width: "20px"
        },
        connector: {
          // width: '2px',
          // height: '12px',
          // borderLeft: 'solid 2px black',
          // borderBottom: 'solid 2px black',
          // position: 'absolute',
          // top: '0px',
          // left: '-21px'
        },
        title: {
          lineHeight: "24px",
          verticalAlign: "middle",
          fontSize: "12px",
          color: "#fff",
          flex: 1
        }
      },
      subtree: {
        listStyle: "none",
        // paddingLeft: '5px',
        marginLeft: "14px"
      },
      loading: {
        color: "#E2C089"
      }
    }
  }
};
