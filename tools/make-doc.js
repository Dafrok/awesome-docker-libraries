const fs = require('fs')
const repoList = require('../data/repo.json')
const BASE_URL = 'https://hub.docker.com'

let ret = '# Awesome Docker Libraries CN\n\n'

for (const repo of repoList) {
  ret += `## [${repo.name}](${BASE_URL + repo.link})\n\n${repo.description}\n\n`
}

fs.writeFile('./README.md', ret, function () {

})
