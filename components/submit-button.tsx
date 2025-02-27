"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps, useState } from "react";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  onClick,
  ...props
}: Props) {
  // Replace useFormStatus with local state
  const [isPending, setIsPending] = useState(false);
  
  // Create a wrapper around the button's onClick to handle pending state
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      setIsPending(true);
      onClick(e);
    }
  };

  return (
    <Button 
      type="submit" 
      aria-disabled={isPending} 
      onClick={handleClick}
      {...props}
    >
      {isPending ? pendingText : children}
    </Button>
  );
}
