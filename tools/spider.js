var fs = require('fs')
var url = require('url')
var Crawler = require("crawler")

var BASE_URL = 'https://hub.docker.com'
var EXPLORE_URL = 'https://hub.docker.com/explore/?page='

var res = []

var c = new Crawler()

function crawlPage(page = 1) {
  c.queue([{
    uri: EXPLORE_URL + page,
    callback: function (error, result, $) {
      var $repoList = $('.explore-repo-list>ul>li>a')
      if ($repoList.length) {
        $repoList.each(function () {
          var $this = $(this)
          var href = $this.attr('href')
          var name = $this.children().eq(0).children().eq(1).children().eq(0).children().eq(0).text()
          res.push({name: name, link: href})
        })
        crawlPage(page + 1)
      } else {
        for (var index = 0; index < res.length; index++) {
          !(function (index) {
            var repo = res[index]
            c.queue([{
              uri: BASE_URL + repo.link,
              callback: function (error, result, $) {
                var description = $('.repository-page').children().eq(1).children().eq(1).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(1).text()
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
