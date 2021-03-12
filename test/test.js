const path = require('path')
const assert = require('assert');
const fs = require('fs')

const { grep, throughFiles, hasTodos } = require('../grep')

let cwd = process.cwd()
let searchStr = 'TODO'

describe('grep', function() {
  it('should return a object', function() {
    assert.equal(typeof grep(cwd, [], searchStr), "object")
  })
})

describe('grep', function() {
  it('should return four results in the test folder', function() {
    assert.equal(grep(path.join(cwd, 'test'), [], searchStr).length, 4)
  })
})

describe('hasTodos', function() {
  it('should reject temp files ending with #', function() {
    assert.equal(hasTodos('#tempfile.txt#'), false)
  })
})

describe('hasTodos', function() {
  it('should reject temp files ending with ~', function() {
    assert.equal(hasTodos('tempfile.txt~'), false)
  })
})

describe('hasTodos', function() {
  it('should return true for files with TODO', function() {
    assert.equal(hasTodos(path.join(cwd, 'test/base.txt'), 'TODO'), true)
  })
})

describe('hasTodos', function() {
  it('should return false for files with no TODO', function() {
    assert.equal(hasTodos(path.join(cwd, 'test/firstdir/firstdir.txt'), 'TODO'), false)
  })
})
