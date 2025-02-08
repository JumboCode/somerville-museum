'use client'

import "./AddItemButton.css";
import StylishButton from './StylishButton.jsx';

export default function MyForm({className, children}) {

  return (
    <div>
      <StylishButton
        label="+ Item"
        styleType="style3"
        // onClick={handleButtonClick}
      />
    </div>
  );
}
