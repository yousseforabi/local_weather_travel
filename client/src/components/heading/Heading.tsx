import React from "react";
import { headingComponent } from "../../types/types";
import "../../style/heading/heading.css"

interface HeadingProps {
  label: headingComponent;
}

const Heading: React.FC<HeadingProps> = ({ label }) => {
  return (
        <h1 className="heading">
          {label}
        </h1>
  )
};

export default Heading;
