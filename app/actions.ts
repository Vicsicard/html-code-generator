"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  // Check if environment variables are set
  if (!hasEnvVars) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Environment variables for Supabase are not configured. Please set them up first."
    );
  }

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    } else {
      return encodedRedirect(
        "success",
        "/sign-up",
        "Thanks for signing up! Please check your email for a verification link.",
      );
    }
  } catch (err) {
    console.error("Error during sign up:", err);
    return encodedRedirect(
      "error",
      "/sign-up",
      "An unexpected error occurred. Please try again later."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect("error", "/sign-in", "Email and password are required");
  }

  // Check if environment variables are set
  if (!hasEnvVars) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "Environment variables for Supabase are not configured. Please set them up first."
    );
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-in", error.message);
    }

    return redirect("/protected");
  } catch (err) {
    console.error("Error during sign in:", err);
    return encodedRedirect(
      "error",
      "/sign-in",
      "An unexpected error occurred. Please try again later."
    );
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  // Check if environment variables are set
  if (!hasEnvVars) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Environment variables for Supabase are not configured. Please set them up first."
    );
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) {
      console.error(error.message);
      return encodedRedirect(
        "error",
        "/forgot-password",
        "Could not reset password"
      );
    }

    if (callbackUrl) {
      return redirect(callbackUrl);
    }

    return encodedRedirect(
      "success",
      "/forgot-password",
      "Check your email for a link to reset your password."
    );
  } catch (err) {
    console.error("Error during forgot password:", err);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "An unexpected error occurred. Please try again later."
    );
  }
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  // Check if environment variables are set
  if (!hasEnvVars) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Environment variables for Supabase are not configured. Please set them up first."
    );
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error(error.message);
      return encodedRedirect(
        "error",
        "/protected/reset-password",
        "Password update failed"
      );
    }

    return encodedRedirect(
      "success",
      "/protected/reset-password",
      "Password updated"
    );
  } catch (err) {
    console.error("Error during reset password:", err);
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "An unexpected error occurred. Please try again later."
    );
  }
};

export const signOutAction = async () => {
  const supabase = await createClient();

  // Check if environment variables are set
  if (!hasEnvVars) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "Environment variables for Supabase are not configured. Please set them up first."
    );
  }

  try {
    await supabase.auth.signOut();
    return redirect("/sign-in");
  } catch (err) {
    console.error("Error during sign out:", err);
    return encodedRedirect(
      "error",
      "/sign-in",
      "An unexpected error occurred. Please try again later."
    );
  }
};
