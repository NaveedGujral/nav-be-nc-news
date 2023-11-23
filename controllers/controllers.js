const { selectAllTopics, getJSONmodel, selectAllArticles, selectArticleById, selectAllCommentsByArtId, insertComment, selectUserByUsername  } = require('../models/models')


exports.getAllTopics = (req, res, next) => {
    selectAllTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err)
      })
    }
    
exports.getArticleById = (req, res, next) => {
    const artId = req.params.article_id
    selectArticleById(artId)
    .then((article) => {
        res.status(200).send({ article: article })
    })
    .catch((err) => {
        next(err)
        })       
}

exports.getUserbyUsername = (req, res, next) => {
    const username = req.body.username
    selectUserByUsername(username)
    .then((user) => {
        res.status(200).send({ user: user })
    })
    .catch((err) => {
        next(err)
        })       
}

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    }) 
}

exports.getAllCommentsByArtId = (req, res, next) => {
    const artId = req.params.article_id
    selectAllCommentsByArtId(artId)
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
      })
}

exports.postComment = (req, res, next) => {
    const artId = req.params.article_id
    const username = req.body.username

    Promise.all([selectArticleById(artId), selectUserByUsername(username), insertComment(req.body, artId) ])
    .then((responses) => {
        const comment = responses[2]
        // console.log(comment)
        res.status(201).send({ comment: comment })
    })
    .catch((err) => {
        next(err)
      })
}

exports.getJSONctrl = (req, res) => {
    const JSONobj = getJSONmodel()
    res.status(200).send( JSONobj )
}
