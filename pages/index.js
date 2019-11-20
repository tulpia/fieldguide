import React from "react";
import Link from "next/link";

class Index extends React.Component {
  render() {
    return (
      <Link href="/items">
        <a>Items</a>
      </Link>
    );
  }
}

export default Index;
