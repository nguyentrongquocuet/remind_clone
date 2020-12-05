//use for react-form-hook
export default {
  EMAIL: {
    REQUIRED: {
      required: "Email is required!",
    },
    PARTTERN: {
      pattern: {
        value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})*$/,
        message: "Invalid email address format",
      },
    },
  },
  PASSWORD: {
    minLength: { value: 6, message: "At least 6 digits" },
    required: "Password is required!",
  },
  NAME: {
    REQUIRED: {
      FIRST: {
        required: "Firstname is required!",
      },
      LAST: {
        required: "Lastname is required!",
      },
    },
    MINLENGTH: {
      minLength: { value: 3, message: "At least 3 characters" },
    },
  },
};
