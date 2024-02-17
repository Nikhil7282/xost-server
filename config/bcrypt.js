import bcrypt from "bcryptjs";

const salt = await bcrypt.genSalt(10);

const hash = async (password) => {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const compare = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export { hash, compare };
