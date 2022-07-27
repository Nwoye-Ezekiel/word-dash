import React from "react";
import styles from "./index.module.css";

interface ButtonProps {
  variant?: "solid" | "outline";
  children: JSX.Element | string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  variant = "solid",
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
