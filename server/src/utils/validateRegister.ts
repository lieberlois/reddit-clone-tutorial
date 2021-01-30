export const validateRegister = (
  username: string,
  password: string,
  email: string
) => {
  if (username.length <= 2) {
    return [
      {
        field: "username",
        message: "Username must be at least 3 characters long",
      },
    ];
  }
  if (username.includes("@")) {
    return [
      {
        field: "username",
        message: "Username must not contain an @ sign",
      },
    ];
  }
  if (password.length <= 2) {
    return [
      {
        field: "password",
        message: "Password must be at least 3 characters long",
      },
    ];
  }
  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid E-Mail",
      },
    ];
  }
  return null;
};
