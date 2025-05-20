export const PASSWORD_RULES = [
  {
    test: (pwd: string) => pwd.length >= 6,
    message: 'Passwords must be at least 6 characters.',
  },
  {
    test: (pwd: string) => /[^a-zA-Z0-9]/.test(pwd),
    message: 'Passwords must have at least one non alphanumeric character.',
  },
  {
    test: (pwd: string) => /\d/.test(pwd),
    message: "Passwords must have at least one digit ('0'-'9').",
  },
  {
    test: (pwd: string) => /[A-Z]/.test(pwd),
    message: "Passwords must have at least one uppercase ('A'-'Z').",
  },
];

export const EMAIL_RULE = {
  test: (email: string) => /^\S+@\S+\.\S+$/.test(email),
  message: 'Email is invalid.',
};
