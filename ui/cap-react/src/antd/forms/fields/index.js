import CernUsers from "./cernUsers";
import ServiceGetter from "./ServiceGetter";
import CapFiles from "./CapFiles";
import TagsField from "./TagsField";
import SchemaPathSuggester from "./containers/SchemaPathSuggester";
import ImportDataField from "./ImportDataField";

const fields = {
  cernUsers: CernUsers,
  CapFiles: CapFiles,
  idFetcher: ServiceGetter,
  tags: TagsField,
  schemaPathSuggester: SchemaPathSuggester,
  importData: ImportDataField
};

export default fields;
