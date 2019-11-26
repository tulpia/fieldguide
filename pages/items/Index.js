import React from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";

const Items = ({ data }) => {
  console.log(data[0]);
  return (
    <div>
      <h1>MHW Items</h1>
      <ul>
        {data.map(item => {
          return (
            <li key={item.id}>
              <Link href="/items/[id]" as={`/items/${item.id}`}>
                <a>
                  id : {item.id} - {item.name}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

Items.getInitialProps = async function() {
  const res = await fetch("https://mhw-db.com/items");
  const data = await res.json();

  return {
    data
  };
};

export default Items;
