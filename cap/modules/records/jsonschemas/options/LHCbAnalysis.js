window.schemaOptions = {
    "fields": {
      "basic_info": {
        "type": "depositgroup",
        "order": 1,
        "fields": {
          "analysis_name": {
            "label": "Analysis Name",
            "placeholder": "Start typing and select an Analysis Name to import metadata. E.g. CPV in D0 -> KS KS",
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
          },
          "analysis_number": {
            "placeholder": "E.g. ANA-2015-014"
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
                        "order": 3,
                        "placeholder": ""
                      },
                      "location": {
                        "order": 1,
                        "placeholder": "e.g: sim://LHCb/Collision12/Beam4000GeV-VeloClosed-MagDown/RealData/Reco14/Stripping20/90000000 ( Full stream )/BHADR"
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
                        "order": 1,
                        "placeholder": "e.g: sim://MC/MC11a/Beam3500GeV-2011-MagDown-Nu2-50ns-EmNoCuts/Sim05a/Trig0x40760037Flagged/Reco12a/Stripping17NoPrescalingFlagged/42"
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
                "order": 2,
                "fields": {
                  "item": {
                    "placeholder": " e.g DaVinci v33r6"
                  }
                }
              },
              "user_code": {
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "order": 3,
                "fields": {
                  "item": {
                    "fields": {
                      "link": {
                        "order": 1,
                        "placeholder": "E.g. svn@svnweb.cern.ch/cern/wsvn/myrepo"
                      },
                      "description": {
                        "order": 2,
                        "placeholder": "Please enter the user code description, location, etc"
                      },
                      "instructions": {
                        "type": "textarea",
                        "order": 3,
                        "placeholder": "Please enter the instructions for using the code, e.g Open 'README' file"
                      }
                    }
                  }
                }
              },
              "platform": {
                "order": 1,
                "placeholder": "Please enter the platfrom name"
              }
            }
          },
          "output_data": {
            "type": "depositgroup-object",
            "fields": {
              "data": {
                "placeholder": "Please enter the final N Tuples files"
              },
              "mc_data": {
                "placeholder": "Please enter the final N Tuples files"
              }
            }
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
                      "item": {
                        "fields": {
                          "year": {
                            "order": 4
                          },
                          "reconstruction_software": {
                            "order": 2

                          },
                          "stripping_software": {
                            "order": 3,
                            "placeholder": ""
                          },
                          "location": {
                            "order": 1,
                            "placeholder": "e.g: sim://LHCb/Collision12/Beam4000GeV-VeloClosed-MagDown/RealData/Reco14/Stripping20/90000000 ( Full stream )/BHADR"
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
                            "order": 1,
                            "placeholder": "e.g: sim://MC/MC11a/Beam3500GeV-2011-MagDown-Nu2-50ns-EmNoCuts/Sim05a/Trig0x40760037Flagged/Reco12a/Stripping17NoPrescalingFlagged/42"
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
                    "order": 2,
                    "fields": {
                      "item": {
                        "placeholder": " e.g DaVinci v33r6"
                      }
                    }
                  },
                  "user_code": {
                    "type": "depositgroup-object-array",
                    "toolbarSticky": "true",
                    "order": 3,
                    "fields": {
                      "item": {
                        "fields": {
                          "link": {
                            "order": 1,
                            "placeholder": "E.g. svn@svnweb.cern.ch/cern/wsvn/myrepo"
                          },
                          "description": {
                            "order": 2,
                            "placeholder": "Please enter the user code description, location, etc"
                          },
                          "instructions": {
                            "type": "textarea",
                            "order": 3,
                            "placeholder": "Please enter the instructions for using the code, e.g Open 'README' file"
                          }
                        }
                      }
                    }
                  },
                  "platform": {
                    "order": 1,
                    "placeholder": "Please enter the platfrom name"
                  }
                }
              },
              "output_data": {
                "type": "depositgroup-object",
                "fields": {
                  "data": {
                    "placeholder": "Please enter the final N Tuples files"
                  },
                  "mc_data": {
                    "placeholder": "Please enter the final N Tuples files"
                  }
                }
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
          "item": {
            "fields": {
              "meeting": {
                "placeholder": "e.g: lhcb-general"
              },
              "url": {
                "placeholder": "Please enter the report URL"
              },
              "title": {
                "placeholder": "Please enter the title"
              }
            }
          }
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
        "order": 2,
        "fields": {
          "arxiv": {
            "placeholder": "e.g: 1508.06087"
          },
          "keywords": {
            "placeholder": "Please enter keywords here"
          },
          "egroup": {
            "placeholder": "e.g: lhcb-review-Charm-D0toKsKs"
          },
          "status": {
            "placeholder": "e.g: 9 - PAPER published"
          },
          "twiki": {
            "placeholder": "e.g: https://twiki.cern.ch/twiki/bin/view/LHCbPhysics/D0KSKS"
          }
        }
      }
    }
  };
