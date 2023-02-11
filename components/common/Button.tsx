import React from "react";

const Button: React.FC<{
  text: string;
  variant?: "primary" | "secondary";
  italic?: boolean;
  size?: "small" | "medium";
}> = ({ text, variant = "primary", italic = false, size = "small" }) => {
  let colors =
    variant === "primary"
      ? " bg-black-1 text-bright-blue-2"
      : " border-2 border-black-1 text-black-1";

  let buttonSize = size === "small" ? " w-[175px] " : " w-[364px] ";
  return (
    <button
      className={`
        ${colors} justify-self-center rounded-3xl py-2 text-center text-sm 
        ${italic && " italic "}
        ${buttonSize}
      `}
    >
      {text}
    </button>
  );
};
export default Button;
