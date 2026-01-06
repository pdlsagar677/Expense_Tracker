import { getResendClient } from "./config.js";
import {
  verificationTokenEmailTemplate,
  WELCOME_EMAIL_TEMPLATE,
} from "./email-templates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const resend = getResendClient(); // ✅ moved here

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Email Address Now",
      html: verificationTokenEmailTemplate.replace(
        "{verificationToken}",
        verificationToken
      ),
    });
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error("Error sending verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const resend = getResendClient(); // ✅

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to our company",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });
  } catch (error) {
    console.error("Error sending welcome email", error);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const resend = getResendClient(); // ✅

    await resend.emails.send({
      from: "Hacked <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password",
      html: `Click <a href="${resetURL}">here</a> to reset your password`,
    });
  } catch (error) {
    console.error("Error sending password reset email", error);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const resend = getResendClient(); // ✅

    await resend.emails.send({
      from: "Hacked <onboarding@resend.dev>",
      to: [email],
      subject: "Password Reset Was Successful",
      html: "Your password was reset successfully",
    });
  } catch (error) {
    console.error("Error sending password reset success email", error);
  }
};
