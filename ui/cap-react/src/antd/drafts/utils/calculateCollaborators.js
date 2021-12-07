export const calculateCollaborators = access => {
  if (!access)
    return {
      users: 0,
      roles: 0,
      adminUsers: [],
      readUsers: [],
      updateUsers: [],
      allUsersEmails: []
    };

  const adminUsers = access["deposit-admin"].users.map(user => user.email);
  const readUsers = access["deposit-read"].users.map(user => user.email);
  const updateUsers = access["deposit-update"].users.map(user => user.email);
  const allRoles = [
    ...new Set(
      [...access["deposit-admin"].roles, ...access["deposit-read"].roles],
      ...access["deposit-update"].roles
    )
  ];

  const allEmails = [...new Set([...adminUsers, ...readUsers, ...updateUsers])];

  return {
    users: allEmails.length,
    roles: allRoles.length,
    adminUsers,
    readUsers,
    updateUsers,
    allUsersEmails: allEmails
  };
};
