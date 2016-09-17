const fs = require('fs')
const repoList = require('../data/repo.json')
const descriptionList = require('../data/description.json')
const BASE_URL = 'https://hub.docker.com'

const ret = {}

for (const repo of repoList) {
  for (const des of descriptionList) {
    if (repo.name === des.name) {
      for (key in des) {
        if (key !== 'name') {
          ret[key] = ret[key] || ''
          ret[key] += `## [${repo.name}](${BASE_URL + repo.link})\n\n${des[key]}\n\n`
        }
      }
    }
  }
}
for (const key in ret) {
  let fileStr = `# Awesome Docker Libraries - ${key}\n\n${ret[key]}`
  fs.writeFile(`./docs/${key}.md`, fileStr, function () {
  })
}
