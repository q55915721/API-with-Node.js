//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));



const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('articles', articleSchema);
//MARK: ------For all data requests -----------

app.route('/articles').get(function(req, res) {
    Article.find(function(err, foundArticle) {
      res.send(foundArticle);
    });
  })
  .post(function(req, res) {

    const title = req.body.title;
    const content = req.body.content;

    const newAritle = new Article({
      title: title,
      content: content
    });

    newAritle.save(function(err) {
      if (!err) {
        console.log('ok!');
      } else {
        console.log(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('deleted...');
      }
    });
  });

//MARK: ------For specific data requests-----------

app.route('/articles/:articleTitle')
  .get(function(req, res) {
    const title = req.params.articleTitle;
    Article.findOne({
      title: title
    }, function(err, foundArticle) {
      if (!err) {
        if (foundArticle) {
          res.send(foundArticle);
        }
      }
    });
  })
  .put(function(req, res) {

    Article.updateOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      },
      function(err, result) {
        if (!err) {

          console.log('updated..');
        } else {
          console.log(err);
        }
      }
    );
  })

  .patch(function(req, res) {

    Article.updateOne({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {

        if (!err) {
          console.log('updated...');
        } else {
          console.log(err);
        }
      }
    );
  })
  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        console.log('deleted...');
      } else {
        console.log(err);
      }
    });
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});