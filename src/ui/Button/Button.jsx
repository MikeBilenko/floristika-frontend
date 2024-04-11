import React from "react";
import "./Button.scss";

const Button = ({
  children,
  fullWidth = false,
  outlined = false,
  small = false,
  remove = false,
  uppercase = false,
  ...rest
}) => {
  let width = fullWidth && "full-width";
  let outline = outlined && "outlined";
  let smalling = small && "small";
  let removing = remove && "remove";
  let uppercasing = uppercase && "uppercase";
  return (
    <button
      className={
        "button " +
        removing +
        " " +
        uppercasing +
        " " +
        smalling +
        " " +
        width +
        " " +
        outline
      }
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
