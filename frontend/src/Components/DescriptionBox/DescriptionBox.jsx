import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates
          tempora atque perferendis ex necessitatibus molestiae autem! At vel
          molestiae hic, atque soluta repellendus perspiciatis sunt deserunt
          reiciendis harum qui ex.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis
          reiciendis, velit molestiae quidem nostrum maxime harum excepturi
          corporis, maiores corrupti eaque quam perferendis, neque explicabo
          quibusdam in facere aut vero!
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
