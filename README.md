# imgclip

Command line utility that extracts text from an image into the system clipboard. Uses the [tesseract](https://github.com/naptha/tesseract.js) OCR

[![asciicast](https://asciinema.org/a/1n7wfprarthnh9htkavu3trkl.png)](https://asciinema.org/a/1n7wfprarthnh9htkavu3trkl)

### Installation

    npm install -g imgclip

NOTE: Compatible only with node v6.8.0+

### Usage

    Usage: imgclip PATH [options...]
    
    Options:
    
        --lang LANGUAGE    language of the text in the image. 
    
Full language list can be found [here](https://github.com/naptha/tesseract.js/blob/master/docs/tesseract_lang_list.md)
