#! /usr/bin/env node
const copyPaste = require("copy-paste")
const Tesseract = require("tesseract.js")
let args = process.argv.slice(2)
let lang = "eng"
const usageTmpl = `Command line utility that copies image text to clipboard

Usage: imgclip PATH [options...]

Options:

	--lang LANGUAGE    language of the text in the image. 

Full language list can be found here: https://github.com/naptha/tesseract.js/blob/master/docs/tesseract_lang_list.md`

function printUsage() {
	console.log(usageTmpl)
}

if (args.length == 0 || args.length > 3) {
	printUsage()
} else {
	for (let i = 0; i < args.length - 1; i++) {
		if (args[i] == "--lang") {
			lang = args[i + 1]
			args.splice(i, 2)
			console.log(args)
		}
	}
	recognize(args[0], lang)
}

function recognize(imagePath, lang) {
	Tesseract.recognize(imagePath, {
		lang
	})
	.catch(err => {
		console.log(err)
	})
	.then(result => {
		copyPaste.copy(result.text, () => {
			console.log("Finished copying to clipboard")
			process.exit()
		})
	})
}
