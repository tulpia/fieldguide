import fetch from "isomorphic-unfetch";

const Item = props => {
  return <article>{props.data[0].name}</article>;
};

Item.getInitialProps = async function(context) {
  const { id } = context.query;
  const request = await fetch(`https://mhw-db.com/items?q={"id":${id}}`);
  const data = await request.json();

  console.log(data);

  return {
    data
  };
};

export default Item;
