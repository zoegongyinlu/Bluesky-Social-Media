import Joi from "joi";

// Reusable patterns for validation
const usernamePattern = Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .trim()
  .required()
  .messages({
    "string.base": "Username must be a string",
    "string.alphanum": "Username must only contain letters and numbers",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be less than 30 characters",
    "any.required": "Username is required",
  });

const passwordPattern = Joi.string()
  .min(6) // Minimum 6 characters
  .max(128) // Maximum 128 characters
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{6,}$"))
  .required()
  .messages({
    "string.base": "Password must be a string",
    "string.pattern.base":
      "Password must be at least 6 characters long, include one uppercase letter, one number, and one special character",
    "any.required": "Password is required",
  });

// Signup schema
export const signupSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .required()
    .messages({
      "string.base": "Full name must be a string",
      "string.min": "Full name must be at least 3 characters",
      "string.max": "Full name must be less than 50 characters",
      "any.required": "Full name is required",
    }),
  username: usernamePattern,
  email: Joi.string()
    .email()
    .trim()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
  password: passwordPattern,
});

// Login schema
export const loginSchema = Joi.object({
  username: usernamePattern,
  password: passwordPattern,
});

export const updateUserSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).trim().optional(),
    email: Joi.string().email().trim().optional(),
    username: Joi.string().alphanum().min(3).max(30).trim().optional(),
    currentPassword: Joi.string().optional(),
    newPassword: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{6,}$"))
      .optional()
      .messages({
        "string.pattern.base":
          "New password must be at least 6 characters long, include one uppercase letter, one number, and one special character",
      }),
    bio: Joi.string().max(250).trim().optional(),
    link: Joi.string().uri().optional(),
    profileImg: Joi.string().uri().optional(),
    coverImg: Joi.string().uri().optional(),
  }).with("currentPassword", "newPassword"); // Require newPassword if currentPassword is provided

// Post Validation
export const postValidationSchema = Joi.object({
  text: Joi.string()
    .max(280)
    .trim()
    .allow("")
    .messages({
      "string.max": "Text must be at most 280 characters",
    }),
  img: Joi.string()
    .uri()
    .allow("")
    .messages({
      "string.uri": "Image must be a valid URI",
    }),
}).custom((obj, helpers) => {
  if (!obj.text && !obj.img) {
    return helpers.error("any.custom", {
      message: "A post must have either text or an image",
    });
  }
  if (obj.img === "") {
    return helpers.error("any.custom", {
      message: '"img" is not allowed to be empty',
    });
  }
  return obj;
});

  