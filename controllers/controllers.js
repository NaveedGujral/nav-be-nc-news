const { selectAllTopics, getJSONmodel, selectAllArticles } = require('../models/models')

exports.getAllTopics = (req, res, next) => {
    selectAllTopics()
    .then((topics) => {
        res.status(200).send({ topics })
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

exports.getJSONctrl = (req, res) => {
    const JSONobj = getJSONmodel()
    res.status(200).send( JSONobj )
}

