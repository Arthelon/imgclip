#! /usr/bin/env node
const args = require("commander")
const copyPaste = require("copy-paste")
const Tesseract = require("tesseract.js")
const Progress = require("progress")
const PkgJson = require("./package.json")
const langs = ["afr", "ara", "aze", "bel", "ben", "ben", "bul", "cat", "ces", "chi_sim", "chi_tra", "chr", "dan", "deu", "ell", "eng", "enm", "epo", "epo_alt", "equ", "est", "eus", "fin", "fra", "frk", "frm", "glg", "grc", "heb", "hin", "hrv", "hun", "ind", "isl", "ita", "ita_old", "jpn", "kan", "kor", "lav", "lit", "mal", "mkd", "mlt", "msa", "nld", "nor", "pol", "por", "ron", "rus", "slk", "slv", "spa", "spa_old", "sqi", "srp", "swa", "swe", "tam", "tel", "tgl", "tha", "tur", "ukr", "vie"]
let print = false

//Used in help
args.usage("PATH [options]")
args.description(PkgJson.description)
args.version(PkgJson.version)

//Arguments (Order determines order shown in help)
args.option("-l, --lang [language]", "language of the text in the image.")
    .option("-p, --print", "prints out the text in the image."+
      "\n\nFull language list can be found here: \nhttps://github.com/naptha/tesseract.js/blob/master/docs/tesseract_lang_list.md")
args.parse(process.argv)

if(!args.args.length || args.args[0] === undefined){
	console.error("  No Path Specified")
	args.help()
	return
}

if(args.lang === true) {
  args.lang = "eng"
  recognize(args.args[0], args.lang)
}

if(langs.indexOf(args.lang) > -1) {
  recognize(args.args[0], args.lang)
} else {
  console.log("  Invalid Language!")
  args.help()
  return
}

if(args.print)
  print = true;

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
      if(print)
				console.log("\nResult:\n" + result.text.slice(0, result.text.length - 1))

			console.log("Finished copying to clipboard!")
			process.exit()
		})
	})
}
