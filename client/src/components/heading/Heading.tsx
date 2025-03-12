import React from "react";
import "../../style/heading/heading.css"

export interface HeadingProps {
  label: string;
}

const Heading: React.FC<HeadingProps> = ({ label }) => {
  return (
        <h1 className="text-2xl font-bold mb-4 text-center">
          {label}
        </h1>
  )
};

export default Heading;
