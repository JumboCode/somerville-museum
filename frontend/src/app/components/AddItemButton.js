'use client'

import "./AddItemButton.css";
import StylishButton from './StylishButton.jsx';
import Link from "next/link";

export default function MyForm() {

  return (
    <div>
      <Link href="/add">
        <StylishButton
          label="+ Item"
          styleType="style3"
        />
      </Link>
    </div>
  );
}
