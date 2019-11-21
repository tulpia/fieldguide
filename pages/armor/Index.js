import React, { Component, useState } from "react";
// import Header from "../components/Header/Header";
import Link from "next/link";
import fetch from "isomorphic-unfetch";

const Armors = ({ skills, armors }) => {
  console.log('armors')
  console.log(armors)
  console.log('skills')
  console.log(skills)
  console.log('-----------')
  const [s_armors, setArmors] = useState(armors)
  const [s_value, setValue] = useState('')
  const [s_ranks, setRanks] = useState({})

  armors.forEach(armor => {
    if (!(armor.rank in s_ranks)) {
      setRanks(Object.assign({}, s_ranks, {[armor.rank]: false}))
    }
  })

  const filterBySkill = event => {
    let value = ''
    let newListOfArmors = armors
    if (event.target.value !== '') {
      value = event.target.value
      newListOfArmors = armors.filter(armor => {
        let hasArmorConcernedSkill = false
        if (armor.skills.length > 0) {
          armor.skills.forEach(skill => {
            if (parseInt(skill.skill) === parseInt(event.target.value)) {
              hasArmorConcernedSkill = true
            }
          })
        }
        return hasArmorConcernedSkill
      })
    }
    setArmors(newListOfArmors)
    setValue(value)
  }

  return(
    <div>
      <h1>MHW Armors</h1>
      <section className="armors__filters">
        <select className="filter__skill" onChange={filterBySkill} value={s_value}>
          <option defaultValue value=''>----------------</option>
          {skills.map(skill => {
            return (
              <option key={`skill_${skill.id}`} value={skill.id}>
                {skill.name}
              </option>
            )
          })}
        </select>
        {(s_value !== '') ? (
          <span> {armors.length} résultats</span>
        ) : null}
        <div>
          <label htmlFor="low">
            <input type="checkbox" id="low" name="low"/>
            <span>Low Rank</span>
          </label>
          <label htmlFor="high">
            <input type="checkbox" id="high" name="high" defaultChecked/>
            <span>High Rank</span>
          </label>
          <label htmlFor="master">
            <input type="checkbox" id="master" name="master"/>
            <span>Master Rank</span>
          </label>
        </div>
      </section>
      <ul className="armors__list">
        {armors.map(armor => {
          return (
            <li key={`armor_${armor.id}`} className={`list__armor armor--${armor.rank}`}>
              <Link href="/armor/[id]" as={`/armor/${armor.id}`}>
                <a>
                  {/* {armor.assets ? (
                    <div className="armor__img-container">
                      <img src={armor.assets.imageMale} />
                    </div>
                  ) : null } */}
                  <div className="armor__infos">
                    <span className="armor__id">
                      [{armor.id}]
                    </span>
                    <span className="armor__name">
                    {armor.name}
                    </span>
                  </div>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
      <style jsx>{`
        .armors__filters {
          display: flex;
        }
        ul {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          list-style-type: none;
          gap: 10px;
          padding: 0;
        }
        li {
          display: block;
          grid-column-end: span 1;
        }
        a {
          height: 150px;
          padding: 20px;
          text-decoration: none;
          color: black;
          font-family: arial;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }
        .armor__img-container {
          height: 100px;
          width: 100%;
        }
        .armor__img-container img {
          object-fit: contain;
          width: 100%; height: 100%;
        }
        .armor__id,
        .armor__name {
          display: block;
          text-align: center;
        }
        .armor__id {
          margin-bottom: 10px;
        }
        .armor--low {
          background-color: #ffdbc5;
        }
        .armor--high {
          background-color: #ff9d76;
        }
        .armor--master {
          background-color: #ef4339;
        }
      `}</style>
    </div>
  )
}

Armors.getInitialProps = async function() {
  const resArmors = await fetch("https://mhw-db.com/armor");
  const armors = await resArmors.json();
  const resSkills = await fetch('https://mhw-db.com/skills');
  const skills = await resSkills.json();

  return {
    armors: armors,
    skills: skills
  };
};

export default Armors;
