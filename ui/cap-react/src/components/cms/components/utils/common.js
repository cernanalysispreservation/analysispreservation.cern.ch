export const shoudDisplayGuideLinePopUp = schema => {
  return schema.get("properties") && schema.get("properties").size === 0;
};
