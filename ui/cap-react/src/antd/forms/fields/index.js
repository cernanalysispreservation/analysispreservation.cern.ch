import CernUsers from "./cernUsers";
import ServiceGetter from "./ServiceGetter";
import CapFiles from "./CapFiles";
import TagsField from "./TagsField";
import SchemaPathSuggester from "./containers/SchemaPathSuggester";

const fields = {
  cernUsers: CernUsers,
  CapFiles: CapFiles,
  idFetcher: ServiceGetter,
  tags: TagsField,
  schemaPathSuggester: SchemaPathSuggester,
};

export default fields;
