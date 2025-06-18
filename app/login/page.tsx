"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }
    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        throw new Error(response.error);
      } else {
        console.log("Login successful:", response);
        router.push("/");
      }
    } catch (error) {
        console.error("Login error:", error);
        alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return <div>
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
    <div>
        <p>
            Don't have an account? <a href="/register">Register here</a>
        </p>
    </div>
  </div>;
};

export default LoginPage;
