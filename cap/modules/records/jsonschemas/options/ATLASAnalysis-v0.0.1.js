/* -*- coding: utf-8 -*-
 *
 * This file is part of CERN Analysis Preservation Framework.
 * Copyright (C) 2016 CERN.
 *
 * CERN Analysis Preservation Framework is free software; you can redistribute
 * it and/or modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * CERN Analysis Preservation Framework is distributed in the hope that it will
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CERN Analysis Preservation Framework; if not, write to the
 * Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
 * MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */


window.schemaOptions = {
    "fields": {
      "basic_info": {
        "order": 1,
        "label": false,
        "type": "depositgroup",
        "fields": {
          "analysis_title": {
            "order": 1,
            "placeholder": "Please provide the analysis title"
          },
          "glance_id": {
            "order": 2,
            "placeholder": "Please provide the Glance ID"
          },
          "abstract": {
            "order": 3,
            "type": "textarea",
            "rows": 5,
            "placeholder": "If not provided here, the abstract can be extracted from the final paper."
          },
          "people_info": {
            "type": "depositgroup-object-array",
            "order": 4,
            "fields": {
              "item": {
                "fields": {
                  "name": {
                    "order": 1,
                    "type": "personalname",
                    "placeholder": "E.g. John Doe, Jane Doe"
                  },
                  "email": {
                    "order": 2,
                    "type": "email",
                    "placeholder": "E.g. john.doe@cern.ch, jane.doe@cern.ch"
                  }
                }
              }
            }
          }
        }
      },
      "input_datasets": {
        "type": "depositgroup-array",
        "order": 2,
        "label": false,
        "fields": {
          "item": {
            "fields": {
              "title": {
                "order": 1,
                "placeholder": "E.g. group.phys-susy.data12_8TeV.periodA.physics_Muons.PhysCont.NTUP_SUSYSKIM.repro14_v01_p1542",
              },
              "type": {
                "order": 2,
                "placeholder": "E.g. simulation"
              },
              "format": {
                "order": 3,
                "placeholder": "E.g. AOD"
              }
            }
          }
        }
      },
      "workflows": {
        "type": "depositgroup-array",
        "order": 3,
        "fields": {
          "item": {
            "fields": {
              "name": {
                "order": 1,
                "placeholder": "Please enter a name",
              },
              "workflow": {
                "order": 2,
                // "type": "depositgroup-object",
                "fields": {
                  "context": {
                    // "type": "depositgroup-object"
                  },
                  "stages": {
                    "type": "depositgroup-object-array",
                    "fields": {
                      "item": {
                        "fields": {
                          "name": {
                            "order": 1
                          },
                          "dependencies": {
                            "type": "depositgroup-object-array",
                            "order": 4,
                            "fields": {
                              "items": {
                                "fields": {
                                  "placeholder": "Add dependency",
                                  "type": "select",
                                  "multiple": true,
                                  "dataSource": function(callback){
                                    callback(_.values(dependencies));
                                  }
                                }
                              }
                            }
                          },
                          "parameters": {
                            "type": "depositgroup-object",
                            "order": 3
                          },
                          "scheduler": {
                            "order": 2,
                            "schemaTypeField": "scheduler_type",
                            "fields": {
                              "scheduler_type": {
                                "hidden": "true"
                              },
                              "step": {
                                "fields": {
                                  "schema_type": {
                                    "hidden": "true"
                                  },
                                  "process": {
                                    "fields": {
                                      "process-type": {
                                        "hidden": "true"
                                      }
                                    }
                                  },
                                  "publisher": {
                                    "schemaTypeField": "publisher_type",
                                    "fields": {
                                      "publisher_type": {
                                        "hidden": "true"
                                      }
                                    }
                                  },
                                  "environment": {
                                    "fields": {
                                      "environment_type": {
                                        "hidden": "true"
                                      },
                                      "image": {
                                        "order" : 1
                                      },
                                      "imagetag": {
                                        "order" : 2
                                      },
                                      "resources": {
                                        "order" : 3,
                                        "type": "depositgroup-object-array"
                                      },
                                      "envscript": {
                                        "order" : 4
                                      },
                                      "envvars": {
                                        "order" : 5
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "processes": {
                  },
                  "environments": {
                    "type": "depositgroup-array",
                  },
                  "publishers": {
                    "type": "depositgroup-array",
                  }
                }
              }
            }
          }
        }
      },
      "publications": {
        "order": 9,
        "type": "depositgroup-array",
        "fields": {
          "item": {
            "fields": {
              "access": {
                "order": 1,
                "placeholder": "Selection Criteria",
                "type": "radio",
                "removeDefaultNone": true
              },
              "persistent_identifiers": {
                "order": 2,
                "type": "depositgroup-object-array",
                "fields": {
                  "item": {
                    "fields": {
                      "identifier": {
                        "order": 1,
                        "placeholder": "E.g. a DUNS number"
                      },
                      "scheme": {
                        "order": 2,
                        "placeholder": "E.g. DUNS"
                      }
                    }
                  }
                }
              },
              "url": {
                "order": 3,
                "placeholder": "E.g. http://arxiv.org/abs/1403.5294"
              },
              "document_type": {
                "order": 4,
                "placeholder": "E.g. preprint"
              },
              "comment": {
                "order": 5,
                "placeholder": "E.g. internal draft"
              }
            }
          }
        }
      }
    }
  };
