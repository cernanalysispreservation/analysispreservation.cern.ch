export const getTagType = isTagSelected => {
  const choices = {
    true: {
      bgcolor: "#e6f7ff",
      border: "rgba(0, 106, 147, 1)",
      color: "rgba(0, 106, 147, 1)"
    },
    false: {
      bgcolor: "#fafafa",
      border: "#d9d9d9",
      color: "rgba(0,0,0,0.65)"
    }
  };

  return choices[isTagSelected];
};
