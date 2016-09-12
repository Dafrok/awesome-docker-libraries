const fs = require('fs')
const url = require('url')
const Crawler = require("crawler")

const BASE_URL = 'https://hub.docker.com'
const EXPLORE_URL = 'https://hub.docker.com/explore/?page='

const ret = []
const c = new Crawler()

function createRepoList(ret = []) {
  return new Promise((resolve, reject) => {
    resolve(ret)
  })
}

function crawlRepoList(ret) {
  return new Promise((resolve, reject) => {
    function crawlList(page = 1) {
      c.queue([{
        uri: EXPLORE_URL + page,
        callback: function (error, result, $) {
          const $repoList = $('.explore-repo-list>ul>li>a')
          if ($repoList.length) {
            $repoList.each(function () {
              const $this = $(this)
              const href = $this.attr('href')
              const name = $this.children().eq(0).children().eq(1).children().eq(0).children().eq(0).text()
              ret.push({name: name, link: href})
            })
            crawlList(page + 1)
          } else {
            resolve(ret)
          }
        }
      }])
    }
    crawlList()
  })
}

function crawlRepo (ret) {
  return new Promise((resolve, reject) => {
    for (let index = 0; index < ret.length; index++) {
      !(function (index) {
        const repo = ret[index]
        c.queue([{
          uri: BASE_URL + repo.link,
          callback: function (error, result, $) {
            const description = $('.repository-page').children().eq(1).children().eq(1).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(1).text()
            repo.description = description
            if (index === ret.length - 1) {
              resolve(ret)
            }
          }
        }])
      })(index)
    }
  })
}

function writeFile(ret) {
  return new Promise((resolve, reject) => {
    fs.writeFile('./data/repo.json', JSON.stringify(ret), function () {
      resolve()
    })
  })
}

createRepoList(ret)
  .then(crawlRepoList)
  .then(crawlRepo)
  .then(writeFile)
  .then(process.exit)
