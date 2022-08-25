import React from "react";
import styles from "./index.module.css";

interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "outline";
  children: JSX.Element | string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  variant = "primary",
  disabled,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles["button"]} ${styles[`${variant}`]}`}
    >
      {children}
    </button>
  );
}
