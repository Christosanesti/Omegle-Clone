import React, { ReactNode } from "react";
import Logo from "@/components/logo";
function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-screen w-full flex-col items-center justify-center bg-background">
      <Logo />
      <div className="mt-12">{children}</div>
    </div>
  );
}

export default layout;
