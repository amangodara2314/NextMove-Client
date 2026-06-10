import React from "react";
import { cn } from "../lib/utils";

export default function ProjectName({ className }) {
  return <h1 className={cn("text-xl text-primary", className)}>NextMove</h1>;
}
