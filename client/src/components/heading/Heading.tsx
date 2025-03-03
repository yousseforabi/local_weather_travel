import React from "react";
import { headingComponent } from "../../types/types";

interface HeadingProps {
  label: headingComponent;
}

const Heading: React.FC<HeadingProps> = ({ label }) => {
  return <h1>{label}</h1>;
};

export default Heading;
