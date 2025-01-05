import React, { useState } from "react";

const LoginInput = ({
  placeHolder,
  icon,
  inputState,
  inputStateFunc,
  type,
  isSignUp,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg transition-shadow duration-200 ${
        isFocus ? "shadow-lg ring-2 ring-red-500 ring-opacity-50" : "shadow-sm"
      }`}
    >
      {icon}
      <input
        type={type}
        placeholder={placeHolder}
        className="w-full h-full bg-transparent text-gray-800 text-lg font-semibold outline-none border-none placeholder-gray-400"
        value={inputState}
        onChange={(e) => inputStateFunc(e.target.value)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
    </div>
  );
};

export default LoginInput;
