import React from "react";
import { PiggyBank } from "lucide-react";
function logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <PiggyBank className="h-10 w-10 stroke-2 stroke-green-500" />
      <p className="text-3xl font-bold leading-tight tracking-tighter bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 ease-in-out">
        Zaryan
      </p>
    </a>
  );
}

export default logo;
