export const successResponse = ({
  res,
  message,
  status = 200,
  data = undefined,
} = {}) => {
  return res.status(status).json({ status, message,  data:data.result });
};
