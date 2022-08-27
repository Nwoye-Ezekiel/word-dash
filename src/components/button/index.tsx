import React from "react";
import styles from "./index.module.css";

interface ButtonProps {
  variant?: "primary1" | "primary2" | "secondary1" | "secondary2" | "outline";
  children: JSX.Element | string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  variant = "primary1",
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
