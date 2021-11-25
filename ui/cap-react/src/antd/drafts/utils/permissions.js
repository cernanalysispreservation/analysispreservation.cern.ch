// canEdit returns when a user can edit metadata
// if the user is admin or the user has permissions to update is elgible to edit
// otherwise is just a read-only user
export const canEdit = (admin, update) => {
  if (admin || update) return true;
  return false;
};
