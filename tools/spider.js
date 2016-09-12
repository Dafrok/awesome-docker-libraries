const fs = require('fs')
const url = require('url')
const Crawler = require("crawler")

const BASE_URL = 'https://hub.docker.com'
const EXPLORE_URL = 'https://hub.docker.com/explore/?page='

const res = []

const c = new Crawler()

function crawlPage(page = 1) {
  c.queue([{
    uri: EXPLORE_URL + page,
    callback: function (error, result, $) {
      const $repoList = $('.explore-repo-list>ul>li>a')
      if ($repoList.length) {
        $repoList.each(function () {
          const $this = $(this)
          const href = $this.attr('href')
          const name = $this.children().eq(0).children().eq(1).children().eq(0).children().eq(0).text()
          res.push({name: name, link: href})
        })
        crawlPage(page + 1)
      } else {
        for (let index = 0; index < res.length; index++) {
          !(function (index) {
            const repo = res[index]
            c.queue([{
              uri: BASE_URL + repo.link,
              callback: function (error, result, $) {
                const description = $('.repository-page').children().eq(1).children().eq(1).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(1).text()
                repo.description = description
                if (index === res.length - 1) {
                  fs.writeFile('./data/repo.json', JSON.stringify(res), function () {
                    process.exit()
                  })
                }
              }
            }])
          })(index)
        }
      }
    }
  }])
}

crawlPage()
