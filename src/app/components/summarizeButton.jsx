"use client";
// import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function Summarize() {
  return (
    <button className="text-[0.8rem] text-center border-2 border-[var(--color-main)] bg-[var(--color-main)] p-1 rounded-lg hover:bg-[var(--color-lighter-main)]">
      Summarize Text
    </button>
  );
}
