exports.psqlErrors = (err, req, res, next) => {
    console.log("PSQL error code: ",err.code)

    if (err.code === '23502') {
      res.status(400).send({ msg: 'Bad request' });
    } 
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Bad request' });
    } 
  };

exports.customErrors = (err, req, res, next) => {
    console.log("error status: ",err.status)
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } 
  };

exports.serverErrors = (err, req, res, next) => {
    console.log("server error: ", err)
    if (err.status) {
      res.status(500).send({ msg: "internal server error" });
    } 
  };
