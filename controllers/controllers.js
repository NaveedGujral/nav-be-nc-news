const { selectAllTopics, getJSONmodel, selectAllArticles, selectArticleById, selectAllCommentsByArtId, updateArticleVotes  } = require('../models/models')


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

exports.getPatchedArticleById = (req, res, next) => {
    const artId = +req.params.article_id
    const newVote = req.body.inc_votes

    Promise.all([ updateArticleVotes(newVote, artId),selectArticleById(artId)])
    .then((responses) => {
        const article = responses[0]
        res.status(200).send({article: article})
    })
    .catch((err) => {
        next(err)
        })       
}

exports.getJSONctrl = (req, res) => {
    const JSONobj = getJSONmodel()
    res.status(200).send( JSONobj )
}