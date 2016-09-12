const fs = require('fs')
const repoList = require('../data/repo.json')
const descriptionList = require('../data/description.json')
const BASE_URL = 'https://hub.docker.com'

let ret = '# Awesome Docker Libraries CN\n\n'

for (const repo of repoList) {
  for (const des of descriptionList) {
    if (repo.name === des.name) {
      ret += `## [${repo.name}](${BASE_URL + repo.link})\n\n${des['zh-cn']}\n\n`
    }
  }
}

fs.writeFile('./README.md', ret, function () {
  console.log('Done!')
})
