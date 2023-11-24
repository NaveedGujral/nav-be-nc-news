const { selectAllTopics, getJSONmodel, selectAllArticles, selectArticleById, selectAllCommentsByArtId, insertComment, selectUserByUsername, updateArticleVotes, removeComment, selectCommentById, selectAllUsers   } = require('../models/models')

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
    Promise.all([selectArticleById(artId)])
    .then((responses) => {
        const article = responses[0]
        res.status(200).send({ article: article })
    })
    .catch((err) => {
        next(err)
        })       
}

exports.getCommentById = (req, res, next) => {
    const comment_id = req.params.comment_id
    selectCommentById(comment_id)
    .then((comment) => {
        res.status(200).send({ comment: comment })
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
    const { topic } = req.query
    selectAllArticles(topic)
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    }) 
}

exports.getAllUsers = (req, res, next) => {
    selectAllUsers()
    .then((users) => {
        res.status(200).send({ users })
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
    
exports.postComment = (req, res, next) => {
    const artId = req.params.article_id
    const username = req.body.username

    Promise.all([selectArticleById(artId), selectUserByUsername(username), insertComment(req.body, artId) ])
    .then((responses) => {
        const comment = responses[2]
        res.status(201).send({ comment: comment })
    })
    .catch((err) => {
        next(err)
      })
}

exports.deleteComment = (req, res, next) => {
    const comment_id = req.params.comment_id
    Promise.all([selectCommentById(comment_id), removeComment(comment_id)])
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

exports.getJSONctrl = (req, res) => {
    const JSONobj = getJSONmodel()
    res.status(200).send( JSONobj )
}