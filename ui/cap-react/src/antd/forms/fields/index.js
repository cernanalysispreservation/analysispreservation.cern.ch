import CernUsers from "./cernUsers";
import ServiceGetter from "./ServiceGetter";
import TitleField from "./TitleField";
import CapFiles from "./CapFiles";
import TagsField from "./TagsField";

const fields = {
  cernUsers: CernUsers,
  CapFiles: CapFiles,
  idFetcher: ServiceGetter,
  TitleField,
  tags: TagsField,
};

export default fields;
