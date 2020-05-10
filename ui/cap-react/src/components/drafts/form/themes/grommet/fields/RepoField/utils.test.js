import each from 'jest-each';

let gitParseUrl = () => {};

const urlToRepo = [
	[
		"https://github.com/cernanalysispreservation/analysispreservation.cern.ch/pulls",
		{ owner: "cernanalysispreservation", ref: "", name: "analysispreservation.cern.ch" }
	],
	[
		"https://github.com/cernanalysispreservation/analysispreservation.cern.ch/pulls/154",
		{ owner: "cernanalysispreservation", ref: "154", name: "analysispreservation.cern.ch" }
	],
	[
		"https://github.com/cernanalysispreservation/analysispreservation.cern.ch/tree",
		{ owner: "cernanalysispreservation", ref: "", name: "analysispreservation.cern.ch" }
	],
	[
		"https://github.com/cernanalysispreservation/analysispreservation.cern.ch/tree/booom",
		{ owner: "cernanalysispreservation", ref: "booom", name: "analysispreservation.cern.ch" }
	],
	[
		"https://github.com/mattphillips/jest-each#importing",
		{ owner: "mattphillips", ref: "", full_name: "mattphillips/jest-each", name: "jest-each" }
	],
	[
		"https://gitlab.cern.ch/invenio/template-openshift/-/merge_requests/6/diffs",
		{ owner: "invenio", ref: "", full_name: "invenio/template-openshift", name: "template-openshift" }
	],
	[
		"https://gitlab.cern.ch/invenio/template-openshift/-/tree/adding-import-images-step",
		{ owner: "invenio", ref: "adding-import-images-step", full_name: "invenio/template-openshift", name: "template-openshift" }
	],
]

each(urlToRepo).test('gitParseUrl get url and returns owner,branch,repo', (url, repo) => {
	expect(gitParseUrl(url)).toMatchObject(repo)
})