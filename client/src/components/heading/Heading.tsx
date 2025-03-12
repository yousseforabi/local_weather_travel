import React from "react";
import "../../style/heading/heading.css"

export interface HeadingProps {
  label: string;
}

const Heading: React.FC<HeadingProps> = ({ label }) => {
  return (
        <h1 className="heading">
          {label}
        </h1>
  )
};

export default Heading;
