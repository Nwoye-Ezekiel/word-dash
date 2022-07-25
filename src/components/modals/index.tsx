import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./index.module.css";

interface ModalTemplateProps {
  header: string;
  close: () => void;
  children: JSX.Element
}

export default function ModalTemplate({ header, close, children }: ModalTemplateProps) {
  return (
    <div className={styles["modal-wrapper"]}>
      <div className={styles["modal-container"]}>
        <div className={styles["header-container"]}>
          <h2>{header}</h2>
          <motion.span
            whileHover={{ scale: 1.1, rotate: 90 }}
            className={styles["icon-wrapper"]}
            onClick={close}
          >
            <Image
              src={require("../../assets/icons/close.svg")}
              alt="close icon"
              width={32}
              height={32}
            />
          </motion.span>
        </div>
        {children}
      </div>
    </div>
  );
}
