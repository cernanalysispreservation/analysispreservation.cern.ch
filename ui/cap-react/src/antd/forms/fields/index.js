import CernUsers from "./cernUsers";
import ServiceGetter from "./ServiceGetter";
import TitleField from "./TitleField";
import CapFiles from "./CapFiles";
import TagsField from "./TagsField";
import SchemaPathSuggester from "./containers/SchemaPathSuggester";

const fields = {
  cernUsers: CernUsers,
  CapFiles: CapFiles,
  idFetcher: ServiceGetter,
  TitleField,
  tags: TagsField,
  schemaPathSuggester: SchemaPathSuggester,
};

export default fields;
