import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import {
  Container,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@material-ui/core";
import fetch from "isomorphic-unfetch";
import GunCard from "../../components/GunCard/GunCard";
import SelectGunTypes from "../../components/SelectGunTypes/SelectGunTypes";

const setLocalStorage = id => {
  localStorage.setItem("gunType", id);
};

const Weapons = ({ data, gunTypes }) => {
  const [s_selectedGunType, setSelectedGuntype] = useState(false);

  const handleChangeSelect = event => {
    setSelectedGuntype(event.target.value);
    setLocalStorage(event.target.value);
  };

  // ComponentDidMount dans un component stateless
  useEffect(() => {
    if (localStorage.getItem("gunType") && !s_selectedGunType) {
      setSelectedGuntype(localStorage.getItem("gunType"));
    }
  }, []);

  return (
    <main>
      <Header name="Liste des armes"></Header>
      <Container maxWidth="lg" style={{ marginTop: "20px" }}>
        {s_selectedGunType ? (
          <>
            <SelectGunTypes
              selectValue={s_selectedGunType}
              selectOnChange={handleChangeSelect}
              gunTypes={gunTypes}
            />
            <Grid
              container
              justify="space-between"
              spacing={3}
              style={{ marginTop: "50px" }}
            >
              <Grid item xs={12}></Grid>
              {data
                .filter(entry => entry.type === s_selectedGunType)
                .map(gun => {
                  return <GunCard data={gun} key={gun.id} />;
                })}
            </Grid>
          </>
        ) : (
          <SelectGunTypes
            selectValue=""
            selectOnChange={handleChangeSelect}
            gunTypes={gunTypes}
          />
        )}
      </Container>
    </main>
  );
};

Weapons.getInitialProps = async function() {
  const request = await fetch("https://mhw-db.com/weapons");
  const data = await request.json();

  const gunTypes = [];
  for (const gun of data) {
    if (!gunTypes.includes(gun.type)) {
      gunTypes.push(gun.type);
    }
  }

  return { data, gunTypes };
};

export default Weapons;
