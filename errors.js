exports.customErrors = (err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    }
    else next(err) 
  };

exports.psqlErrors = (err, req, res, next) => {
    console.log("PSQL error code block -> ",err)
    console.log("PSQL error code: ",err.code)

    if (err.code === '23502') {
      res.status(400).send({ msg: 'Bad request' });
    } 

    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Bad request' });
    } 
    else next(err)
  };


exports.serverErrors = (err, req, res, next) => {
    console.log("server error: ", err)
    if (err.status) {
      res.status(500).send({ msg: "internal server error" });
    } 
  };
