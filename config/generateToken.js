import jwt from "jsonwebtoken";

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

const decodeToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { generateToken, decodeToken };
