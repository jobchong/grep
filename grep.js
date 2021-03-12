
// grep -ri TODO .

const fs = require('fs')
const path = require('path')

let cwd = process.cwd();
let searchStr = 'TODO'

if (process.argv[2]) {
  searchStr = process.argv[2]
}

if (process.argv[3]) {
  cwd = path.join(cwd, process.argv[3])
}

/**
 * Filters for files which contain searchStr, case-insensitive
 * @throughFiles
 * @param {fs.Dirent} files - an array of files in the folder
 * @param {object} list - an array of filenames containing searchStr
 * @param {string} cwd - the current working directory
 * @param {string} searchStr - the string to be matched against
 */
const throughFiles = (files, list, cwd, searchStr) => {
  list.push(...(files.filter(fi => hasTodos(path.join(cwd, fi.name), searchStr))
		     .map(f => path.join(cwd, f.name))))
}

/**
 * Searches the filename for searchStr
 * @hasTodos
 * @param {string} filename - the name of the file
 * @param {string} searchStr - the string to be matched against
 * @returns {boolean} whether the file has been matched against searchStr or not
 */
const hasTodos = (filename, searchStr) => {
  if (filename.match(/(~|#)$/g)) {
    return false
  }
  let regexp = new RegExp(searchStr, 'gi')
  let file = fs.readFileSync(filename, 'utf-8')
  if (file.match(regexp)) {
    return true
  } else {
    return false
  }
}

/**
 * Overall grep function called by invoking this module
 * @grep
 * @param {string} cwd - current working directory
 * @param {object} list - array of filenames matched against searchStr
 * @param {string} searchStr - string to be matched against
 * @returns {object} an array of filenames matched against searchStr
 */
const grep = (cwd, list, searchStr) => {

  try {

    const current = fs.readdirSync(cwd, { withFileTypes: true });

    let directories = current.filter(f => f.isDirectory());
    let files = current.filter(f => f.isFile());

    if (files.length > 0) {
      throughFiles(files, list, cwd, searchStr)
    }

    if (directories.length > 0) {
      for (let dir of directories) {
	grep(path.join(cwd, dir.name), list, searchStr)
      }
    }

    return list

  } catch (err) {
    console.error(err);
  }

}

exports.grep = grep
exports.throughFiles = throughFiles
exports.hasTodos = hasTodos


if (require.main === module) {
  let toreturn = grep(cwd, [], searchStr)
  if (toreturn.length > 0) {
    console.log(toreturn.join('\n'))
  } else {
    console.error('No results found!')
  }
}
