import { Check, CopyIcon } from "lucide-react";
import { useState } from "react";

const PasswordCopy = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <code className="cursor-pointer" onClick={handleCopyClick}>
      ********
      <span className="ml-1">
        {copied ? (
          <Check className="inline-block size-[1em]" />
        ) : (
          <CopyIcon className="inline-block size-[1em]" />
        )}
      </span>
    </code>
  );
};

export default PasswordCopy;
