module.exports = (myErrorFun) => (req, res, next) => {
  Promise.resolve(myErrorFun(req,res,next)).catch(next)
};
