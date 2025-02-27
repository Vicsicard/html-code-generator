"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps, useState } from "react";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const [isPending, setIsPending] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    if (props.onClick) {
      setIsPending(true);
      props.onClick(e);
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
