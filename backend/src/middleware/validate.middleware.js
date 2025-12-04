import ApiError from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
  const options = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(
    { body: req.body, params: req.params, query: req.query },
    options
  );

  if (error) {
    return next(new ApiError(400, "Validation error", error.details));
  }

  if (value.body) Object.assign(req.body, value.body);
  if (value.params) Object.assign(req.params, value.params);
  if (value.query) Object.assign(req.query, value.query);

  next();
};

export default validate;
