import fetch from "isomorphic-unfetch";

const Armor = props => {
  // console.log(props);

  return <article>{props.data[0].name}</article>;
};

Armor.getInitialProps = async function(context) {
  const { id } = context.query;
  const request = await fetch(`https://mhw-db.com/armor?q={"id":${id}}`);
  const data = await request.json();

  // console.log(data);

  return {
    data
  };
};

export default Armor;
