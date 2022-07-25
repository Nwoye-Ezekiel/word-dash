import React from "react";
import styles from "./index.module.css";

interface ButtonProps {
  variant?: string;
  fill?: string;
  children: JSX.Element | string;
  disabled?: boolean;
  onClick: () => void;
}

export default function Button({
  variant = "solid",
  disabled,
  onClick,
  children,
  fill
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles["button"]} ${styles[`${variant}`]} ${styles[`${fill}`]}`}
    >{children}</button>
  );
}
