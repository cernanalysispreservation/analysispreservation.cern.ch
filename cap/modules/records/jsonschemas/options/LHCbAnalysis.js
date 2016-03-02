window.schemaOptions = {
    "fields": {
      "basic_info": {
        "type": "depositgroup",
        "order": 1,
        "fields": {
          "analysis_name": {
            "label": "Analysis Name",
            "placeholder": "Start typing and select an Analysis Name to import metadata",
            "typeahead": {
              "config": {
                "minLength": 1
              },
              "datasets": {
                "type": "prefetch",
                "source": "/static/jsonschemas/fields/lhcb_ana_titles.json"
              },
              "importSource": {
                "type": "origin",
                "method": "get",
                "source": "/LHCb/api/analysis",
                "data": "title"
              },
              "correlation": {
                "#": {
                  "basic_info": {
                    "analysis_number": "ananote"
                  },
                  "internal_discussions": "internal_discussions",
                  "presentations": "presentations",
                  "publications": "publications",
                  "extra_info": {
                    "status": "status",
                    "twiki": "twiki",
                    "egroup": "egroup",
                    "arxiv": "arxiv"
                  },
                }
              }
            }
          }
        }
      },
      "dst_selection": {
        "type": "depositgroup",
        "order": 3,
        "fields": {
          "input_data": {
            "type": "depositgroup-object",
            "fields": {
              "data": {
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "fields": {
                  "item": {
                    "fields": {
                      "year": {
                        "order": 4
                      },
                      "reconstruction_software": {
                        "order": 2

                      },
                      "stripping_software": {
                        "order": 3

                      },
                      "location": {
                        "order": 1
                      }
                    }
                  }
                }
              },
              "mc_data": {
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "fields": {
                  "item": {
                    "fields": {
                      "mc_production": {
                        "order": 2
                      },
                      "generator": {
                        "order": 3
                      },
                      "reconstruction_software": {
                        "order": 4
                      },
                      "stripping_software": {
                        "order": 5
                      },
                      "location": {
                        "order": 1
                      }
                    }
                  }
                }
              }
            }
          },
          "code": {
            "type": "depositgroup-object",
            "fields": {
              "lhcb_code": {
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "fields": {
                  "item": {
                    "placeholder": " e.g DaVinci v33r6"
                  }
                }
              },
              "user_code": {
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "fields": {
                  "item": {
                    "fields": {
                      "link": {
                        "order": 1
                      },
                      "description": {
                        "order": 2
                      },
                      "instructions": {
                        "type": "textarea",
                        "order": 3
                      }
                    }
                  }
                }
              }
            }
          },
          "output_data": {
            "type": "depositgroup-object"
          }
        }
      },
      "analysis_steps": {
        "type": "depositgroup-array",
        "order": 4,
        "toolbarSticky": "true",
        "fields": {
          "item": {
            "fields": {
              "input_data": {
                "type": "depositgroup-object",
                "fields": {
                  "data": {
                    "type": "depositgroup-object-array",
                    "toolbarSticky": "true",
                    "fields": {
                      "items": {
                        "placeholder": "URL/Location"
                      }
                    }
                  },
                  "mc_data": {
                    "type": "depositgroup-object-array",
                    "toolbarSticky": "true"
                  }
                }
              },
              "code": {
                "type": "depositgroup-object",
                "fields": {
                  "lhcb_code": {
                    "type": "depositgroup-object-array",
                    "toolbarSticky": "true",
                    "fields": {
                      "item": {
                        "placeholder": " e.g DaVinci v33r6"
                      }
                    }
                  },
                  "user_code": {
                    "type": "depositgroup-object-array",
                    "toolbarSticky": "true",
                    "fields": {
                      "item": {
                        "fields": {
                          "instructions": {
                            "type": "textarea"
                          }
                        }
                      }
                    }
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
        "order": 8,
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
        "order": 5,
        "fields": {
        }
      },
      "presentations": {
        "type": "depositgroup-array",
        "order": 6,
        "fields": {
        }
      },
      "publications": {
        "order": 7,
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
      },
      "extra_info": {
        "type": "depositgroup",
        "order": 2
      }
    }
  };
