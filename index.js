#! /usr/bin/env node
const copyPaste = require('copy-paste')
const Tesseract = require('tesseract.js')
const Progress = require('progress')
const package = require('./package.json')
let text
let args = process.argv.slice(2)
let lang = 'eng'
let langs = ['afr', 'ara', 'aze', 'bel', 'ben', 'ben', 'bul', 'cat', 'ces', 'chi_sim', 'chi_tra', 'chr', 'dan', 'deu', 'ell', 'eng', 'enm', 'epo', 'epo_alt', 'equ', 'est', 'eus', 'fin', 'fra', 'frk', 'frm', 'glg', 'grc', 'heb', 'hin', 'hrv', 'hun', 'ind', 'isl', 'ita', 'ita_old', 'jpn', 'kan', 'kor', 'lav', 'lit', 'mal', 'mkd', 'mlt', 'msa', 'nld', 'nor', 'pol', 'por', 'ron', 'rus', 'slk', 'slv', 'spa', 'spa_old', 'sqi', 'srp', 'swa', 'swe', 'tam', 'tel', 'tgl', 'tha', 'tur', 'ukr', 'vie']
let print = false
let version = false
const usageTmpl = `Command line utility that copies image text to clipboard

Usage: imgclip PATH [options...]

Options:

	--lang LANGUAGE    language of the text in the image.
	--print						 print out the text read.
	--version					 see the version of imgclip.

Full language list can be found here: https://github.com/naptha/tesseract.js/blob/master/docs/tesseract_lang_list.md`

function printUsage() {
	console.log(usageTmpl)
}

if (args.length == 0 || args.length > 5) {
	printUsage()
} else {
	for (let i = 0; i < args.length; i++) {
		if(args[i] == '--version') {
      version = true
		}
		if(args[i] == '--print') {
      print = true
		}
		if (args[i] == '--lang') {
			lang = args[i + 1]
		}
	}

  if(langs.indexOf(lang) > -1) {
		recognize(args[0], lang)
	} else {
		console.log('Invalid language!')
		printUsage()
	}
}

function recognize(imagePath, lang) {
	const bar = new Progress('recognizing [:bar] :percent :elapseds', {total: 100})
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
			if(print) {
				console.log('Result:\n' + result.text.slice(0, result.text.length - 1))
			}

			console.log('Finished copying to clipboard!')

			if(version) {
				console.log('Version: ' + package.version);
			}
			process.exit()
		})
	})
}
