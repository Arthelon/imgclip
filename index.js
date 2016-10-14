#! /usr/bin/env node
const copyPaste = require("copy-paste")
const Tesseract = require("tesseract.js")
const Progress = require("progress")
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
		}
	}
	recognize(args[0], lang)
}

function recognize(imagePath, lang) {
	const bar = new Progress("recognizing [:bar] :percent :elapseds", {total: 100})
	let prev = 0
	Tesseract.recognize(imagePath, {
		lang
	})
	.progress(p => {
		const nextVal = Math.floor(p.progress * 100)
		if (nextVal && nextVal > prev) {
			bar.tick()
			prev++
		}
	})
	.catch(err => {
		console.log(err)
	})
	.then(result => {
		if (prev < 100) {
			bar.tick(100 - prev)
		}
		copyPaste.copy(result.text, () => {
			console.log("Finished copying to clipboard")
			process.exit()
		})
	})
}