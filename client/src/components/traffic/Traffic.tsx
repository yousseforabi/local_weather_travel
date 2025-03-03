import React from "react";
import Heading from "../heading/Heading";
import "../../style/traffic/traffic.css"

const Traffic: React.FC = () => {
  return (
    <section className="wrapper">
        {/*Heading*/}

        <div className="title-container">
            <Heading label="TRAFFIC UPDATES" />
        </div>

        <div className="data-container">

        {/*Here i will display data about traffic*/}
            <div className="text-data-container">
                <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Eaque a, vitae dolore neque, nemo, amet doloribus fuga aspernatur odit 
                    voluptatibus velit porro assumenda hic? Maiores aspernatur 
                    omnis nostrum unde accusamus?
                </p>
            </div>

            {/*here i will display data about location*/}
            <div className="img-data-container">
                <img src="" alt="" />
            </div>
        </div>
    </section>
  );
};

export default Traffic;
