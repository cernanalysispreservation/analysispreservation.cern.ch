#!/usr/bin/env sh

# Creation of the database and tables.
cap db init
cap db create

# Creation of a default user.
cap users create info@inveniosoftware.org -a --password infoinfo

# Creation of ElasticSearch indices
cap index init

# Creation of collections (Invenio-Collections)
cap collections create CERNAnalysisPreservation
cap collections create CMS -p CERNAnalysisPreservation
cap collections create CMSQuestionnaire -p CMS
cap collections create CMSAnalysis -p CMS
cap collections create LHCb -p CERNAnalysisPreservation
cap collections create LHCbAnalysis -p LHCb
cap collections create ATLAS -p CERNAnalysisPreservation
cap collections create ATLASWorkflows -p ATLAS
cap collections create ALICE -p CERNAnalysisPreservation
