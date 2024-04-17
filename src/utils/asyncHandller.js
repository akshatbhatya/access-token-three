const asyncHandler = (HandlerFunction) => {
  return (req, res, next) => {
    Promise.resolve(HandlerFunction(req, res)).catch((err) => next(err));
  };
};
export default asyncHandler;
