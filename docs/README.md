# README

To build this documentation with Gitbook you have to follow a few simple steps.

## Setup the Environment

First, install the necessary requirements:

    npm install @gitbook-ng/gitbook

> WARNING!!! The previously used `gitbook-cli` package (`gitbookIO/gitbook-cli`) was 
> deprecated and is not maintained anymore by the developers
> 
> ## Migrate from legacy gitbook-cli
>
> First you need uninstall `gitbook-cli` (optionally, recommend to save your disk space):
>
> ```bash
> npm uninstall gitbook-cli -g
> rm -fr ~/.gitbook   # Remove legacy gitbook global installation
> ```
>
> Then run: `npm install @gitbook-ng/gitbook`
>


Second, clone the repository (or your own fork) if you have not done so already:

    git clone https://github.com/cernanalysispreservation/analysispreservation.cern.ch.git cap

Third, navigate to the documentation directory (`docs`) inside your repository folder:

    cd docs

and install the dependencies:

    gitbook install

Now you are all set. Whenever you want to build your docs in the future, just follow the below instructions.

## Serve and develop the docs

To build the docs, switch into the docs folder inside your repository folder

    cd ~/PATH_TO_YOUR_REPO_FOLDER/cap/docs

and run

    gitbook serve

You should now have a newly created direcotry called `_book`. Inside you will find all the static files needed to serve with your deployment

## Build the docs

To build the docs, switch into the docs folder inside your repository folder

    cd ~/PATH_TO_YOUR_REPO_FOLDER/cap/docs

and run

    gitbook build

You should now have a newly created direcotry called `_book`. Inside you will find all the static files needed to serve with your deployment
