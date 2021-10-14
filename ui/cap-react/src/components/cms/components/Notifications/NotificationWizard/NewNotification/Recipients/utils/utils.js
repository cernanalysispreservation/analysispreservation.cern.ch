import { Map, fromJS } from "immutable";

export const getEmailList = currentRecipients => {
  // group the different cases of email lists
  let simpleEmailList = fromJS({
    mails: {
      default: [],
      formatted: []
    },
    index: ""
  });
  let methodEmailList = [];
  let checkEmailList = [];

  currentRecipients &&
    currentRecipients.map((item, index) => {
      if (item.has("checks")) checkEmailList.push({ index, mail: item });
      else if (item.has("method")) methodEmailList.push(item.get("method"));
      else if (item.has("mails"))
        simpleEmailList = Map({ index, mails: item.get("mails") });
    });

  return { simpleEmailList, checkEmailList, methodEmailList };
};

export const getEmailListForCustomConditions = selectedCheck => {
  const emails = selectedCheck.mail.get("mails");

  let results = [];
  let defaults =
    emails.has("default") &&
    emails.get("default").map(ml => fromJS({ type: "default", email: ml }));
  let formatted =
    emails.has("formatted") &&
    emails.get("formatted").map(ml => fromJS({ type: "formatted", email: ml }));

  if (formatted) results = [...results, ...formatted];
  if (defaults) results = [...results, ...defaults];

  return results;
};
