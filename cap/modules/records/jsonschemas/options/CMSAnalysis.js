var cms_triggers = {};
var datasource_triggerRunPeriod = function(callback){
  $.get("/static/jsonschemas/fields/cms_triggers.json", function(data){
    cms_triggers = data;
    var result = Object.keys(data);
    callback(result);
  });
};

window.schemaOptions = {
    "fields": {
      "basic_info": {
        "order": 1,
        "label": false,
        "type": "depositgroup",
        "fields": {
          "analysis_number": {
            "order": 1,
            "placeholder": "Please provide CADI analysis number to connect, e.g. CMS-ANA-2012-049"
          },
          "abstract": {
            "order": 2,
            "type": "textarea",
            "rows": 5,
            "placeholder": "If not provided here the abstract can be extracted from the final paper."
          },
          "conclusion": {
            "order": 4,
            "type": "textarea",
            "rows": 5,
            "placeholder": "Please provide a short conclusion for the analysis."
          },
          "os": {
            "type": "depositgroup-object",
            "order": 5,
            "fields": {
              "name": {
                "placeholder": "Name, e.g. SLC"
              },
              "version": {
                "placeholder": "Version, e.g. 6"
              }
            }
          },
          "software": {
            "type": "depositgroup-object",
            "order": 6,
            "fields": {
              "name": {
                "placeholder": "Name, e.g. CMSSW"
              },
              "version": {
                "placeholder": "Version, e.g. 5_3_x"
              },
              "global_tag": {
                "placeholder": "Tag"
              }
            }
          }
        }
      },
      "input_datasets": {
        "type": "depositgroup",
        "order": 2,
        "label": false,
        "fields": {
          "primary_datasets": {
            "type": "depositgroup-object-quickfill",
            "order": 1,
            "droplist": "true",
            "actionbar": false,
            "toolbarSticky": false,
            "typeahead": {
              "config": {
                "autoselect": true,
                "highlight": true,
                "hint": true,
                "minLength": 1
              },
              "datasets": {
                "type": "remote",
                "source": "/CMS/das/autocomplete?query=%QUERY"
              }
            },
            "fields": {
              "item": {
                "fields": {
                  "dataset_metadata": {
                    "order": 1,
                    "type": "object-autocomplete-import",
                    "label": "Primary Dataset",
                    "typeahead": {
                      "config": {
                        "autoselect": true,
                        "highlight": true,
                        "hint": true,
                        "minLength": 1
                      },
                      "datasets": {
                        "type": "remote",
                        "source": "/CMS/das/autocomplete?query=%QUERY"
                      },
                      "importSource": {
                        "type": "origin",
                        "method": "get",
                        "source": "/CMS/das",
                        "data": "query"
                      },
                      "correlation": {
                        "title": "name",
                        "@type": "",
                        "description": "physics_group_name",
                        "licence": "",
                        "persistent_identifiers": "",
                        "issued": "creation_time",
                        "modified":"modification_time",
                        "available": "",
                        "run_number": "",
                        "dataset_id": "dataset_id",
                        "type": "datatype",
                        "numbers": {
                          "nblocks": "nblocks",
                          "nfiles": "nfiles",
                          "nevents": "nevents",
                          "nlumis": "nlumis"
                        }
                      }
                    },
                    "queryField": "title",
                    "fields": {
                      "title": {
                        "order": 0
                      },
                      "@type": {
                        "order": 2
                      },
                      "description": {
                        "order": 1
                      },
                      "licence": {
                        "order": 9
                      },
                      "persistent_identifiers": {
                        "order": 12,
                        "type": "depositgroup-object-array"
                      },
                      "issued": {
                        "order": 6
                      },
                      "modified": {
                        "order": 7
                      },
                      "available": {
                        "order": 8
                      },
                      "run_number": {
                        "order": 5
                      },
                      "dataset_id": {
                        "order": 3
                      },
                      "type": {
                        "order": 10
                      },
                      "numbers": {
                        "order": 4
                      }
                    }
                  },
                  "triggers": {
                    "order": 11,
                    "actionbarStyle": "bottom",
                    "toolbarSticky": "true",
                    "type": "depositgroup-object-array",
                    "fields": {
                      "item": {
                        "fields": {
                          "trigger": {
                            "order": 3,
                            "noneLabel": "Trigger",
                            "type": "select2",
                            "select2": true
                          },
                          "element": {
                            "order": 2,
                            "noneLabel": "Element",
                            "type": "select2",
                            "select2": true
                          },
                          "run_period": {
                            "order": 1,
                            "type": "select2",
                            "noneLabel": "Year",
                            "select2": true,
                            "dataSource": datasource_triggerRunPeriod
                          },
                          "trigger_efficiency": {
                            "order": 4
                          }
                        },
                        "postRender": function(callback){
                          var triggerYear = this.childrenByPropertyId["run_period"];
                          var triggerElement = this.childrenByPropertyId["element"];
                          var triggerTrigger = this.childrenByPropertyId["trigger"];
                          triggerTrigger.subscribe(triggerElement, function(element){
                            var year = triggerYear.getValue();
                            this.schema.enum = this.options.optionLabels = cms_triggers[year][element];
                            this.refresh();
                          });
                          triggerElement.subscribe(triggerYear, function(year){
                            if (cms_triggers && cms_triggers[year]) {
                              this.schema.enum = this.options.optionLabels = Object.keys(cms_triggers[year]);
                            }
                            this.refresh();
                          });
                          callback();
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "mc_sig_dataset": {
            "type": "depositgroup-object-quickfill",
            "order": 2,
            "droplist": "true",
            "actionbar": false,
            "toolbarSticky": false,
            "typeahead": {
              "config": {
                "autoselect": true,
                "highlight": true,
                "hint": true,
                "minLength": 1
              },
              "datasets": {
                "type": "remote",
                "source": "/CMS/das/autocomplete?query=%QUERY"
              }
            },
            "fields": {
              "item": {
                "fields": {
                  "dataset_metadata": {
                    "type": "object-autocomplete-import",
                    "label": "MC Dataset",
                    "typeahead": {
                      "config": {
                        "autoselect": true,
                        "highlight": true,
                        "hint": true,
                        "minLength": 1
                      },
                      "datasets": {
                        "type": "remote",
                        "source": "/CMS/das/autocomplete?query=%QUERY"
                      },
                      "importSource": {
                        "type": "origin",
                        "method": "get",
                        "source": "/CMS/das",
                        "data": "query"
                      },
                      "correlation": {
                        "title": "name",
                        "@type": "",
                        "description": "physics_group_name",
                        "licence": "",
                        "persistent_identifiers": "",
                        "issued": "creation_time",
                        "modified":"modification_time",
                        "available": "",
                        "run_number": "",
                        "dataset_id": "dataset_id",
                        "type": "datatype",
                        "numbers": {
                          "nblocks": "nblocks",
                          "nfiles": "nfiles",
                          "nevents": "nevents",
                          "nlumis": "nlumis"
                        }
                      }
                    },
                    "queryField": "title",
                    "fields": {
                      "title": {
                        "order": 0
                      },
                      "@type": {
                        "order": 2
                      },
                      "description": {
                        "order": 1
                      },
                      "licence": {
                        "order": 9
                      },
                      "persistent_identifiers": {
                        "order": 12,
                        "type": "depositgroup-object-array"
                      },
                      "issued": {
                        "order": 6
                      },
                      "modified": {
                        "order": 7
                      },
                      "available": {
                        "order": 8
                      },
                      "run_number": {
                        "order": 5
                      },
                      "dataset_id": {
                        "order": 3
                      },
                      "type": {
                        "order": 10
                      },
                      "numbers": {
                        "order": 4
                      }
                    }
                  },
                  "mc_signal_selection": {
                    "order": 6,
                    "type": "depositgroup-object-array",
                    "fields": {
                      "item": {
                        "fields": {
                          "signal": {
                            "order": 1,
                            "placeholder": ""
                          },
                          "bin": {
                            "order": 2,
                            "type": "depositgroup-object",
                            "fields": {
                              "pt_hat": {
                                "order": 1,
                                "placeholder": ""
                              },
                              "num_events": {
                                "order": 2,
                                "placeholder": ""
                              }
                            }
                          },
                          "generator_tune": {
                            "order": 3,
                            "type": "depositgroup-object",
                            "fields": {
                              "generator": {
                                "order": 1,
                                "placeholder": "Generator",
                                "noneLabel": "Select Generator",
                                "type": "select2",
                                "select2": true
                              },
                              "tune": {
                                "order": 2,
                                "placeholder": "Tune",
                                "noneLabel": "Select Tune",
                                "type": "select2",
                                "select2": true
                              }
                            }
                          },
                          "pT": {
                            "order": 4,
                            "placeholder": ""
                          },
                          "rapidity": {
                            "order": 5,
                            "type": "radio",
                            "vertical": "false",
                            "removeDefaultNone": "true"
                          },
                          "decay_channel": {
                            "order": 6,
                            "placeholder": ""
                          },
                          "decay_engine": {
                            "order": 7,
                            "placeholder": "Decay Engine",
                            "noneLabel": "Select Decay Engine",
                            "type": "select2",
                            "select2": true
                          },
                          "additional_info": {
                            "order": 8,
                            "placeholder": ""
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "mc_bg_dataset": {
            "type": "depositgroup-object-quickfill",
            "order": 3,
            "droplist": "true",
            "actionbar": false,
            "toolbarSticky": false,
            "typeahead": {
              "config": {
                "autoselect": true,
                "highlight": true,
                "hint": true,
                "minLength": 1
              },
              "datasets": {
                "type": "remote",
                "source": "/CMS/das/autocomplete?query=%QUERY"
              }
            },
            "fields": {
              "item": {
                "fields": {
                  "dataset_metadata": {
                    "type": "object-autocomplete-import",
                    "label": "MC Dataset",
                    "typeahead": {
                      "config": {
                        "autoselect": true,
                        "highlight": true,
                        "hint": true,
                        "minLength": 1
                      },
                      "datasets": {
                        "type": "remote",
                        "source": "/CMS/das/autocomplete?query=%QUERY"
                      },
                      "importSource": {
                        "type": "origin",
                        "method": "get",
                        "source": "/CMS/das",
                        "data": "query"
                      },
                      "correlation": {
                        "title": "name",
                        "@type": "",
                        "description": "physics_group_name",
                        "licence": "",
                        "persistent_identifiers": "",
                        "issued": "creation_time",
                        "modified":"modification_time",
                        "available": "",
                        "run_number": "",
                        "dataset_id": "dataset_id",
                        "type": "datatype",
                        "numbers": {
                          "nblocks": "nblocks",
                          "nfiles": "nfiles",
                          "nevents": "nevents",
                          "nlumis": "nlumis"
                        }
                      }
                    },
                    "queryField": "title",
                    "fields": {
                      "title": {
                        "order": 0
                      },
                      "@type": {
                        "order": 2
                      },
                      "description": {
                        "order": 1
                      },
                      "licence": {
                        "order": 9
                      },
                      "persistent_identifiers": {
                        "order": 12,
                        "type": "depositgroup-object-array"
                      },
                      "issued": {
                        "order": 6
                      },
                      "modified": {
                        "order": 7
                      },
                      "available": {
                        "order": 8
                      },
                      "run_number": {
                        "order": 5
                      },
                      "dataset_id": {
                        "order": 3
                      },
                      "type": {
                        "order": 10
                      },
                      "numbers": {
                        "order": 4
                      }
                    }
                  },
                  "background": {
                    "order": 7,
                    "title": "Background",
                    "type": "depositgroup-object-array",
                    "fields": {
                      "item": {
                        "fields": {
                          "generator_tune": {
                            "order": 1,
                            "type": "depositgroup-object",
                            "fields": {
                              "generator": {
                                "order": 1,
                                "placeholder": "Generator",
                                "noneLabel": "Select Generator",
                                "type": "select2",
                                "select2": true
                              },
                              "tune": {
                                "order": 2,
                                "placeholder": "Tune",
                                "noneLabel": "Select Tune",
                                "type": "select2",
                                "select2": true
                              }
                            }
                          },
                          "collision_species": {
                            "order": 2,
                            "placeholder": "Collision Species",
                            "noneLabel": "Select Collision Species",
                            "type": "select2",
                            "select2": true
                          },
                          "collision_energy": {
                            "order": 3,
                            "placeholder": ""
                          },
                          "bin": {
                            "order": 4,
                            "type": "depositgroup-object",
                            "fields": {
                              "pt_hat": {
                                "order": 1,
                                "placeholder": ""
                              },
                              "num_events": {
                                "order": 2,
                                "placeholder": ""
                              }
                            }
                          },
                          "additional_info": {
                            "order": 5,
                            "placeholder": ""
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
      "input_code_output": {
        "type": "depositgroup",
        "order": 3,
        "label": false,
        "fields": {
          "code_base": {
            "order": 1,
            "type": "depositgroup-object",
            "toolbarSticky": "true",
            "fields": {
              "url": {
                "type": "url-harvest",
                "placeholder": "E.g. git@github.com:johndoe/myrepo.git",
                "order": 1
              },
              "tag": {
                "placeholder": "E.g. v2.1",
                "order": 2
              }
            }
          },
          "n_tuple": {
            "order": 2,
            "type": "depositgroup-object-array",
            "toolbarSticky": "true",
            "fields": {
              "item": {
                "fields": {
                  "input_data": {
                    "type": "depositgroup-object",
                    "order": 1,
                    "fields": {
                      "dataset": {
                        "order": 1,
                        "noneLabel": "Select Dataset",
                        "type": "select2",
                        "select2": true
                      }
                    }
                  },
                  "user_code": {
                    "type": "depositgroup-object",
                    "order": 2,
                    "fields": {
                      "config_files": {
                        "placeholder": "E.g. git@github.com:johndoe/myrepo.git"
                      }
                    }
                  },
                  "run_instructions": {
                    "type": "depositgroup-object",
                    "order": 3,
                    "fields": {
                      "type": {
                        "type": "select",
                        "optionLabels": ["README file", "Makefile", "Upload something else"]
                      }
                    }
                  },
                  "output_data": {
                    "type": "depositgroup-object",
                    "order": 4,
                    "fields": {
                      "output_url": {
                        "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-data.root"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "main_measurements": {
        "order": 4,
        "toolbarSticky": "true",
        "type": "depositgroup-array",
        "fields": {
          "item": {
            "fields": {
              "measurement_description": {
                "order": 1,
                "placeholder": "E.g. signal measurement of NNN in Z -> ee final state"
              },
              "detailed_measurement_description": {
                "order": 2,
                "type": "textarea",
                "rows": 10,
                "placeholder": "If applicable, please provide a more detailed description for this measurement"
              },
              "code_base": {
                "order": 4,
                "type": "depositgroup-object",
                "toolbarSticky": "true",
                "fields": {
                  "url": {
                    "type": "url-harvest",
                    "placeholder": "E.g. git@github.com:johndoe/myrepo.git",
                    "order": 1
                  },
                  "tag": {
                    "placeholder": "E.g. v2.1",
                    "order": 2
                  }
                }
              },
              "n_tuple": {
                "order": 5,
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "fields": {
                  "item": {
                    "fields": {
                      "input_data": {
                        "type": "depositgroup-object",
                        "order": 1,
                        "fields": {
                          "dataset": {
                            "order": 1,
                            "noneLabel": "Select Dataset",
                            "type": "select2",
                            "select2": true
                          }
                        }
                      },
                      "user_code": {
                        "type": "depositgroup-object",
                        "order": 2,
                        "fields": {
                          "config_files": {
                            "placeholder": "E.g. git@github.com:johndoe/myrepo.git"
                          }
                        }
                      },
                      "run_instructions": {
                        "type": "depositgroup-object",
                        "order": 3,
                        "fields": {
                          "type": {
                            "type": "select",
                            "optionLabels": ["README file", "Makefile", "Upload something else"]
                          }
                        }
                      },
                      "output_data": {
                        "type": "depositgroup-object",
                        "order": 4,
                        "fields": {
                          "output_url": {
                            "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-data.root"
                          }
                        }
                      }
                    }
                  }
                }
              },
              "detector_final_state": {
                "type": "depositgroup-object",
                "order": 3,
                "label": false,
                "fields": {
                  "final_state_particles": {
                    "order": 1,
                    "minItems": 1,
                    "type": "depositgroup-object-array",
                    "fields": {
                      "item": {
                        "fields": {
                          "object": {
                            "placeholder": "Object",
                            "noneLabel": "Select Object",
                            "type": "select2",
                            "select2": true,
                            "order": 1
                          },
                          "jet_type": {
                            "noneLabel": "Select Jet",
                            "type": "select2",
                            "select2": true,
                            "order": 2,
                            "dependencies": {
                              "object": ["jet", "bjet"]
                            }
                          },
                          "sel_criteria": {
                            "placeholder": "Selection Criteria",
                            "type": "radio",
                            "removeDefaultNone": true,
                            "optionLabels": [
                              "Tight",
                              "Loose"
                            ],
                            "order": 4,
                            "dependencies": {
                              "object": ["electron", "muon", "tau"]
                            }
                          },
                          "number": {
                            "placeholder": "Number, e.g. 1",
                            "order": 3,
                            "type": "depositgroup-object",
                            "fields": {
                              "sign": {
                                "order": 1,
                                "type": "select2",
                                "removeDefaultNone": "true"
                              },
                              "number": {
                                "order": 2
                              }
                            }
                          },
                          "pt_cut": {
                            "placeholder": "PT Cut, e.g. > 20 Gev",
                            "type": "depositgroup-object-array",
                            "order": 5,
                            "fields": {
                              "item": {
                                "fields": {
                                  "sign": {
                                    "order": 1,
                                    "type": "select2",
                                    "removeDefaultNone": "true"
                                  },
                                  "number": {
                                    "order": 2
                                  }
                                }
                              }
                            }
                          },
                          "era_cut": {
                            "placeholder": "ETA Cut, e.g. < 2.1",
                            "type": "depositgroup-object-array",
                            "order": 6,
                            "fields": {
                              "item": {
                                "fields": {
                                  "sign": {
                                    "order": 1,
                                    "type": "select2",
                                    "removeDefaultNone": "true"
                                  },
                                  "number": {
                                    "order": 2
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "veto": {
                    "order": 2,
                    "minItems": 1,
                    "type": "depositgroup-object-array",
                    "fields": {
                      "item": {
                        "fields": {
                          "particle": {
                            "placeholder": "Particle",
                            "noneLabel": "Select Particle",
                            "type": "select2",
                            "select2": true,
                            "order": 1
                          },
                          "number": {
                            "placeholder": "Number, e.g. 1",
                            "order": 2
                          },
                          "pt_cut": {
                            "placeholder": "PT Cut, e.g. > 20 Gev",
                            "order": 3
                          },
                          "era_cut": {
                            "placeholder": "ETA Cut, e.g. < 2.1",
                            "order": 4
                          }
                        }
                      }
                    }
                  }
                }
              },
              "event_selection": {
                "order": 7,
                "type": "depositgroup-object",
                "fields": {
                  "event_filter": {
                    "placeholder": "Event Filter",
                    "noneLabel": "Select Event Filter",
                    "type": "select2",
                    "select2": true,
                    "order": 1
                  },
                  "reference": {
                    "order": 2,
                    "placeholder": ""
                  }
                }
              }
            }
          }
        }
      },
      "auxiliary_measurements": {
        "order": 5,
        "toolbarSticky": "true",
        "type": "depositgroup-array",
        "fields": {
          "item": {
            "fields": {
              "measurement_description": {
                "order": 1,
                "placeholder": "Please provide some description for this measurement"
              },
              "detailed_measurement_description": {
                "order": 2,
                "type": "textarea",
                "rows": 10,
                "placeholder": "If applicable, please provide a more detailed description for this measurement"
              },
              "code_base": {
                "order": 4,
                "type": "depositgroup-object",
                "toolbarSticky": "true",
                "fields": {
                  "url": {
                    "type": "url-harvest",
                    "placeholder": "E.g. git@github.com:johndoe/myrepo.git",
                    "order": 1
                  },
                  "tag": {
                    "placeholder": "E.g. v2.1",
                    "order": 2
                  }
                }
              },
              "n_tuple": {
                "order": 5,
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "fields": {
                  "item": {
                    "fields": {
                      "input_data": {
                        "type": "depositgroup-object",
                        "order": 1,
                        "fields": {
                          "dataset": {
                            "order": 1,
                            "noneLabel": "Select Dataset",
                            "type": "select2",
                            "select2": true
                          }
                        }
                      },
                      "user_code": {
                        "type": "depositgroup-object",
                        "order": 2,
                        "fields": {
                          "config_files": {
                            "placeholder": "E.g. git@github.com:johndoe/myrepo.git"
                          }
                        }
                      },
                      "run_instructions": {
                        "type": "depositgroup-object",
                        "order": 3,
                        "fields": {
                          "type": {
                            "type": "select",
                            "optionLabels": ["README file", "Makefile", "Upload something else"]
                          }
                        }
                      },
                      "output_data": {
                        "type": "depositgroup-object",
                        "order": 4,
                        "fields": {
                          "output_url": {
                            "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-data.root"
                          }
                        }
                      }
                    }
                  }
                }
              },
              "detector_final_state": {
                "type": "depositgroup-object",
                "order": 3,
                "label": false,
                "fields": {
                  "final_state_particles": {
                    "order": 1,
                    "minItems": 1,
                    "type": "depositgroup-object-array",
                    "fields": {
                      "item": {
                        "fields": {
                          "object": {
                            "placeholder": "Object",
                            "noneLabel": "Select Object",
                            "type": "select2",
                            "select2": true,
                            "order": 1
                          },
                          "jet_type": {
                            "noneLabel": "Select Jet",
                            "type": "select2",
                            "select2": true,
                            "order": 2,
                            "dependencies": {
                              "object": ["jet", "bjet"]
                            }
                          },
                          "sel_criteria": {
                            "placeholder": "Selection Criteria",
                            "type": "radio",
                            "removeDefaultNone": true,
                            "optionLabels": [
                              "Tight",
                              "Loose"
                            ],
                            "order": 4,
                            "dependencies": {
                              "object": ["electron", "muon", "tau"]
                            }
                          },
                          "number": {
                            "placeholder": "Number, e.g. 1",
                            "order": 3,
                            "type": "depositgroup-object",
                            "fields": {
                              "sign": {
                                "order": 1,
                                "type": "select2",
                                "removeDefaultNone": "true"
                              },
                              "number": {
                                "order": 2
                              }
                            }
                          },
                          "pt_cut": {
                            "placeholder": "PT Cut, e.g. > 20 Gev",
                            "type": "depositgroup-object-array",
                            "order": 5,
                            "fields": {
                              "item": {
                                "fields": {
                                  "sign": {
                                    "order": 1,
                                    "type": "select2",
                                    "removeDefaultNone": "true"
                                  },
                                  "number": {
                                    "order": 2
                                  }
                                }
                              }
                            }
                          },
                          "era_cut": {
                            "placeholder": "ETA Cut, e.g. < 2.1",
                            "type": "depositgroup-object-array",
                            "order": 6,
                            "fields": {
                              "item": {
                                "fields": {
                                  "sign": {
                                    "order": 1,
                                    "type": "select2",
                                    "removeDefaultNone": "true"
                                  },
                                  "number": {
                                    "order": 2
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "veto": {
                    "order": 2,
                    "minItems": 1,
                    "type": "depositgroup-object-array",
                    "fields": {
                      "item": {
                        "fields": {
                          "particle": {
                            "placeholder": "Particle",
                            "noneLabel": "Select Particle",
                            "type": "select2",
                            "select2": true,
                            "order": 1
                          },
                          "number": {
                            "placeholder": "Number, e.g. 1",
                            "order": 2
                          },
                          "pt_cut": {
                            "placeholder": "PT Cut, e.g. > 20 Gev",
                            "order": 3
                          },
                          "era_cut": {
                            "placeholder": "ETA Cut, e.g. < 2.1",
                            "order": 4
                          }
                        }
                      }
                    }
                  }
                }
              },
              "event_selection": {
                "order": 7,
                "type": "depositgroup-object",
                "fields": {
                  "event_filter": {
                    "placeholder": "Event Filter",
                    "noneLabel": "Select Event Filter",
                    "type": "select2",
                    "select2": true,
                    "order": 1
                  },
                  "reference": {
                    "order": 2,
                    "placeholder": ""
                  }
                }
              }
            }
          }
        }
      },
      "post_n_tuple": {
        "order": 6,
        "type": "depositgroup",
        "label": false,
        "fields": {
          "code_base": {
            "order": 1,
            "type": "depositgroup-object",
            "toolbarSticky": "true",
            "fields": {
              "url": {
                "type": "url-harvest",
                "placeholder": "E.g. git@github.com:johndoe/myrepo.git",
                "order": 1
              },
              "tag": {
                "placeholder": "E.g. v2.1",
                "order": 2
              }
            }
          },
          "n_tuple": {
            "order": 2,
            "type": "depositgroup-object-array",
            "toolbarSticky": "true",
            "fields": {
              "item": {
                "fields": {
                  "input_data": {
                    "type": "depositgroup-object",
                    "order": 1,
                    "fields": {
                      "dataset": {
                        "order": 1,
                        "noneLabel": "Select Dataset",
                        "type": "select2",
                        "select2": true
                      }
                    }
                  },
                  "user_code": {
                    "type": "depositgroup-object",
                    "order": 2,
                    "fields": {
                      "config_files": {
                        "placeholder": "E.g. git@github.com:johndoe/myrepo.git"
                      }
                    }
                  },
                  "run_instructions": {
                    "type": "depositgroup-object",
                    "order": 3,
                    "fields": {
                      "type": {
                        "type": "select",
                        "optionLabels": ["README file", "Makefile", "Upload something else"]
                      }
                    }
                  },
                  "output_data": {
                    "type": "depositgroup-object",
                    "order": 4,
                    "fields": {
                      "output_url": {
                        "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-data.root"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "documentations": {
        "order": 7,
        "type": "depositgroup-array",
        "toolbarSticky": "true",
        "fields": {
          "item": {
            "fields": {
              "CADI_ID": {
                "order": 1,
                "placeholder": "E.g. CMS-ANA-2012-049"
              },
                "url": {
                "order": 2,
                "placeholder": "E.g. https://twiki.cern.ch/twiki/..."
              },
              "keyword": {
                "order": 3,
                "placeholder": "E.g. keyword1"
              },
              "comment": {
                "order": 4,
                "placeholder": "E.g. Shows more detail concerning this analysis"
              }
            }
          }
        }
      },
      "internal_discussions": {
        "type": "depositgroup-array",
        "order": 8,
        "fields": {
          "item": {
            "fields": {
              "url": {
                "placeholder": "E.g. https://indico.cern.ch/event/.../discussion-slides.pdf"
              }
            }
          }
        }
      },
      "presentations": {
        "type": "depositgroup-array",
        "order": 9,
        "fields": {
          "item": {
            "fields": {
              "url": {
                "placeholder": "E.g. https://indico.cern.ch/event/524974/"
              }
            }
          }
        }
      },
      "publications": {
        "order": 10,
        "type": "depositgroup-array",
        "fields": {
          "item": {
            "fields": {
              "journal_title": {
                "order": 1,
                "placeholder": "Please enter the journal title"
              },
              "journal_year": {
                "order": 2,
                "placeholder": "Please enter the journal year"
              },
              "journal_volume": {
                "order": 3,
                "placeholder": "Please enter the journal volume"
              },
              "journal_issue": {
                "order": 4,
                "placeholder": "Please enter the journal issue"
              },
              "journal_page": {
                "order": 5,
                "placeholder": "Please enter the journal page number"
              },
              "persistent_identifiers": {
                "type": "depositgroup-object-array",
                "order": 6,
                "fields": {
                  "item": {
                    "fields": {
                      "identifier": {
                        "placeholder": "Please enter an issued identifier, e.g. a DUNS number"
                      },
                      "scheme": {
                        "placeholder": "Please enter an identifier scheme, e.g. DUNS"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "keywords": {
        "type": "tags",
        "format": "textarea",
        "order": 11,
        "placeholder": "E.g. keyword1, keyword2"
      }
    }
  };

// window.schemaPostRender = function(control) {
//   var triggerYear = control.childrenByPropertyId["run_period"];
//   var triggerElement = control.childrenByPropertyId["run_period"];
//   window.bb = control;
// };
