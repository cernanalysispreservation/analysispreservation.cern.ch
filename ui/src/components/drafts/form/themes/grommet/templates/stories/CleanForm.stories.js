import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import _omit from "lodash/omit";
import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import CleanForm from "../../../../CleanForm";
import store from "../../../../../../../store/configureStore";
import { Provider } from "react-redux";

import PropTypes from "prop-types";

const objschema = {
  type: "object",
  title: "Obj Title",
  description: "Obj Description",
  properties: {
    basic_info: {
      title: "Basic Information",
      required: ["analysis_title", "glance_id"],
      id: "basic_info",
      propertyOrder: 10,
      type: "object",
      properties: {
        abstract: {
          type: "string",
          title: "Abstract"
        },
        people_info: {
          items: {
            type: "object",
            properties: {
              orcid: {
                pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$",
                type: "string",
                title: "ORCID"
              },
              name: {
                type: "string",
                title: "Name"
              },
              email: {
                type: "string",
                title: "Email-Adress"
              }
            }
          },
          type: "array",
          title: "People Involved"
        },
        glance_id: {
          type: "string",
          title: "Glance ID"
        },
        analysis_title: {
          type: "string",
          title: "Analysis Title"
        }
      }
    },
    information: {
      title: "Data Input",
      required: ["analysis_title", "glance_id"],
      id: "basic_info",
      propertyOrder: 10,
      type: "object",
      properties: {
        abstract: {
          type: "string",
          title: "Abstract"
        },
        people_info: {
          items: {
            type: "object",
            properties: {
              orcid: {
                pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$",
                type: "string",
                title: "ORCID"
              },
              name: {
                type: "string",
                title: "Name"
              },
              email: {
                type: "string",
                title: "Email-Adress"
              }
            }
          },
          type: "array",
          title: "People Involved"
        },
        glance_id: {
          type: "string",
          title: "Glance ID"
        },
        analysis_title: {
          type: "string",
          title: "Analysis Title"
        }
      }
    },
    information1: {
      title: "Data Information",
      required: ["analysis_title", "glance_id"],
      id: "basic_info",
      propertyOrder: 10,
      type: "object",
      properties: {
        abstract: {
          type: "string",
          title: "Abstract"
        },
        people_info: {
          items: {
            type: "object",
            properties: {
              orcid: {
                pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$",
                type: "string",
                title: "ORCID"
              },
              name: {
                type: "string",
                title: "Name"
              },
              email: {
                type: "string",
                title: "Email-Adress"
              }
            }
          },
          type: "array",
          title: "People Involved"
        },
        glance_id: {
          type: "string",
          title: "Glance ID"
        },
        analysis_title: {
          type: "string",
          title: "Analysis Title"
        }
      }
    }
  }
};

const objschemaui = {
  "ui:options": {
    size: "large",
    align: "full",
    display: "grid"
  },
  basic_info: {
    "ui:options": {
      grid: {
        gridColumns: "3/5"
      }
    },
    // "ui:object": "accordionObjectField",
    "ui:order": ["analysis_title", "glance_id", "abstract", "people_info"],
    abstract: {
      "ui:options": {
        grid: {
          // "gridColumns":'3/ 5'
        }
      }
    },
    glance_id: {
      "ui:options": {
        grid: {
          gridColumns: "2/5"
        }
      }
    },
    analysis_title: {
      "ui:options": {
        grid: {
          gridColumns: "1/2"
        }
      }
    },
    people_info: {
      "ui:options": {
        grid: {
          gridColumns: "1 / 5"
        }
      },
      items: {
        name: {
          "ui:options": {
            autofill_from: "/api/services/orcid?name=",
            autofill_fields: [
              [["orcid"], ["basic_info", "people_info", "#", "orcid"]]
            ]
          }
        }
      }
    }
  },
  information: {
    "ui:options": {
      grid: {
        gridColumns: "1/3"
      }
    },
    // "ui:object": "accordionObjectField",
    "ui:order": ["analysis_title", "glance_id", "abstract", "people_info"],
    people_info: {
      "ui:options": {
        grid: {
          gridColumns: "1/5"
        }
      },
      items: {
        name: {
          "ui:options": {
            autofill_from: "/api/services/orcid?name=",
            autofill_fields: [
              [["orcid"], ["basic_info", "people_info", "#", "orcid"]]
            ]
          }
        }
      }
    }
  },
  information1: {
    "ui:options": {
      grid: {
        gridColumns: "1/3"
      }
    },
    // "ui:object": "accordionObjectField",
    "ui:order": ["analysis_title", "glance_id", "abstract", "people_info"],
    people_info: {
      "ui:options": {
        grid: {
          gridColumns: "1/5"
        }
      },
      items: {
        name: {
          "ui:options": {
            autofill_from: "/api/services/orcid?name=",
            autofill_fields: [
              [["orcid"], ["basic_info", "people_info", "#", "orcid"]]
            ]
          }
        }
      }
    }
  }
};

// const testSchema = {
//   $schema: "http://json-schema.org/draft-04/schema#",
//   additionalProperties: false,
//   properties: {
//     additional_resources: {
//       description:
//         "Please provide information about the additional resources of the analysis",
//       properties: {
//         documentations: {
//           id: "documentations",
//           items: {
//             description: "Add documentation",
//             properties: {
//               title: {
//                 title: "Title",
//                 type: "string"
//               },
//               url: {
//                 title: "URL",
//                 type: "string"
//               }
//             },
//             type: "object"
//           },
//           title: "Documentations",
//           type: "array"
//         },
//         internal_discussions: {
//           id: "internal-discussions",
//           items: {
//             properties: {
//               meeting: {
//                 title: "eGroup",
//                 type: "string"
//               },
//               title: {
//                 title: "Title",
//                 type: "string"
//               },
//               url: {
//                 title: "URL",
//                 type: "string"
//               }
//             },
//             type: "object"
//           },
//           title: "Internal Discussions",
//           type: "array"
//         },
//         presentations: {
//           id: "presentations",
//           items: {
//             properties: {
//               meeting: {
//                 title: "Meeting (GROUP)",
//                 type: "string"
//               },
//               title: {
//                 title: "Title",
//                 type: "string"
//               },
//               url: {
//                 title: "URL",
//                 type: "string"
//               }
//             },
//             type: "object"
//           },
//           title: "Presentations",
//           type: "array"
//         },
//         publications: {
//           id: "publications",
//           items: {
//             properties: {
//               analysis_number: {
//                 title: "Analysis Note (ANA)",
//                 type: "string"
//               },
//               arxiv_id: {
//                 title: "ArXiv ID",
//                 type: "string"
//               },
//               conf_report: {
//                 title: "Conference Report (CONF)",
//                 type: "string"
//               },
//               public_paper: {
//                 title: "Public Paper",
//                 type: "string"
//               },
//               review_egroup: {
//                 title: "Review Group",
//                 type: "string"
//               },
//               roles: {
//                 title: "Roles",
//                 type: "string"
//               },
//               twiki: {
//                 title: "TWiki Page",
//                 type: "string"
//               },
//               url: {
//                 title: "URL",
//                 type: "string"
//               }
//             },
//             type: "object"
//           },
//           title: "Publications",
//           type: "array"
//         }
//       },
//       title: "Additional Resources",
//       type: "object"
//     },
//     basic_info: {
//       description:
//         "Please provide some information relevant for all parts of the Analysis here",
//       id: "basic_info",
//       properties: {
//         analysis_proponents: {
//           items: {
//             properties: {
//               name: {
//                 title: "Name",
//                 type: "string"
//               },
//               orcid: {
//                 pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$",
//                 title: "ORCID",
//                 type: "string"
//               }
//             },
//             type: "object"
//           },
//           title: "Proponents",
//           type: "array"
//         },
//         analysis_status: {
//           enum: [
//             "None",
//             "0 - planned / open topic",
//             "1 - in preparation",
//             "2 - ANA note released",
//             "3 - review committee",
//             "4 - collaboration review",
//             "5 -",
//             "6 - CONF note published",
//             "7 -",
//             "8 - journal review",
//             "9 - PAPER published",
//             "x - other"
//           ],
//           title: "Status",
//           type: "string"
//         },
//         analysis_title: {
//           title: "Analysis Name",
//           type: "string"
//         },
//         institutes: {
//           enum: [
//             "None",
//             "IFT",
//             "B_Q",
//             "BDC",
//             "DP",
//             "CD",
//             "QEE",
//             "RD",
//             "Charm",
//             "SLB",
//             "B2OC"
//           ],
//           title: "Institutes Involved",
//           type: "string"
//         },
//         keywords: {
//           id: "keywords",
//           title: "Keywords",
//           type: "string"
//         },
//         measurement: {
//           title: "Measurement",
//           type: "string"
//         },
//         review_egroup: {
//           title: "Review eGroup",
//           type: "string"
//         },
//         reviewers: {
//           items: {
//             properties: {
//               name: {
//                 title: "Name",
//                 type: "string"
//               },
//               orcid: {
//                 pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$",
//                 title: "ORCID",
//                 type: "string"
//               }
//             },
//             type: "object"
//           },
//           title: "Reviewers",
//           type: "array"
//         }
//       },
//       title: "Basic Information",
//       type: "object"
//     },
//     control_number: {
//       type: "string"
//     },
//     general_title: {
//       type: "string"
//     },
//     ntuple_userdst_production: {
//       description: "Please provide information about the steps of the analysis",
//       items: {
//         properties: {
//           davinci_scripts: {
//             items: {
//               type: "string",
//               "x-cap-file": {}
//             },
//             title: "DaVinci Scripts",
//             type: "array"
//           },
//           davinci_version: {
//             title: "DaVinci Version",
//             type: "string"
//           },
//           ganga_scripts: {
//             items: {
//               type: "string",
//               "x-cap-file": {}
//             },
//             title: "Ganga Scripts",
//             type: "array"
//           },
//           input_dataset: {
//             title: "Input Dataset",
//             type: "string"
//           },
//           name: {
//             title: "Custom name",
//             type: "string"
//           },
//           output_eos_location: {
//             title: "Output EOS Location",
//             type: "string"
//           },
//           platform: {
//             title: "Platform",
//             type: "string"
//           },
//           wg_production_bk_path: {
//             title: "WG Production Bookkeeping Path",
//             type: "string"
//           }
//         },
//         type: "object"
//       },
//       title: "ntuple/userDST-production",
//       type: "array"
//     },
//     stripping_turbo_selection: {
//       items: {
//         properties: {
//           bookkeping_locations: {
//             items: {
//               type: "string"
//             },
//             title: "Bookkeeping Locations",
//             type: "array"
//           },
//           dataset_type: {
//             enum: ["mc_data", "real_data"],
//             title: "Type of Dataset",
//             type: "string"
//           },
//           name: {
//             title: "Custom Name",
//             type: "string"
//           },
//           stripping_turbo_line: {
//             title: "Stripping/TURBO Line",
//             type: "string"
//           }
//         },
//         type: "object"
//       },
//       title: "Stripping/Turbo Selections",
//       type: "array"
//     },
//     user_analysis: {
//       properties: {
//         additional_repos: {
//           items: {
//             type: "string"
//           },
//           title: "Additional Repositories",
//           type: "array"
//         },
//         basic_scripts: {
//           properties: {
//             command: {
//               title: "Command to execute code",
//               type: "string"
//             },
//             scripts: {
//               items: {
//                 type: "string",
//                 "x-cap-file": {}
//               },
//               title: "Files/Scripts",
//               type: "array"
//             }
//           },
//           title: "Basic scripts",
//           type: "object"
//         },
//         docker_registries: {
//           items: {
//             type: "string",
//             "x-cap-file": {}
//           },
//           title: "Docker images of the analysis",
//           type: "array"
//         },
//         gitlab_links: {
//           items: {
//             type: "string",
//             "x-cap-file": {}
//           },
//           title: "Gitlab repositories of the analysis",
//           type: "array"
//         }
//       },
//       title: "User Analysis",
//       type: "object"
//     }
//   },
//   title: "LHCb Analysis",
//   type: "object"
// };

// const testSchemaUi = {
//   "ui:options": {
//     size: "xxlarge",
//     align: "center",
//     display: "grid"
//   },
//   additional_resources: {
//     documentations: {
//       items: {
//         "ui:options": {
//           stringify: ["title"]
//         }
//       }
//     },
//     internal_discussions: {
//       items: {
//         "ui:options": {
//           stringify: ["title"]
//         },
//         "ui:order": ["title", "url", "meeting"]
//       }
//     },
//     presentations: {
//       items: {
//         "ui:options": {
//           stringify: ["title"]
//         },
//         "ui:order": ["title", "url", "meeting"]
//       }
//     },
//     publications: {
//       items: {
//         "ui:options": {
//           stringify: ["analysis_number"]
//         }
//       }
//     },
//     "ui:object": "accordionObjectField",
//     "ui:order": [
//       "internal_discussions",
//       "presentations",
//       "publications",
//       "documentations"
//     ]
//   },
//   basic_info: {
//     analysis_proponents: {
//       items: {
//         name: {
//           "ui:options": {
//             autofill_fields: [
//               [["orcid"], ["basic_info", "analysis_proponents", "#", "orcid"]]
//             ],
//             autofill_from: "/api/orcid?name="
//           }
//         },
//         "ui:options": {
//           stringify: ["name"]
//         }
//       }
//     },
//     analysis_title: {
//       "ui:options": {
//         autofill_fields: [
//           [["measurement"], ["basic_info", "measurement"]],
//           [["status"], ["basic_info", "analysis_status"]],
//           [["egroup"], ["basic_info", "review_egroup"]],
//           [["wg"], ["basic_info", "institutes"]]
//         ],
//         autofill_from: "/api/lhcb/analysis/details?title=",
//         suggestions: "/api/lhcb/analysis?query="
//       }
//     },
//     reviewers: {
//       items: {
//         name: {
//           "ui:options": {
//             autofill_fields: [
//               [["orcid"], ["basic_info", "reviewers", "#", "orcid"]]
//             ],
//             autofill_from: "/api/orcid?name="
//           }
//         },
//         "ui:options": {
//           stringify: ["name"]
//         }
//       }
//     },
//     "ui:object": "accordionObjectField",
//     "ui:order": [
//       "analysis_title",
//       "measurement",
//       "analysis_proponents",
//       "reviewers",
//       "review_egroup",
//       "analysis_status",
//       "institutes",
//       "keywords"
//     ]
//   },
//   ntuple_userdst_production: {
//     items: {
//       davinci_scripts: {
//         items: {
//           "ui:field": "CapFiles"
//         }
//       },
//       ganga_scripts: {
//         items: {
//           "ui:field": "CapFiles"
//         }
//       },
//       "ui:order": [
//         "name",
//         "input_dataset",
//         "platform",
//         "davinci_version",
//         "output_eos_location",
//         "wg_production_bk_path",
//         "davinci_scripts",
//         "ganga_scripts"
//       ]
//     },
//     "ui:array": "AccordionArrayField"
//   },
//   stripping_turbo_selection: {
//     items: {
//       bookkeping_locations: {
//         "ui:array": "StringArrayField"
//       },
//       "ui:order": [
//         "dataset_type",
//         "name",
//         "stripping_turbo_line",
//         "bookkeping_locations"
//       ]
//     },
//     "ui:array": "AccordionArrayField"
//   },
//   "ui:order": [
//     "basic_info",
//     "stripping_turbo_selection",
//     "ntuple_userdst_production",
//     "user_analysis",
//     "additional_resources",
//     "*"
//   ],
//   user_analysis: {
//     additional_repos: {
//       items: {
//         "ui:field": "CapFiles"
//       }
//     },
//     basic_scripts: {
//       scripts: {
//         items: {
//           "ui:field": "CapFiles"
//         }
//       }
//     },
//     docker_registries: {
//       items: {
//         "ui:field": "CapFiles"
//       }
//     },
//     gitlab_links: {
//       items: {
//         "ui:field": "CapFiles"
//       }
//     },
//     "ui:object": "accordionObjectField",
//     "ui:order": [
//       "gitlab_links",
//       "docker_registries",
//       "additional_repos",
//       "basic_scripts"
//     ]
//   }
// };

const schemaCMS = {
  $schema: "http://json-schema.org/draft-04/schema#",
  additionalProperties: true,
  dependencies: {
    analysis_reuse_mode: {
      properties: {
        auxiliary_measurements: {
          description:
            "Provide details on auxiliary measurements used in the analysis",
          items: {
            properties: {
              links: {
                description: "Code for auxiliary measurements",
                items: {
                  type: "string",
                  "x-cap-file": {}
                },
                title: "Your code",
                type: "array"
              },
              type: {
                enum: [
                  "trigger_efficiencies",
                  "background_measurements",
                  "systematic_uncertainties",
                  "mc_scale_factors",
                  "object_efficiencies",
                  "rates",
                  "acceptance_corrections",
                  "other"
                ],
                title: "Type",
                type: "string"
              }
            },
            type: "object"
          },
          title: "Auxiliary Measurements",
          type: "array"
        },
        background_estimations: {
          description: "Details on the background estimation methods",
          items: {
            $schema: "http://json-schema.org/draft-04/schema#",
            properties: {
              control_regions: {
                description: "Details on control regions definition",
                items: {
                  properties: {
                    physics_objects: {
                      description:
                        "Physics objects selection in control region",
                      items: {
                        $schema: "http://json-schema.org/draft-04/schema#",
                        id: "physics_object",
                        properties: {
                          electron_type: {
                            enum: ["GsfElectron"],
                            title: "Electron type",
                            type: "string"
                          },
                          eta_cut: {
                            title: "eta cut",
                            type: "number"
                          },
                          eta_cut_max: {
                            title: "eta cut max",
                            type: "number"
                          },
                          eta_cut_min: {
                            title: "eta cut min",
                            type: "number"
                          },
                          jet_type: {
                            enum: [
                              "AK4PF",
                              "AK5PF",
                              "AK6PF",
                              "AK7PF",
                              "AK8PF",
                              "AK4Calo",
                              "AK5Calo",
                              "AK6Calo",
                              "AK7Calo",
                              "AK8Calo",
                              "KT4PF",
                              "KT5PF",
                              "KT6PF",
                              "KT7PF",
                              "KT8PF",
                              "KT4Calo",
                              "KT5Calo",
                              "KT6Calo",
                              "KT7Calo",
                              "KT8Calo"
                            ],
                            title: "Jet type",
                            type: "string"
                          },
                          met_type: {
                            enum: ["PFMET", "CaloMET"],
                            title: "MET type",
                            type: "string"
                          },
                          muon_type: {
                            enum: ["PFMuon", "GlobalMuon", "TrackerMuon"],
                            title: "Muon type",
                            type: "string"
                          },
                          number: {
                            properties: {
                              number: {
                                title: "Number",
                                type: "number"
                              },
                              sign: {
                                default: "=",
                                enum: ["<", ">", "=", "<=", ">="],
                                title: "<, >, =, <=, >=",
                                type: "string"
                              }
                            },
                            title: "",
                            type: "object"
                          },
                          object: {
                            enum: [
                              "",
                              "electron",
                              "muon",
                              "tau",
                              "jet",
                              "bjet",
                              "photon",
                              "track",
                              "vertex",
                              "MET",
                              "HT"
                            ],
                            title: "Object",
                            type: "string"
                          },
                          photon_type: {
                            enum: ["Photon", "Conversion"],
                            title: "Photon type",
                            type: "string"
                          },
                          pt_cut: {
                            title: "pt cut",
                            type: "number"
                          },
                          pt_cut_max: {
                            title: "pt cut max",
                            type: "number"
                          },
                          pt_cut_min: {
                            title: "pt cut min",
                            type: "number"
                          },
                          sel_criteria: {
                            enum: ["tight", "medium", "loose", "other"],
                            title: "Selection Criteria",
                            type: "string"
                          },
                          tau_type: {
                            enum: ["PFTau"],
                            title: "Tau type",
                            type: "string"
                          },
                          track_type: {
                            enum: ["Heavy-Ion", "pp"],
                            title: "Track type",
                            type: "string"
                          }
                        },
                        type: "object"
                      },
                      title: "Physics Objects",
                      type: "array"
                    },
                    veto: {
                      description: "Physics objects vetoed in control region",
                      items: {
                        $schema: "http://json-schema.org/draft-04/schema#",
                        id: "physics_object",
                        properties: {
                          electron_type: {
                            enum: ["GsfElectron"],
                            title: "Electron type",
                            type: "string"
                          },
                          eta_cut: {
                            title: "eta cut",
                            type: "number"
                          },
                          eta_cut_max: {
                            title: "eta cut max",
                            type: "number"
                          },
                          eta_cut_min: {
                            title: "eta cut min",
                            type: "number"
                          },
                          jet_type: {
                            enum: [
                              "AK4PF",
                              "AK5PF",
                              "AK6PF",
                              "AK7PF",
                              "AK8PF",
                              "AK4Calo",
                              "AK5Calo",
                              "AK6Calo",
                              "AK7Calo",
                              "AK8Calo",
                              "KT4PF",
                              "KT5PF",
                              "KT6PF",
                              "KT7PF",
                              "KT8PF",
                              "KT4Calo",
                              "KT5Calo",
                              "KT6Calo",
                              "KT7Calo",
                              "KT8Calo"
                            ],
                            title: "Jet type",
                            type: "string"
                          },
                          met_type: {
                            enum: ["PFMET", "CaloMET"],
                            title: "MET type",
                            type: "string"
                          },
                          muon_type: {
                            enum: ["PFMuon", "GlobalMuon", "TrackerMuon"],
                            title: "Muon type",
                            type: "string"
                          },
                          number: {
                            properties: {
                              number: {
                                title: "Number",
                                type: "number"
                              },
                              sign: {
                                default: "=",
                                enum: ["<", ">", "=", "<=", ">="],
                                title: "<, >, =, <=, >=",
                                type: "string"
                              }
                            },
                            title: "",
                            type: "object"
                          },
                          object: {
                            enum: [
                              "",
                              "electron",
                              "muon",
                              "tau",
                              "jet",
                              "bjet",
                              "photon",
                              "track",
                              "vertex",
                              "MET",
                              "HT"
                            ],
                            title: "Object",
                            type: "string"
                          },
                          photon_type: {
                            enum: ["Photon", "Conversion"],
                            title: "Photon type",
                            type: "string"
                          },
                          pt_cut: {
                            title: "pt cut",
                            type: "number"
                          },
                          pt_cut_max: {
                            title: "pt cut max",
                            type: "number"
                          },
                          pt_cut_min: {
                            title: "pt cut min",
                            type: "number"
                          },
                          sel_criteria: {
                            enum: ["tight", "medium", "loose", "other"],
                            title: "Selection Criteria",
                            type: "string"
                          },
                          tau_type: {
                            enum: ["PFTau"],
                            title: "Tau type",
                            type: "string"
                          },
                          track_type: {
                            enum: ["Heavy-Ion", "pp"],
                            title: "Track type",
                            type: "string"
                          }
                        },
                        type: "object"
                      },
                      title: "Vetos",
                      type: "array"
                    }
                  },
                  title: "Event Selection",
                  type: "object"
                },
                title: "Control Regions",
                type: "array"
              },
              method: {
                enum: [
                  "directly_from_mc_simulation",
                  "shape_from_mc_simulation_and_normalization_from_control_regions",
                  "shape_and_normalization_from_control_regions"
                ],
                title: "Estimation Method",
                type: "string"
              },
              samples: {
                description: "Provide all necessary samples from DAS",
                items: {
                  type: "string"
                },
                title: "Samples",
                type: "array"
              },
              type: {
                description: "Type of background process (TTbar, DY, fakes...)",
                title: "Type",
                type: "string"
              }
            },
            type: "object"
          },
          title: "Background Estimation",
          type: "array"
        },
        final_results: {
          description:
            "Please provide information necessary to generate final plots and tables for your analysis.",
          properties: {
            code_base: {
              description: "Include your code for n-tuple production",
              title: "Your Code",
              type: "string",
              "x-cap-file": {}
            },
            processing_steps: {
              $schema: "http://json-schema.org/draft-04/schema#",
              items: {
                properties: {
                  configuration_file: {
                    description: "e.g. my_job_config.py",
                    title: "Configuration File",
                    type: "string",
                    "x-cap-file": {}
                  },
                  output_data: {
                    description: "e.g. myfile-data.root",
                    title: "Output",
                    type: "string",
                    "x-cap-file": {}
                  },
                  run_instructions: {
                    description: "e.g. README.md",
                    title: "Run Instructions",
                    type: "string",
                    "x-cap-file": {}
                  }
                },
                title: "Add Processing Step",
                type: "object"
              },
              required: [
                "configuration_file",
                "run_instructions",
                "output_data"
              ],
              title: "Processing Steps",
              type: "array"
            }
          },
          title: "Final Results",
          type: "object"
        },
        main_measurements: {
          description:
            "Please provide information about the main measurements of your analysis",
          id: "main_measurements",
          items: {
            $schema: "http://json-schema.org/draft-04/schema#",
            description: "Information concerning the state of the detector",
            properties: {
              analysis_code: {
                title: "Analysis Code",
                type: "string",
                "x-cap-file": {}
              },
              description: {
                title: "Measurement Description",
                type: "string"
              },
              detailed_desciption: {
                title: "Detailed Description",
                type: "string"
              },
              processing_steps: {
                $schema: "http://json-schema.org/draft-04/schema#",
                items: {
                  properties: {
                    configuration_file: {
                      description: "e.g. my_job_config.py",
                      title: "Configuration File",
                      type: "string",
                      "x-cap-file": {}
                    },
                    output_data: {
                      description: "e.g. myfile-data.root",
                      title: "Output",
                      type: "string",
                      "x-cap-file": {}
                    },
                    run_instructions: {
                      description: "e.g. README.md",
                      title: "Run Instructions",
                      type: "string",
                      "x-cap-file": {}
                    }
                  },
                  title: "Add Processing Step",
                  type: "object"
                },
                required: [
                  "configuration_file",
                  "run_instructions",
                  "output_data"
                ],
                title: "Processing Steps",
                type: "array"
              },
              signal_event_selection: {
                properties: {
                  physics_objects: {
                    items: {
                      $schema: "http://json-schema.org/draft-04/schema#",
                      id: "physics_object",
                      properties: {
                        electron_type: {
                          enum: ["GsfElectron"],
                          title: "Electron type",
                          type: "string"
                        },
                        eta_cut: {
                          title: "eta cut",
                          type: "number"
                        },
                        eta_cut_max: {
                          title: "eta cut max",
                          type: "number"
                        },
                        eta_cut_min: {
                          title: "eta cut min",
                          type: "number"
                        },
                        jet_type: {
                          enum: [
                            "AK4PF",
                            "AK5PF",
                            "AK6PF",
                            "AK7PF",
                            "AK8PF",
                            "AK4Calo",
                            "AK5Calo",
                            "AK6Calo",
                            "AK7Calo",
                            "AK8Calo",
                            "KT4PF",
                            "KT5PF",
                            "KT6PF",
                            "KT7PF",
                            "KT8PF",
                            "KT4Calo",
                            "KT5Calo",
                            "KT6Calo",
                            "KT7Calo",
                            "KT8Calo"
                          ],
                          title: "Jet type",
                          type: "string"
                        },
                        met_type: {
                          enum: ["PFMET", "CaloMET"],
                          title: "MET type",
                          type: "string"
                        },
                        muon_type: {
                          enum: ["PFMuon", "GlobalMuon", "TrackerMuon"],
                          title: "Muon type",
                          type: "string"
                        },
                        number: {
                          properties: {
                            number: {
                              title: "Number",
                              type: "number"
                            },
                            sign: {
                              default: "=",
                              enum: ["<", ">", "=", "<=", ">="],
                              title: "<, >, =, <=, >=",
                              type: "string"
                            }
                          },
                          title: "",
                          type: "object"
                        },
                        object: {
                          enum: [
                            "",
                            "electron",
                            "muon",
                            "tau",
                            "jet",
                            "bjet",
                            "photon",
                            "track",
                            "vertex",
                            "MET",
                            "HT"
                          ],
                          title: "Object",
                          type: "string"
                        },
                        photon_type: {
                          enum: ["Photon", "Conversion"],
                          title: "Photon type",
                          type: "string"
                        },
                        pt_cut: {
                          title: "pt cut",
                          type: "number"
                        },
                        pt_cut_max: {
                          title: "pt cut max",
                          type: "number"
                        },
                        pt_cut_min: {
                          title: "pt cut min",
                          type: "number"
                        },
                        sel_criteria: {
                          enum: ["tight", "medium", "loose", "other"],
                          title: "Selection Criteria",
                          type: "string"
                        },
                        tau_type: {
                          enum: ["PFTau"],
                          title: "Tau type",
                          type: "string"
                        },
                        track_type: {
                          enum: ["Heavy-Ion", "pp"],
                          title: "Track type",
                          type: "string"
                        }
                      },
                      type: "object"
                    },
                    title: "Physics Objects",
                    type: "array"
                  },
                  veto: {
                    items: {
                      $schema: "http://json-schema.org/draft-04/schema#",
                      id: "physics_object",
                      properties: {
                        electron_type: {
                          enum: ["GsfElectron"],
                          title: "Electron type",
                          type: "string"
                        },
                        eta_cut: {
                          title: "eta cut",
                          type: "number"
                        },
                        eta_cut_max: {
                          title: "eta cut max",
                          type: "number"
                        },
                        eta_cut_min: {
                          title: "eta cut min",
                          type: "number"
                        },
                        jet_type: {
                          enum: [
                            "AK4PF",
                            "AK5PF",
                            "AK6PF",
                            "AK7PF",
                            "AK8PF",
                            "AK4Calo",
                            "AK5Calo",
                            "AK6Calo",
                            "AK7Calo",
                            "AK8Calo",
                            "KT4PF",
                            "KT5PF",
                            "KT6PF",
                            "KT7PF",
                            "KT8PF",
                            "KT4Calo",
                            "KT5Calo",
                            "KT6Calo",
                            "KT7Calo",
                            "KT8Calo"
                          ],
                          title: "Jet type",
                          type: "string"
                        },
                        met_type: {
                          enum: ["PFMET", "CaloMET"],
                          title: "MET type",
                          type: "string"
                        },
                        muon_type: {
                          enum: ["PFMuon", "GlobalMuon", "TrackerMuon"],
                          title: "Muon type",
                          type: "string"
                        },
                        number: {
                          properties: {
                            number: {
                              title: "Number",
                              type: "number"
                            },
                            sign: {
                              default: "=",
                              enum: ["<", ">", "=", "<=", ">="],
                              title: "<, >, =, <=, >=",
                              type: "string"
                            }
                          },
                          title: "",
                          type: "object"
                        },
                        object: {
                          enum: [
                            "",
                            "electron",
                            "muon",
                            "tau",
                            "jet",
                            "bjet",
                            "photon",
                            "track",
                            "vertex",
                            "MET",
                            "HT"
                          ],
                          title: "Object",
                          type: "string"
                        },
                        photon_type: {
                          enum: ["Photon", "Conversion"],
                          title: "Photon type",
                          type: "string"
                        },
                        pt_cut: {
                          title: "pt cut",
                          type: "number"
                        },
                        pt_cut_max: {
                          title: "pt cut max",
                          type: "number"
                        },
                        pt_cut_min: {
                          title: "pt cut min",
                          type: "number"
                        },
                        sel_criteria: {
                          enum: ["tight", "medium", "loose", "other"],
                          title: "Selection Criteria",
                          type: "string"
                        },
                        tau_type: {
                          enum: ["PFTau"],
                          title: "Tau type",
                          type: "string"
                        },
                        track_type: {
                          enum: ["Heavy-Ion", "pp"],
                          title: "Track type",
                          type: "string"
                        }
                      },
                      type: "object"
                    },
                    title: "Vetos",
                    type: "array"
                  }
                },
                title: "Signal Event Selection",
                type: "object"
              }
            },
            title: "Detector State",
            type: "object"
          },
          title: "Main Measurements Workflows",
          type: "array"
        },
        systematic_uncertainties: {
          description: "Details on the systematic uncertainties",
          items: {
            properties: {
              physics_object: {
                description: "Choose from objects defined in main measurements",
                title: "Physics Object",
                type: "string"
              },
              statement: {
                title: "Statement about the most important systematics",
                type: "string"
              },
              type: {
                enum: [
                  "associated_to_obj",
                  "associated_to_background_pred_methods",
                  "associated_to_mc_production",
                  "assocciated_to_luminosity",
                  "statement_about_most_important_systematics"
                ],
                title: "Type",
                type: "string"
              }
            },
            type: "object"
          },
          title: "Systematic Uncertainties",
          type: "array"
        }
      }
    }
  },
  properties: {
    $ana_type: {
      type: "string"
    },
    $schema: {
      type: "string"
    },
    _access: {
      properties: {
        "deposit-admin": {
          properties: {
            roles: {
              items: {
                type: "number"
              },
              type: "array"
            },
            users: {
              items: {
                type: "number"
              },
              type: "array"
            }
          },
          type: "object"
        },
        "deposit-read": {
          properties: {
            roles: {
              items: {
                type: "number"
              },
              type: "array"
            },
            users: {
              items: {
                type: "number"
              },
              type: "array"
            }
          },
          type: "object"
        },
        "deposit-update": {
          properties: {
            roles: {
              items: {
                type: "number"
              },
              type: "array"
            },
            users: {
              items: {
                type: "number"
              },
              type: "array"
            }
          },
          type: "object"
        }
      },
      type: "object"
    },
    _buckets: {
      properties: {
        deposit: {
          description: "Deposit bucket ID.",
          type: "string"
        },
        record: {
          description: "Record bucket ID.",
          type: "string"
        }
      },
      type: "object"
    },
    _deposit: {
      name: "_deposit",
      properties: {
        created_by: {
          name: "created_by",
          type: "integer"
        },
        id: {
          name: "id",
          type: "string"
        },
        owners: {
          items: [
            {
              type: "integer"
            }
          ],
          name: "owners",
          type: "array"
        },
        pid: {
          name: "pid",
          properties: {
            revision_id: {
              type: "integer"
            },
            type: {
              type: "string"
            },
            value: {
              type: "string"
            }
          },
          type: "object"
        },
        status: {
          enum: ["draft", "published"],
          name: "status",
          type: "string"
        }
      },
      required: ["id"],
      type: "object"
    },
    _experiment: {
      type: "string"
    },
    _files: {
      items: {
        description: "Describe information needed for files in records.",
        properties: {
          bucket: {
            type: "string"
          },
          key: {
            type: "string"
          },
          size: {
            type: "integer"
          },
          type: {
            description: "File type extension.",
            type: "string"
          },
          version_id: {
            type: "string"
          }
        },
        type: "object"
      },
      type: "array"
    },
    additional_resources: {
      description: "Add any useful additional documentation on the analysis",
      properties: {
        comments: {
          title: "Additional comment",
          type: "string"
        },
        documentations: {
          description: "Add any useful additional documentation",
          id: "documentations",
          items: {
            type: "string",
            "x-cap-file": {}
          },
          title: "Additional Documentations",
          type: "array"
        },
        internal_discussions: {
          description: "Link to hypernews thread",
          id: "internal-discussions",
          items: {
            title: "URL",
            type: "string"
          },
          title: "Internal Discussions",
          type: "array"
        },
        keywords: {
          id: "keywords",
          title: "Keywords",
          type: "string"
        },
        presentations: {
          description: "Upload presentations about the analysis",
          id: "presentations",
          items: {
            properties: {
              conference: {
                title: "Conference/meeting",
                type: "string"
              },
              items: {
                title: "Presentation",
                type: "string",
                "x-cap-file": {}
              }
            },
            type: "object"
          },
          title: "Presentations",
          type: "array"
        },
        publications: {
          description: "Add references to related publications",
          id: "publications",
          items: {
            $schema: "http://json-schema.org/draft-04/schema#",
            description: "Add publications",
            properties: {
              journal_issue: {
                title: "Journal Issue",
                type: "integer"
              },
              journal_page: {
                title: "Journal Page",
                type: "integer"
              },
              journal_title: {
                title: "Journal Title",
                type: "string"
              },
              journal_volume: {
                title: "Journal Volume",
                type: "integer"
              },
              journal_year: {
                title: "Journal Year",
                type: "integer"
              },
              persistent_identifiers: {
                items: {
                  type: "string"
                },
                title: "Identifiers",
                type: "array"
              }
            },
            title: "Internal Publication",
            type: "object"
          },
          title: "Publications",
          type: "array"
        }
      },
      title: "Additional Resources",
      type: "object"
    },
    analysis_reuse_mode: {
      description:
        "please turn this mode on if you want to capture additional information about main and auxiliary measurements, systematic uncertainties, background estimates, final state particles",
      title: "Full reproducibility mode",
      type: "string"
    },
    basic_info: {
      description:
        "Please provide some information relevant for all parts of the Analysis here",
      id: "basic_info",
      properties: {
        abstract: {
          title: "Abstract",
          type: "string"
        },
        ana_notes: {
          items: {
            pattern: "^AN-[0-9]{4}/[0-9]{3}$",
            placeholder: "e.g. AN-2010-107",
            type: "string"
          },
          title: "Analysis Notes",
          type: "array"
        },
        cadi_id: {
          pattern: "^[A-Za-z0-9]{3}-[0-9]{2}-[0-9]{3}$",
          placeholder: "e.g. JME-10-107",
          title: "CADI ID",
          type: "string"
        },
        conclusion: {
          title: "Conclusion",
          type: "string"
        }
      },
      title: "Basic Information",
      type: "object"
    },
    cadi_info: {
      $schema: "http://json-schema.org/draft-04/schema#",
      description: "Automatically taken from CADI, based on CADI ID",
      id: "cadi_info",
      properties: {
        contact: {
          title: "Contact Person",
          type: "string"
        },
        created: {
          title: "Created",
          type: "string"
        },
        description: {
          title: "Description",
          type: "string"
        },
        name: {
          title: "Name",
          type: "string"
        },
        paper: {
          title: "Paper",
          type: "string"
        },
        pas: {
          title: "PAS",
          type: "string"
        },
        publication_status: {
          title: "Publication Status",
          type: "string"
        },
        status: {
          title: "Status",
          type: "string"
        },
        twiki: {
          title: "Twiki",
          type: "string"
        }
      },
      title: "Information from CADI database",
      type: "object"
    },
    control_number: {
      type: "string"
    },
    general_title: {
      type: "string"
    },
    input_data: {
      description:
        "Please list all datasets and triggers relevant for your analysis here",
      id: "input_data",
      properties: {
        json_files: {
          items: {
            type: "string",
            "x-cap-file": {}
          },
          title: "Official JSON files",
          type: "array"
        },
        mc_bg_datasets: {
          description: "Please list all Monte Carlo Background datasets",
          id: "mc_bg_datasets",
          items: {
            placeholder: "Path",
            type: "string"
          },
          title: "Monte Carlo Background Datasets",
          type: "array"
        },
        mc_sig_datasets: {
          description: "Please list all Monte Carlo Signal datasets",
          id: "mc_sig_datasets",
          items: {
            placeholder: "Path",
            type: "string"
          },
          title: "Monte Carlo Signal Datasets",
          type: "array"
        },
        primary_datasets: {
          description: "Please list all primary datasets here",
          id: "primary_datasets",
          items: {
            properties: {
              path: {
                title: "Path",
                type: "string"
              },
              ranges: {
                properties: {
                  max: {
                    title: "Max",
                    type: "number"
                  },
                  min: {
                    title: "Min",
                    type: "number"
                  }
                },
                title: "Ranges",
                type: "object"
              },
              triggers: {
                description: "Add selection triggers here",
                id: "triggers",
                items: {
                  properties: {
                    prescale: {
                      title: "Prescale",
                      type: "number"
                    },
                    trigger: {
                      title: "Trigger",
                      type: "string"
                    }
                  },
                  type: "object"
                },
                title: "Triggers",
                type: "array"
              }
            },
            type: "object"
          },
          title: "Primary Datasets",
          type: "array"
        }
      },
      title: "Input Data",
      type: "object"
    },
    ntuples_production: {
      description: "Provide details on the intermediate n-tuples production",
      id: "ntuples_production",
      items: {
        description: "Add instructions to run your code",
        properties: {
          code_base: {
            description: "Include your code for n-tuple production",
            title: "Your Code",
            type: "string",
            "x-cap-file": {}
          },
          processing_steps: {
            $schema: "http://json-schema.org/draft-04/schema#",
            items: {
              properties: {
                configuration_file: {
                  description: "e.g. my_job_config.py",
                  title: "Configuration File",
                  type: "string",
                  "x-cap-file": {}
                },
                output_data: {
                  description: "e.g. myfile-data.root",
                  title: "Output",
                  type: "string",
                  "x-cap-file": {}
                },
                run_instructions: {
                  description: "e.g. README.md",
                  title: "Run Instructions",
                  type: "string",
                  "x-cap-file": {}
                }
              },
              title: "Add Processing Step",
              type: "object"
            },
            required: ["configuration_file", "run_instructions", "output_data"],
            title: "Processing Steps",
            type: "array"
          }
        },
        title: "",
        type: "object"
      },
      title: "N-tuples Production",
      type: "array"
    },
    statistical_treatment: {
      properties: {
        combine_datacard: {
          description: "Add final combine datacards of the analysis",
          title: "Combine Datacard File",
          type: "string",
          "x-cap-file": {}
        },
        statistics_questionnaire: {
          properties: {
            $ref: {
              type: "string"
            }
          },
          title: "Statistics Questionnare"
        }
      },
      title: "Statistical Treatment",
      type: "object"
    }
  },
  title: "CMS Analysis - Draft",
  type: "object"
};

const schemaCMSUI = {
  "ui:options": {
    display: "grid",
    size: "xlarge",
    align: "center"
  },
  additional_resources: {
    "ui:options": {
      grid: {
        gridColumns: "1/3"
      }
    },
    documentations: {
      items: {
        "ui:field": "CapFiles"
      }
    },
    internal_discussions: {
      "ui:array": "StringArrayField"
    },
    presentations: {
      items: {
        items: {
          "ui:field": "CapFiles"
        },
        "ui:options": {
          stringify: ["conference"]
        }
      }
    },
    publications: {
      items: {
        persistent_identifiers: {
          "ui:array": "StringArrayField"
        },
        "ui:options": {
          stringify: ["journal_title"]
        }
      }
    },
    "ui:object": "accordionObjectField",
    "ui:order": [
      "presentations",
      "internal_discussions",
      "documentations",
      "publications",
      "keywords",
      "*"
    ]
  },
  analysis_reuse_mode: {
    "ui:widget": "switch"
  },
  auxiliary_measurements: {
    items: {
      links: {
        items: {
          "ui:field": "CapFiles"
        }
      },
      "ui:order": ["type", "links"]
    },
    "ui:array": "AccordionArrayField"
  },
  background_estimations: {
    items: {
      control_regions: {
        items: {
          physics_objects: {
            items: {
              "ui:order": ["number", "object", "pt_cut", "eta_cut", "*"]
            }
          },
          veto: {
            items: {
              "ui:order": ["number", "object", "pt_cut", "eta_cut", "*"]
            }
          }
        },
        "ui:array": "AccordionArrayField"
      },
      samples: {
        "ui:array": "StringArrayField"
      },
      "ui:order": ["control_regions", "samples", "type", "method"]
    },
    "ui:array": "AccordionArrayField"
  },
  basic_info: {
    "ui:options": {
      grid: {
        gridColumns: "1/3"
      },
      display: "grid"
    },
    abstract: {
      "ui:widget": "textarea",
      "ui:options": {
        grid: {
          gridColumns: "3/5"
        }
      }
    },
    ana_notes: {
      "ui:array": "StringArrayField",
      "ui:options": {
        grid: {
          gridColumns: "1/5"
        }
      }
    },
    cadi_id: {
      "ui:options": {
        grid: {
          gridColumns: "1/3"
        },
        autofill_fields: [
          [["paper"], ["cadi_info", "paper"]],
          [["name"], ["cadi_info", "name"]],
          [["description"], ["cadi_info", "description"]],
          [["contact"], ["cadi_info", "contact"]],
          [["created"], ["cadi_info", "created"]],
          [["twiki"], ["cadi_info", "twiki"]],
          [["pas"], ["cadi_info", "pas"]],
          [["publication_status"], ["cadi_info", "publication_status"]],
          [["status"], ["cadi_info", "status"]]
        ],
        autofill_from: "/api/cms/cadi/"
      }
    },
    "ui:object": "accordionObjectField",
    "ui:order": ["cadi_id", "abstract", "conclusion", "*"]
  },
  cadi_info: {
    "ui:options": {
      grid: {
        gridColumns: "3/5"
      }
    },
    contact: {
      "ui:readonly": true
    },
    created: {
      "ui:readonly": true
    },
    description: {
      "ui:readonly": true
    },
    name: {
      "ui:readonly": true
    },
    paper: {
      "ui:readonly": true
    },
    pas: {
      "ui:readonly": true
    },
    publication_status: {
      "ui:readonly": true
    },
    status: {
      "ui:readonly": true
    },
    twiki: {
      "ui:readonly": true
    },
    "ui:object": "accordionObjectField",
    "ui:order": [
      "name",
      "description",
      "contact",
      "twiki",
      "created",
      "paper",
      "pas",
      "publication_status",
      "status"
    ]
  },
  final_results: {
    code_base: {
      "ui:field": "CapFiles"
    },
    processing_steps: {
      items: {
        configuration_file: {
          "ui:field": "CapFiles"
        },
        output_data: {
          "ui:field": "CapFiles"
        },
        run_instructions: {
          "ui:field": "CapFiles"
        },
        "ui:order": ["configuration_file", "run_instructions", "output_data"]
      }
    },
    "ui:object": "accordionObjectField",
    "ui:order": ["*"]
  },
  input_data: {
    "ui:options": {
      grid: {
        gridColumns: "1/3"
      }
    },
    json_files: {
      items: {
        "ui:field": "CapFiles"
      }
    },
    mc_bg_datasets: {
      items: {
        "ui:options": {
          suggestions: "/api/cms/datasets?query="
        }
      },
      "ui:array": "StringArrayField"
    },
    mc_sig_datasets: {
      items: {
        "ui:options": {
          suggestions: "/api/cms/datasets?query="
        }
      },
      "ui:array": "StringArrayField"
    },
    primary_datasets: {
      items: {
        path: {
          "ui:options": {
            suggestions: "/api/cms/datasets?query="
          }
        },
        triggers: {
          items: {
            trigger: {
              "ui:options": {
                params: {
                  dataset: ["input_data", "primary_datasets", "#", "path"]
                },
                suggestions: "/api/cms/triggers?dataset=&query="
              }
            },
            "ui:options": {
              stringify: ["trigger"]
            },
            "ui:order": ["trigger", "prescale"]
          },
          "ui:array": "default"
        },
        "ui:options": {
          stringify: ["path"]
        },
        "ui:order": ["path", "ranges", "triggers"]
      }
    },
    "ui:object": "accordionObjectField",
    "ui:order": [
      "primary_datasets",
      "mc_sig_datasets",
      "mc_bg_datasets",
      "json_files",
      "*"
    ]
  },
  main_measurements: {
    items: {
      analysis_code: {
        "ui:field": "CapFiles"
      },
      processing_steps: {
        items: {
          configuration_file: {
            "ui:field": "CapFiles"
          },
          output_data: {
            "ui:field": "CapFiles"
          },
          run_instructions: {
            "ui:field": "CapFiles"
          },
          "ui:order": ["configuration_file", "run_instructions", "output_data"]
        }
      },
      signal_event_selection: {
        physics_objects: {
          items: {
            object: {
              "ui:widget": "select"
            },
            "ui:order": [
              "number",
              "object",
              "sel_criteria",
              "pt_cut",
              "pt_cut_min",
              "pt_cut_max",
              "eta_cut",
              "eta_cut_min",
              "eta_cut_max",
              "*"
            ]
          }
        },
        veto: {
          items: {
            "ui:order": ["number", "object", "pt_cut", "eta_cut", "*"]
          }
        }
      },
      "ui:order": [
        "description",
        "detailed_desciption",
        "analysis_code",
        "signal_event_selection",
        "processing_steps",
        "*"
      ]
    },
    "ui:array": "AccordionArrayField"
  },
  ntuples_production: {
    "ui:options": {
      grid: {
        gridColumns: "3/5"
      }
    },
    items: {
      code_base: {
        "ui:field": "CapFiles"
      },
      processing_steps: {
        items: {
          configuration_file: {
            "ui:field": "CapFiles"
          },
          output_data: {
            "ui:field": "CapFiles"
          },
          run_instructions: {
            "ui:field": "CapFiles"
          },
          "ui:order": ["configuration_file", "run_instructions", "output_data"]
        }
      },
      "ui:order": ["code_base", "processing_steps"]
    },
    "ui:array": "AccordionArrayField"
  },
  statistical_treatment: {
    "ui:options": {
      grid: {
        gridColumns: "3/5"
      }
    },
    combine_datacard: {
      "ui:field": "CapFiles"
    },
    statistics_questionnaire: {
      "ui:field": "ImportDataField",
      "ui:options": {
        query: "/api/deposits/?type=cms-questionnaire-v0.0.1"
      }
    },
    "ui:object": "accordionObjectField"
  },
  systematic_uncertainties: {
    items: {
      "ui:order": ["type", "physics_object", "*"]
    },
    "ui:array": "AccordionArrayField"
  },
  "ui:order": [
    "analysis_reuse_mode",
    "basic_info",
    "cadi_info",
    "input_data",
    "ntuples_production",
    "*",
    "additional_resources",
    "statistical_treatment"
  ]
};

const schemaATLAS = {
  $schema: "http://json-schema.org/draft-04/schema#",
  description: "Schema describing properties of an ATLAS analysis",
  properties: {
    $ana_type: {
      type: "string"
    },
    $schema: {
      type: "string"
    },
    _access: {
      properties: {
        "deposit-admin": {
          properties: {
            roles: {
              items: {
                type: "number"
              },
              type: "array"
            },
            users: {
              items: {
                type: "number"
              },
              type: "array"
            }
          },
          type: "object"
        },
        "deposit-read": {
          properties: {
            roles: {
              items: {
                type: "number"
              },
              type: "array"
            },
            users: {
              items: {
                type: "number"
              },
              type: "array"
            }
          },
          type: "object"
        },
        "deposit-update": {
          properties: {
            roles: {
              items: {
                type: "number"
              },
              type: "array"
            },
            users: {
              items: {
                type: "number"
              },
              type: "array"
            }
          },
          type: "object"
        }
      },
      type: "object"
    },
    _buckets: {
      properties: {
        deposit: {
          description: "Deposit bucket ID.",
          type: "string"
        },
        record: {
          description: "Record bucket ID.",
          type: "string"
        }
      },
      type: "object"
    },
    _deposit: {
      name: "_deposit",
      properties: {
        created_by: {
          name: "created_by",
          type: "integer"
        },
        id: {
          name: "id",
          type: "string"
        },
        owners: {
          items: [
            {
              type: "integer"
            }
          ],
          name: "owners",
          type: "array"
        },
        pid: {
          name: "pid",
          properties: {
            revision_id: {
              type: "integer"
            },
            type: {
              type: "string"
            },
            value: {
              type: "string"
            }
          },
          type: "object"
        },
        status: {
          enum: ["draft", "published"],
          name: "status",
          type: "string"
        }
      },
      required: ["id"],
      type: "object"
    },
    _experiment: {
      type: "string"
    },
    _files: {
      items: {
        description: "Describe information needed for files in records.",
        properties: {
          bucket: {
            type: "string"
          },
          key: {
            type: "string"
          },
          size: {
            type: "integer"
          },
          type: {
            description: "File type extension.",
            type: "string"
          },
          version_id: {
            type: "string"
          }
        },
        type: "object"
      },
      type: "array"
    },
    basic_info: {
      id: "basic_info",
      properties: {
        abstract: {
          title: "Abstract",
          type: "string"
        },
        analysis_title: {
          title: "Analysis Title",
          type: "string"
        },
        glance_id: {
          title: "Glance ID",
          type: "string"
        },
        people_info: {
          items: {
            properties: {
              email: {
                title: "Email-Adress",
                type: "string"
              },
              name: {
                title: "Name",
                type: "string"
              },
              orcid: {
                pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$",
                title: "ORCID",
                type: "string"
              }
            },
            type: "object"
          },
          title: "People Involved",
          type: "array"
        }
      },
      propertyOrder: 10,
      required: ["analysis_title", "glance_id"],
      title: "Basic Information",
      type: "object"
    },
    control_number: {
      type: "string"
    },
    general_title: {
      type: "string"
    },
    glance_info: {
      $schema: "http://json-schema.org/draft-04/schema#",
      description: "Automatically taken from GLANCE, based on GLANCE ID",
      id: "glance_info",
      properties: {
        creation_date: {
          title: "Creation date",
          type: "string"
        },
        full_title: {
          title: "Full Title",
          type: "string"
        },
        gitlab_group: {
          properties: {
            id: {
              title: "ID",
              type: "string"
            },
            projects: {
              items: {
                properties: {
                  id: {
                    title: "ID",
                    type: "string"
                  },
                  url: {
                    title: "URL",
                    type: "string"
                  }
                },
                title: "Project",
                type: "object"
              },
              title: "Projects",
              type: "array"
            }
          },
          title: "Gitlab Group",
          type: "object"
        },
        id: {
          title: "GLANCE ID",
          type: "string"
        },
        phase_0: {
          items: {
            properties: {
              dataset_used: {
                title: "Dataset Used",
                type: "string"
              },
              id: {
                title: "ID",
                type: "string"
              },
              main_physics_aim: {
                title: "Main Physics Aim",
                type: "string"
              },
              methods: {
                title: "Methods",
                type: "string"
              },
              model_tested: {
                title: "Model Tested",
                type: "string"
              }
            },
            type: "object"
          },
          title: "Phase 0",
          type: "array"
        },
        pub_short_title: {
          title: "Publication title",
          type: "string"
        },
        ref_code: {
          title: "Ref Code",
          type: "string"
        },
        short_title: {
          title: "Short Title",
          type: "string"
        },
        status: {
          title: "Status",
          type: "string"
        }
      },
      title: "Information from GLANCE database",
      type: "object"
    },
    input_datasets: {
      additionalProperties: false,
      default: [{}],
      description:
        "Datasets relevant for this analysis (including all datasets for all main and auxiliary measurements)",
      id: "input_datasets",
      items: {
        $schema: "http://json-schema.org/draft-04/schema#",
        description: "Information concerning the ATLAS datasets used",
        properties: {
          dataset_title: {
            title: "Title",
            type: "string"
          },
          format: {
            title: "Data Format",
            type: "string"
          },
          type: {
            title: "Data Type",
            type: "string"
          }
        },
        title: "ATLAS Dataset",
        type: "object"
      },
      title: "Input Data",
      type: "array"
    },
    likelihoods: {
      $schema: "http://json-schema.org/draft-06/schema#",
      additionalProperties: true,
      definitions: {
        channel: {
          additionalProperties: false,
          properties: {
            name: {
              type: "string"
            },
            samples: {
              items: {
                additionalProperties: false,
                properties: {
                  data: {
                    items: {
                      type: "number"
                    },
                    minItems: 1,
                    type: "array"
                  },
                  modifiers: {
                    items: {
                      anyOf: [
                        {
                          additionalProperties: false,
                          properties: {
                            data: {
                              properties: {
                                hi_data: {
                                  items: {
                                    type: "number"
                                  },
                                  minItems: 1,
                                  type: "array"
                                },
                                lo_data: {
                                  items: {
                                    type: "number"
                                  },
                                  minItems: 1,
                                  type: "array"
                                }
                              },
                              required: ["lo_data", "hi_data"],
                              type: "object"
                            },
                            name: {
                              type: "string"
                            },
                            type: {
                              const: "histosys"
                            }
                          },
                          required: ["name", "type", "data"],
                          type: "object"
                        },
                        {
                          additionalProperties: false,
                          properties: {
                            data: {
                              type: "null"
                            },
                            name: {
                              const: "lumi"
                            },
                            type: {
                              const: "lumi"
                            }
                          },
                          required: ["name", "type", "data"],
                          type: "object"
                        },
                        {
                          additionalProperties: false,
                          properties: {
                            data: {
                              type: "null"
                            },
                            name: {
                              type: "string"
                            },
                            type: {
                              const: "normfactor"
                            }
                          },
                          required: ["name", "type", "data"],
                          type: "object"
                        },
                        {
                          additionalProperties: false,
                          properties: {
                            data: {
                              properties: {
                                hi: {
                                  type: "number"
                                },
                                lo: {
                                  type: "number"
                                }
                              },
                              required: ["lo", "hi"],
                              type: "object"
                            },
                            name: {
                              type: "string"
                            },
                            type: {
                              const: "normsys"
                            }
                          },
                          required: ["name", "type", "data"],
                          type: "object"
                        },
                        {
                          additionalProperties: false,
                          properties: {
                            data: {
                              type: "null"
                            },
                            name: {
                              type: "string"
                            },
                            type: {
                              const: "shapefactor"
                            }
                          },
                          required: ["name", "type", "data"],
                          type: "object"
                        },
                        {
                          additionalProperties: false,
                          properties: {
                            data: {
                              items: {
                                type: "number"
                              },
                              minItems: 1,
                              type: "array"
                            },
                            name: {
                              type: "string"
                            },
                            type: {
                              const: "shapesys"
                            }
                          },
                          required: ["name", "type", "data"],
                          type: "object"
                        },
                        {
                          additionalProperties: false,
                          properties: {
                            data: {
                              items: {
                                type: "number"
                              },
                              minItems: 1,
                              type: "array"
                            },
                            name: {
                              type: "string"
                            },
                            type: {
                              const: "staterror"
                            }
                          },
                          required: ["name", "type", "data"],
                          type: "object"
                        },
                        {
                          type: "object"
                        }
                      ]
                    },
                    type: "array"
                  },
                  name: {
                    type: "string"
                  }
                },
                required: ["name", "data", "modifiers"],
                type: "object"
              },
              minItems: 1,
              type: "array"
            }
          },
          required: ["name", "samples"],
          type: "object"
        },
        modifier: {
          histosys: {
            additionalProperties: false,
            properties: {
              data: {
                properties: {
                  hi_data: {
                    items: {
                      type: "number"
                    },
                    minItems: 1,
                    type: "array"
                  },
                  lo_data: {
                    items: {
                      type: "number"
                    },
                    minItems: 1,
                    type: "array"
                  }
                },
                required: ["lo_data", "hi_data"],
                type: "object"
              },
              name: {
                type: "string"
              },
              type: {
                const: "histosys"
              }
            },
            required: ["name", "type", "data"],
            type: "object"
          },
          lumi: {
            additionalProperties: false,
            properties: {
              data: {
                type: "null"
              },
              name: {
                const: "lumi"
              },
              type: {
                const: "lumi"
              }
            },
            required: ["name", "type", "data"],
            type: "object"
          },
          normfactor: {
            additionalProperties: false,
            properties: {
              data: {
                type: "null"
              },
              name: {
                type: "string"
              },
              type: {
                const: "normfactor"
              }
            },
            required: ["name", "type", "data"],
            type: "object"
          },
          normsys: {
            additionalProperties: false,
            properties: {
              data: {
                properties: {
                  hi: {
                    type: "number"
                  },
                  lo: {
                    type: "number"
                  }
                },
                required: ["lo", "hi"],
                type: "object"
              },
              name: {
                type: "string"
              },
              type: {
                const: "normsys"
              }
            },
            required: ["name", "type", "data"],
            type: "object"
          },
          shapefactor: {
            additionalProperties: false,
            properties: {
              data: {
                type: "null"
              },
              name: {
                type: "string"
              },
              type: {
                const: "shapefactor"
              }
            },
            required: ["name", "type", "data"],
            type: "object"
          },
          shapesys: {
            additionalProperties: false,
            properties: {
              data: {
                items: {
                  type: "number"
                },
                minItems: 1,
                type: "array"
              },
              name: {
                type: "string"
              },
              type: {
                const: "shapesys"
              }
            },
            required: ["name", "type", "data"],
            type: "object"
          },
          staterror: {
            additionalProperties: false,
            properties: {
              data: {
                items: {
                  type: "number"
                },
                minItems: 1,
                type: "array"
              },
              name: {
                type: "string"
              },
              type: {
                const: "staterror"
              }
            },
            required: ["name", "type", "data"],
            type: "object"
          }
        },
        parameter: {
          additionalProperties: false,
          properties: {
            auxdata: {
              items: {
                type: "number"
              },
              minItems: 1,
              type: "array"
            },
            bounds: {
              items: {
                items: {
                  maxItems: 2,
                  minItems: 2,
                  type: "number"
                },
                type: "array"
              },
              minItems: 1,
              type: "array"
            },
            factors: {
              items: {
                type: "number"
              },
              minItems: 1,
              type: "array"
            },
            fixed: {
              type: "boolean"
            },
            inits: {
              items: {
                type: "number"
              },
              minItems: 1,
              type: "array"
            },
            name: {
              type: "string"
            },
            sigmas: {
              items: {
                type: "number"
              },
              minItems: 1,
              type: "array"
            }
          },
          required: ["name"],
          type: "object"
        },
        sample: {
          additionalProperties: false,
          properties: {
            data: {
              items: {
                type: "number"
              },
              minItems: 1,
              type: "array"
            },
            modifiers: {
              items: {
                anyOf: [
                  {
                    additionalProperties: false,
                    properties: {
                      data: {
                        properties: {
                          hi_data: {
                            items: {
                              type: "number"
                            },
                            minItems: 1,
                            type: "array"
                          },
                          lo_data: {
                            items: {
                              type: "number"
                            },
                            minItems: 1,
                            type: "array"
                          }
                        },
                        required: ["lo_data", "hi_data"],
                        type: "object"
                      },
                      name: {
                        type: "string"
                      },
                      type: {
                        const: "histosys"
                      }
                    },
                    required: ["name", "type", "data"],
                    type: "object"
                  },
                  {
                    additionalProperties: false,
                    properties: {
                      data: {
                        type: "null"
                      },
                      name: {
                        const: "lumi"
                      },
                      type: {
                        const: "lumi"
                      }
                    },
                    required: ["name", "type", "data"],
                    type: "object"
                  },
                  {
                    additionalProperties: false,
                    properties: {
                      data: {
                        type: "null"
                      },
                      name: {
                        type: "string"
                      },
                      type: {
                        const: "normfactor"
                      }
                    },
                    required: ["name", "type", "data"],
                    type: "object"
                  },
                  {
                    additionalProperties: false,
                    properties: {
                      data: {
                        properties: {
                          hi: {
                            type: "number"
                          },
                          lo: {
                            type: "number"
                          }
                        },
                        required: ["lo", "hi"],
                        type: "object"
                      },
                      name: {
                        type: "string"
                      },
                      type: {
                        const: "normsys"
                      }
                    },
                    required: ["name", "type", "data"],
                    type: "object"
                  },
                  {
                    additionalProperties: false,
                    properties: {
                      data: {
                        type: "null"
                      },
                      name: {
                        type: "string"
                      },
                      type: {
                        const: "shapefactor"
                      }
                    },
                    required: ["name", "type", "data"],
                    type: "object"
                  },
                  {
                    additionalProperties: false,
                    properties: {
                      data: {
                        items: {
                          type: "number"
                        },
                        minItems: 1,
                        type: "array"
                      },
                      name: {
                        type: "string"
                      },
                      type: {
                        const: "shapesys"
                      }
                    },
                    required: ["name", "type", "data"],
                    type: "object"
                  },
                  {
                    additionalProperties: false,
                    properties: {
                      data: {
                        items: {
                          type: "number"
                        },
                        minItems: 1,
                        type: "array"
                      },
                      name: {
                        type: "string"
                      },
                      type: {
                        const: "staterror"
                      }
                    },
                    required: ["name", "type", "data"],
                    type: "object"
                  },
                  {
                    type: "object"
                  }
                ]
              },
              type: "array"
            },
            name: {
              type: "string"
            }
          },
          required: ["name", "data", "modifiers"],
          type: "object"
        }
      },
      description: "ATLAS Analysis Likelihood",
      properties: {
        channels: {
          items: {
            additionalProperties: false,
            properties: {
              name: {
                type: "string"
              },
              samples: {
                items: {
                  additionalProperties: false,
                  properties: {
                    data: {
                      items: {
                        type: "number"
                      },
                      minItems: 1,
                      type: "array"
                    },
                    modifiers: {
                      items: {
                        anyOf: [
                          {
                            additionalProperties: false,
                            properties: {
                              data: {
                                properties: {
                                  hi_data: {
                                    items: {
                                      type: "number"
                                    },
                                    minItems: 1,
                                    type: "array"
                                  },
                                  lo_data: {
                                    items: {
                                      type: "number"
                                    },
                                    minItems: 1,
                                    type: "array"
                                  }
                                },
                                required: ["lo_data", "hi_data"],
                                type: "object"
                              },
                              name: {
                                type: "string"
                              },
                              type: {
                                const: "histosys"
                              }
                            },
                            required: ["name", "type", "data"],
                            type: "object"
                          },
                          {
                            additionalProperties: false,
                            properties: {
                              data: {
                                type: "null"
                              },
                              name: {
                                const: "lumi"
                              },
                              type: {
                                const: "lumi"
                              }
                            },
                            required: ["name", "type", "data"],
                            type: "object"
                          },
                          {
                            additionalProperties: false,
                            properties: {
                              data: {
                                type: "null"
                              },
                              name: {
                                type: "string"
                              },
                              type: {
                                const: "normfactor"
                              }
                            },
                            required: ["name", "type", "data"],
                            type: "object"
                          },
                          {
                            additionalProperties: false,
                            properties: {
                              data: {
                                properties: {
                                  hi: {
                                    type: "number"
                                  },
                                  lo: {
                                    type: "number"
                                  }
                                },
                                required: ["lo", "hi"],
                                type: "object"
                              },
                              name: {
                                type: "string"
                              },
                              type: {
                                const: "normsys"
                              }
                            },
                            required: ["name", "type", "data"],
                            type: "object"
                          },
                          {
                            additionalProperties: false,
                            properties: {
                              data: {
                                type: "null"
                              },
                              name: {
                                type: "string"
                              },
                              type: {
                                const: "shapefactor"
                              }
                            },
                            required: ["name", "type", "data"],
                            type: "object"
                          },
                          {
                            additionalProperties: false,
                            properties: {
                              data: {
                                items: {
                                  type: "number"
                                },
                                minItems: 1,
                                type: "array"
                              },
                              name: {
                                type: "string"
                              },
                              type: {
                                const: "shapesys"
                              }
                            },
                            required: ["name", "type", "data"],
                            type: "object"
                          },
                          {
                            additionalProperties: false,
                            properties: {
                              data: {
                                items: {
                                  type: "number"
                                },
                                minItems: 1,
                                type: "array"
                              },
                              name: {
                                type: "string"
                              },
                              type: {
                                const: "staterror"
                              }
                            },
                            required: ["name", "type", "data"],
                            type: "object"
                          },
                          {
                            type: "object"
                          }
                        ]
                      },
                      type: "array"
                    },
                    name: {
                      type: "string"
                    }
                  },
                  required: ["name", "data", "modifiers"],
                  type: "object"
                },
                minItems: 1,
                type: "array"
              }
            },
            required: ["name", "samples"],
            type: "object"
          },
          type: "array"
        },
        parameters: {
          items: {
            additionalProperties: false,
            properties: {
              auxdata: {
                items: {
                  type: "number"
                },
                minItems: 1,
                type: "array"
              },
              bounds: {
                items: {
                  items: {
                    maxItems: 2,
                    minItems: 2,
                    type: "number"
                  },
                  type: "array"
                },
                minItems: 1,
                type: "array"
              },
              factors: {
                items: {
                  type: "number"
                },
                minItems: 1,
                type: "array"
              },
              fixed: {
                type: "boolean"
              },
              inits: {
                items: {
                  type: "number"
                },
                minItems: 1,
                type: "array"
              },
              name: {
                type: "string"
              },
              sigmas: {
                items: {
                  type: "number"
                },
                minItems: 1,
                type: "array"
              }
            },
            required: ["name"],
            type: "object"
          },
          type: "array"
        }
      },
      title: "Likelihood",
      type: "object"
    },
    limits: {
      $schema: "http://json-schema.org/draft-04/schema#",
      description: "ATLAS Analysis Limits",
      id: "limits",
      properties: {
        CLs_exp: {
          items: {
            type: "number"
          },
          type: "array"
        },
        CLs_obs: {
          type: "number"
        }
      },
      title: "Limits",
      type: "object"
    },
    publications: {
      additionalProperties: false,
      default: [{}],
      description: "Publications related to the analysis",
      id: "publications",
      items: {
        $schema: "http://json-schema.org/draft-04/schema#",
        description:
          "Information concerning the publications related to a dataset",
        properties: {
          access: {
            enum: ["public", "internal"],
            title: "Access Level",
            type: "string"
          },
          comment: {
            title: "Comment",
            type: "string"
          },
          persistent_identifiers: {
            description:
              "Identifier numbers for the publication, e.g. arXiv ID or CDS ID",
            items: {
              $schema: "http://json-schema.org/draft-04/schema#",
              description: "An issued identifier",
              properties: {
                identifier: {
                  title: "Identifier",
                  type: "string"
                },
                scheme: {
                  title: "Scheme",
                  type: "string"
                }
              },
              title: "Identifier",
              type: "object"
            },
            title: "Identifiers",
            type: "array"
          },
          type: {
            title: "Document Type",
            type: "string"
          },
          url: {
            title: "URL",
            type: "string"
          }
        },
        title: "ATLAS Publications",
        type: "object"
      },
      title: "Publications",
      type: "array"
    },
    workflows: {
      $schema: "http://json-schema.org/draft-04/schema#",
      items: {
        properties: {
          workflow: {
            oneOf: [
              {
                $schema: "http://json-schema.org/draft-04/schema#",
                additionalProperties: false,
                id: "yadage_workflow",
                properties: {
                  stages: {
                    items: {
                      type: "object"
                    },
                    title: "Stages",
                    type: "array"
                  }
                },
                required: ["stages"],
                title: "Yadage Workflow",
                type: "object"
              }
            ]
          },
          workflow_title: {
            title: "Workflow Title",
            type: "string"
          }
        },
        type: "object"
      },
      title: "Workflows",
      type: "array"
    }
  },
  title: "ATLAS Analysis",
  type: "object"
};

const schemaATLASUI = {
  "ui:options": {
    display: "grid",
    size: "xlarge",
    align: "center"
  },
  basic_info: {
    glance_id: {
      "ui:options": {
        autofill_fields: [
          [["pub_short_title"], ["basic_info", "analysis_title"]],
          [["id"], ["glance_info", "id"]],
          [["short_title"], ["glance_info", "short_title"]],
          [["full_title"], ["glance_info", "full_title"]],
          [["pub_short_title"], ["glance_info", "pub_short_title"]],
          [["ref_code"], ["glance_info", "ref_code"]],
          [["creation_date"], ["glance_info", "creation_date"]],
          [["status"], ["glance_info", "status"]],
          [["phase_0"], ["glance_info", "phase_0"]],
          [["gitlab_group"], ["glance_info", "gitlab_group"]]
        ],
        autofill_from: "/api/atlas/glance/"
      }
    },
    people_info: {
      items: {
        name: {
          "ui:options": {
            autofill_fields: [
              [["orcid"], ["basic_info", "people_info", "#", "orcid"]]
            ],
            autofill_from: "/api/orcid?name="
          }
        }
      }
    },
    "ui:object": "accordionObjectField",
    "ui:order": ["analysis_title", "glance_id", "abstract", "people_info"]
  },
  glance_info: {
    creation_date: {
      "ui:readonly": true
    },
    full_title: {
      "ui:readonly": true
    },
    gitlab_group: {
      projects: {
        "ui:title": "Projects"
      },
      "ui:readonly": true
    },
    id: {
      "ui:readonly": true
    },
    phase_0: {
      "ui:readonly": true
    },
    pub_short_title: {
      "ui:readonly": true
    },
    ref_code: {
      "ui:readonly": true
    },
    short_title: {
      "ui:readonly": true
    },
    status: {
      "ui:readonly": true
    },
    "ui:object": "accordionObjectField",
    "ui:order": [
      "id",
      "short_title",
      "full_title",
      "pub_short_title",
      "ref_code",
      "creation_date",
      "status",
      "phase_0",
      "gitlab_group"
    ]
  },
  input_datasets: {
    "ui:array": "AccordionArrayField",
    "ui:options": {
      enableArrayUtils: true
    }
  },
  likelihoods: {
    "ui:field": "accordion_jsoneditor"
  },
  limits: {
    "ui:object": "accordionObjectField"
  },
  publications: {
    "ui:array": "AccordionArrayField"
  },
  "ui:order": [
    "basic_info",
    "glance_info",
    "workflows",
    "likelihoods",
    "limits",
    "*"
  ],
  workflows: {
    items: {
      "ui:order": ["workflow_title", "*"],
      workflow: {
        "ui:field": "jsoneditor",
        "ui:title": "Workflow"
      }
    },
    "ui:array": "AccordionArrayField"
  }
};

const schemaLHCB = {
  $schema: "http://json-schema.org/draft-04/schema#",
  additionalProperties: false,
  properties: {
    $ana_type: {
      type: "string"
    },
    $schema: {
      type: "string"
    },
    _access: {
      properties: {
        "deposit-admin": {
          properties: {
            roles: {
              items: {
                type: "number"
              },
              type: "array"
            },
            users: {
              items: {
                type: "number"
              },
              type: "array"
            }
          },
          type: "object"
        },
        "deposit-read": {
          properties: {
            roles: {
              items: {
                type: "number"
              },
              type: "array"
            },
            users: {
              items: {
                type: "number"
              },
              type: "array"
            }
          },
          type: "object"
        },
        "deposit-update": {
          properties: {
            roles: {
              items: {
                type: "number"
              },
              type: "array"
            },
            users: {
              items: {
                type: "number"
              },
              type: "array"
            }
          },
          type: "object"
        }
      },
      type: "object"
    },
    _buckets: {
      properties: {
        deposit: {
          description: "Deposit bucket ID.",
          type: "string"
        },
        record: {
          description: "Record bucket ID.",
          type: "string"
        }
      },
      type: "object"
    },
    _deposit: {
      name: "_deposit",
      properties: {
        created_by: {
          name: "created_by",
          type: "integer"
        },
        id: {
          name: "id",
          type: "string"
        },
        owners: {
          items: [
            {
              type: "integer"
            }
          ],
          name: "owners",
          type: "array"
        },
        pid: {
          name: "pid",
          properties: {
            revision_id: {
              type: "integer"
            },
            type: {
              type: "string"
            },
            value: {
              type: "string"
            }
          },
          type: "object"
        },
        status: {
          enum: ["draft", "published"],
          name: "status",
          type: "string"
        }
      },
      required: ["id"],
      type: "object"
    },
    _experiment: {
      type: "string"
    },
    _files: {
      items: {
        description: "Describe information needed for files in records.",
        properties: {
          bucket: {
            type: "string"
          },
          key: {
            type: "string"
          },
          size: {
            type: "integer"
          },
          type: {
            description: "File type extension.",
            type: "string"
          },
          version_id: {
            type: "string"
          }
        },
        type: "object"
      },
      type: "array"
    },
    additional_resources: {
      description:
        "Please provide information about the additional resources of the analysis",
      properties: {
        documentations: {
          id: "documentations",
          items: {
            description: "Add documentation",
            properties: {
              title: {
                title: "Title",
                type: "string"
              },
              url: {
                title: "URL",
                type: "string"
              }
            },
            type: "object"
          },
          title: "Documentations",
          type: "array"
        },
        internal_discussions: {
          id: "internal-discussions",
          items: {
            properties: {
              meeting: {
                title: "eGroup",
                type: "string"
              },
              title: {
                title: "Title",
                type: "string"
              },
              url: {
                title: "URL",
                type: "string"
              }
            },
            type: "object"
          },
          title: "Internal Discussions",
          type: "array"
        },
        presentations: {
          id: "presentations",
          items: {
            properties: {
              meeting: {
                title: "Meeting (GROUP)",
                type: "string"
              },
              title: {
                title: "Title",
                type: "string"
              },
              url: {
                title: "URL",
                type: "string"
              }
            },
            type: "object"
          },
          title: "Presentations",
          type: "array"
        },
        publications: {
          id: "publications",
          items: {
            properties: {
              analysis_number: {
                title: "Analysis Note (ANA)",
                type: "string"
              },
              arxiv_id: {
                title: "ArXiv ID",
                type: "string"
              },
              conf_report: {
                title: "Conference Report (CONF)",
                type: "string"
              },
              public_paper: {
                title: "Public Paper",
                type: "string"
              },
              review_egroup: {
                title: "Review Group",
                type: "string"
              },
              roles: {
                title: "Roles",
                type: "string"
              },
              twiki: {
                title: "TWiki Page",
                type: "string"
              },
              url: {
                title: "URL",
                type: "string"
              }
            },
            type: "object"
          },
          title: "Publications",
          type: "array"
        }
      },
      title: "Additional Resources",
      type: "object"
    },
    basic_info: {
      description:
        "Please provide some information relevant for all parts of the Analysis here",
      id: "basic_info",
      properties: {
        analysis_proponents: {
          items: {
            properties: {
              name: {
                title: "Name",
                type: "string"
              },
              orcid: {
                pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$",
                title: "ORCID",
                type: "string"
              }
            },
            type: "object"
          },
          title: "Proponents",
          type: "array"
        },
        analysis_status: {
          enum: [
            "None",
            "0 - planned / open topic",
            "1 - in preparation",
            "2 - ANA note released",
            "3 - review committee",
            "4 - collaboration review",
            "5 -",
            "6 - CONF note published",
            "7 -",
            "8 - journal review",
            "9 - PAPER published",
            "x - other"
          ],
          title: "Status",
          type: "string"
        },
        analysis_title: {
          title: "Analysis Name",
          type: "string"
        },
        institutes: {
          enum: [
            "None",
            "IFT",
            "B_Q",
            "BDC",
            "DP",
            "CD",
            "QEE",
            "RD",
            "Charm",
            "SLB",
            "B2OC"
          ],
          title: "Institutes Involved",
          type: "string"
        },
        keywords: {
          id: "keywords",
          title: "Keywords",
          type: "string"
        },
        measurement: {
          title: "Measurement",
          type: "string"
        },
        review_egroup: {
          title: "Review eGroup",
          type: "string"
        },
        reviewers: {
          items: {
            properties: {
              name: {
                title: "Name",
                type: "string"
              },
              orcid: {
                pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$",
                title: "ORCID",
                type: "string"
              }
            },
            type: "object"
          },
          title: "Reviewers",
          type: "array"
        }
      },
      title: "Basic Information",
      type: "object"
    },
    control_number: {
      type: "string"
    },
    general_title: {
      type: "string"
    },
    ntuple_userdst_production: {
      description: "Please provide information about the steps of the analysis",
      items: {
        properties: {
          davinci_scripts: {
            items: {
              type: "string",
              "x-cap-file": {}
            },
            title: "DaVinci Scripts",
            type: "array"
          },
          davinci_version: {
            title: "DaVinci Version",
            type: "string"
          },
          ganga_scripts: {
            items: {
              type: "string",
              "x-cap-file": {}
            },
            title: "Ganga Scripts",
            type: "array"
          },
          input_dataset: {
            title: "Input Dataset",
            type: "string"
          },
          name: {
            title: "Custom name",
            type: "string"
          },
          output_eos_location: {
            title: "Output EOS Location",
            type: "string"
          },
          platform: {
            title: "Platform",
            type: "string"
          },
          wg_production_bk_path: {
            title: "WG Production Bookkeeping Path",
            type: "string"
          }
        },
        type: "object"
      },
      title: "ntuple/userDST-production",
      type: "array"
    },
    stripping_turbo_selection: {
      items: {
        properties: {
          bookkeping_locations: {
            items: {
              type: "string"
            },
            title: "Bookkeeping Locations",
            type: "array"
          },
          dataset_type: {
            enum: ["mc_data", "real_data"],
            title: "Type of Dataset",
            type: "string"
          },
          name: {
            title: "Custom Name",
            type: "string"
          },
          stripping_turbo_line: {
            title: "Stripping/TURBO Line",
            type: "string"
          }
        },
        type: "object"
      },
      title: "Stripping/Turbo Selections",
      type: "array"
    },
    user_analysis: {
      properties: {
        additional_repos: {
          items: {
            type: "string"
          },
          title: "Additional Repositories",
          type: "array"
        },
        basic_scripts: {
          properties: {
            command: {
              title: "Command to execute code",
              type: "string"
            },
            scripts: {
              items: {
                type: "string",
                "x-cap-file": {}
              },
              title: "Files/Scripts",
              type: "array"
            }
          },
          title: "Basic scripts",
          type: "object"
        },
        docker_registries: {
          items: {
            type: "string",
            "x-cap-file": {}
          },
          title: "Docker images of the analysis",
          type: "array"
        },
        gitlab_links: {
          items: {
            type: "string",
            "x-cap-file": {}
          },
          title: "Gitlab repositories of the analysis",
          type: "array"
        }
      },
      title: "User Analysis",
      type: "object"
    }
  },
  title: "LHCb Analysis",
  type: "object"
};

const schemaLHCBUI = {
  "ui:options": {
    size: "xxlarge",
    align: "center",
    display: "grid"
  },
  additional_resources: {
    documentations: {
      items: {
        "ui:options": {
          stringify: ["title"]
        }
      }
    },
    internal_discussions: {
      items: {
        "ui:options": {
          stringify: ["title"]
        },
        "ui:order": ["title", "url", "meeting"]
      }
    },
    presentations: {
      items: {
        "ui:options": {
          stringify: ["title"]
        },
        "ui:order": ["title", "url", "meeting"]
      }
    },
    publications: {
      items: {
        "ui:options": {
          stringify: ["analysis_number"]
        }
      }
    },
    "ui:object": "accordionObjectField",
    "ui:order": [
      "internal_discussions",
      "presentations",
      "publications",
      "documentations"
    ]
  },
  basic_info: {
    analysis_proponents: {
      items: {
        name: {
          "ui:options": {
            autofill_fields: [
              [["orcid"], ["basic_info", "analysis_proponents", "#", "orcid"]]
            ],
            autofill_from: "/api/orcid?name="
          }
        },
        "ui:options": {
          stringify: ["name"]
        }
      }
    },
    analysis_title: {
      "ui:options": {
        autofill_fields: [
          [["measurement"], ["basic_info", "measurement"]],
          [["status"], ["basic_info", "analysis_status"]],
          [["egroup"], ["basic_info", "review_egroup"]],
          [["wg"], ["basic_info", "institutes"]]
        ],
        autofill_from: "/api/lhcb/analysis/details?title=",
        suggestions: "/api/lhcb/analysis?query="
      }
    },
    reviewers: {
      items: {
        name: {
          "ui:options": {
            autofill_fields: [
              [["orcid"], ["basic_info", "reviewers", "#", "orcid"]]
            ],
            autofill_from: "/api/orcid?name="
          }
        },
        "ui:options": {
          stringify: ["name"]
        }
      }
    },
    "ui:object": "accordionObjectField",
    "ui:order": [
      "analysis_title",
      "measurement",
      "analysis_proponents",
      "reviewers",
      "review_egroup",
      "analysis_status",
      "institutes",
      "keywords"
    ]
  },
  ntuple_userdst_production: {
    items: {
      davinci_scripts: {
        items: {
          "ui:field": "CapFiles"
        }
      },
      ganga_scripts: {
        items: {
          "ui:field": "CapFiles"
        }
      },
      "ui:order": [
        "name",
        "input_dataset",
        "platform",
        "davinci_version",
        "output_eos_location",
        "wg_production_bk_path",
        "davinci_scripts",
        "ganga_scripts"
      ]
    },
    "ui:array": "AccordionArrayField"
  },
  stripping_turbo_selection: {
    items: {
      bookkeping_locations: {
        "ui:array": "StringArrayField"
      },
      "ui:order": [
        "dataset_type",
        "name",
        "stripping_turbo_line",
        "bookkeping_locations"
      ]
    },
    "ui:array": "AccordionArrayField"
  },
  "ui:order": [
    "basic_info",
    "stripping_turbo_selection",
    "ntuple_userdst_production",
    "user_analysis",
    "additional_resources"
  ],
  user_analysis: {
    additional_repos: {
      items: {
        "ui:field": "CapFiles"
      }
    },
    basic_scripts: {
      scripts: {
        items: {
          "ui:field": "CapFiles"
        }
      }
    },
    docker_registries: {
      items: {
        "ui:field": "CapFiles"
      }
    },
    gitlab_links: {
      items: {
        "ui:field": "CapFiles"
      }
    },
    "ui:object": "accordionObjectField",
    "ui:order": [
      "gitlab_links",
      "docker_registries",
      "additional_repos",
      "basic_scripts"
    ]
  }
};

const transformSchema = schema => {
  const schemaFieldsToRemove = [
    "_access",
    "_deposit",
    "_cap_status",
    "_buckets",
    "_files",
    "$ana_type",
    "$schema",
    "general_title",
    "_experiment",
    "control_number"
  ];

  schema.properties = _omit(schema.properties, schemaFieldsToRemove);
  schema = {
    type: schema.type,
    properties: schema.properties,
    dependencies: schema.dependencies
  };

  return schema;
};

/**
 * Parameters:
 * The developer can define the layout of the form by passing three parameters (uiSchema) to the root object, and more specific to "ui:options"
 * 
 * The fundamental parameters are: size, align,display
 * 
 * Display:
 * this parameter can take values such as flex, grid or anything else. 
 * If is not set, automatically will go for flex.
 * If the display is set to grid, it will create two columns automatically and everything will fit in those two columns
 * 
 * Size:
 * the size parameter is the one that passes value to a Grommet Box, therefore the accepted list values is defined by Grommet:
 * auto | xsmall | small | medium | large | xlarge | xxlarge | full |
 * 
 * Align: defines if the children of the root object will be aligned left, center or right
 * Accepted values are:
 * start | center | end
 *    
 * "ui:options":{
    "size":"full", 
    "align":"full",
    "display":"flex"
  }
 */

class CleanFormStorie extends Component {
  render() {
    return (
      <Grommet>
        <Box>
          <Provider store={store}>
            <CleanForm
              schema={transformSchema(this.props.schema)}
              uiSchema={this.props.uiSchema}
            />
          </Provider>
        </Box>
      </Grommet>
    );
  }
}

CleanFormStorie.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

storiesOf("Clean Form", module)
  .add("Full", () => (
    <CleanFormStorie uiSchema={objschemaui} schema={objschema} />
  ))
  .add("CMS", () => (
    <CleanFormStorie uiSchema={schemaCMSUI} schema={schemaCMS} />
  ))
  .add("ATLAS", () => (
    <CleanFormStorie schema={schemaATLAS} uiSchema={schemaATLASUI} />
  ))
  .add("CMS", () => (
    <CleanFormStorie uiSchema={schemaCMSUI} schema={schemaCMS} />
  ))
  .add("ATLAS", () => (
    <CleanFormStorie schema={schemaATLAS} uiSchema={schemaATLASUI} />
  ))
  .add("LHCB", () => (
    <CleanFormStorie schema={schemaLHCB} uiSchema={schemaLHCBUI} />
  ));
