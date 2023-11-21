const { selectAllTopics, getJSONmodel, selectAllCommentsByArtId } = require('../models/models')

exports.getAllTopics = (req, res, next) => {
    selectAllTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err)
      })
}

exports.getAllCommentsByArtId = (req, res, next) => {
    selectAllCommentsByArtId(artId)
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
      })
}

exports.getJSONctrl = (req, res) => {
    const JSONobj = getJSONmodel()
    res.status(200).send( JSONobj )
}

