import React, { useState, useEffect } from "react";
import "./NewCollections.css";
import New_Collections from "../Assets/new_collections";
import Item from "../item/Item";

const NewCollections = () => {
  const [new_Collection, setNew_Collection] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/newcollection")
      .then((response) => response.json())
      .then((data) => setNew_Collection(data));
  }, []);

  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collectionS">
        {new_Collection.map((item, index) => {
          return (
            <Item
              key={index}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NewCollections;
