window.schemaOptions = {
    "fields": {
      "basic_info": {
        "type": "depositgroup",
        "fields": {
          "analysis_name": {
            "typeahead": {
              "config": {
                "minLength": 1
              },
              "datasets": {
                  "type": "remote",
                  "source": "/static/jsonschemas/fields/lhcb_ana_titles.json"
              }
            },
            "typeaheadd": {
              "config": {
                "autoselect": true,
                "highlight": true,
                "hint": true,
                "minLength": 1
              },
              "datasets": {
                "type": "prefetch",
                "source": "/deposit/das/autocomplete?query=%QUERY"
              },
              "importSource": {
                "type": "origin",
                "method": "get",
                "source": "/deposit/das",
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
            }
          }
        },
        "view": "invenio-view"
      },
      "dst_selection": {
        "type": "depositgroup",
        "fields": {
          "input_data": {
            "type": "depositgroup-object",
            "fields": {
              "data": {
                "type": "depositgroup-object-array",
                "fields": {
                  "item": {
                    "fields": {
                      "year": {

                      },
                      "reconstruction_software": {

                      },
                      "stripping_software": {

                      },
                      "location": {

                      }
                    }
                  }
                }
              },
              "mc_data": {
                "type": "depositgroup-object-array"
              }
            }
          },
          "code": {
            "type": "depositgroup-object",
            "fields": {
              "lhcb_code": {
                "type": "depositgroup-object-array",
                "fields": {
                  "item": {
                    "placeholder": " e.g DaVinci v33r6"
                  }
                }
              },
              "user_code": {
                "type": "depositgroup-object-array"
              }
            }
          },
          "output_data": {
            "type": "depositgroup-object"
          }
        },
        "view": "invenio-view"
      },
      "analysis_steps": {
        "type": "depositgroup-array",
        "toolbarSticky": "true",
        "fields": {
          "item": {
            "fields": {
              "input_data": {
                "type": "depositgroup-object",
                "fields": {
                  "data": {
                    "type": "depositgroup-object-array"
                  },
                  "mc_data": {
                    "type": "depositgroup-object-array"
                  }
                }
              },
              "code": {
                "type": "depositgroup-object",
                "fields": {
                  "lhcb_code": {
                    "type": "depositgroup-object-array",
                    "fields": {
                      "item": {
                        "placeholder": " e.g DaVinci v33r6"
                      }
                    }
                  },
                  "user_code": {
                    "type": "depositgroup-object-array"
                  }
                }
              },
              "output_data": {
                "type": "depositgroup-object"
              }
            }
          }
        }
      },
      "documentations": {
        "order": 6,
        "type": "depositgroup-array",
        "toolbarSticky": "true",
        "fields": {
          "item": {
            "fields": {
              "url": {
                "order": 1
              },
              "keyword": {
                "order": 2
              },
              "comment": {
                "order": 3
              }
            }
          }
        }
      },
      "internal_discussions": {
        "type": "depositgroup-array",
        "order": 7,
        "fields": {
        },
        "view": "invenio-view"
      },
      "presentations": {
        "type": "depositgroup-array",
        "order": 8,
        "fields": {
        },
        "view": "invenio-view"
      },
      "publications": {
        "order": 9,
        "type": "depositgroup-array",
        "fields": {
          "item": {
            "fields": {
              "journal_title": {
                "order": 1
              },
              "journal_year": {
                "order": 2
              },
              "journal_volume": {
                "order": 3
              },
              "journal_issue": {
                "order": 4
              },
              "journal_page": {
                "order": 5
              },
              "persistent_identifiers": {
                "type": "depositgroup-object-array",
                "order": 6
              }
            }
          }
        }
      }
    },
    "view": "invenio-view"
  };
