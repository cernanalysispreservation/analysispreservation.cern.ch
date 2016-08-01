#!/usr/bin/env sh

# Destroy db
cap db destroy --yes-i-know
# Init and create db
cap db init
cap db create

# Create collections
cap collections create CERNAnalysisPreservation
cap collections create CMS -p CERNAnalysisPreservation
cap collections create CMSQuestionnaire -p CMS -q '_type:cmsquestionnaire'
cap collections create CMSAnalysis -p CMS -q '_type:cmsanalysis'
cap collections create LHCb -p CERNAnalysisPreservation
cap collections create LHCbAnalysis -p LHCb -q '_type:lhcbanalysis'
cap collections create ATLAS -p CERNAnalysisPreservation
cap collections create ATLASWorkflows -p ATLAS -q '_type:atlasworkflows'
cap collections create ATLASAnalysis -p ATLAS -q '_type:atlasanalysis'
cap collections create ALICE -p CERNAnalysisPreservation
