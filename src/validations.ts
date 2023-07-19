export const validateEmail = (email: string) => {
  let re = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  if (!re.test(email)) {
    return "Email must be valid.";
  } else {
    return null;
  }
};

export const validatePassword = (password: string) => {
  if (password.length < 6) {
    return "Password must be 6 or more characters";
  } else {
    return "";
  }
};

export const validateName = (name: string) => {
  return name.length > 1 ? null : "Name is required.";
};
