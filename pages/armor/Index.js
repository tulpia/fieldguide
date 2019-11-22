import React, { Component, useState, useEffect } from "react";
// import Header from "../components/Header/Header";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { capitalize } from '../../utils/utils'

const Armors = ({ skills, armors, ranks }) => {
  const [s_skill, setSkill] = useState('')
  const [s_ranks, setRanks] = useState(
    Object.assign({}, ranks, {high: true})
  )
  const filteredArmors = filterArmors(armors, {
    skill: s_skill,
    ranks: s_ranks
  })

  const clickOnRank = event => {
    setRanks(
      Object.assign({}, s_ranks, {[event.target.name]: event.target.checked})
    )
  }

  const handleSkillChange = target => {
    setSkill(target.value)
  }

  return(
    <div>
      <h1>MHW Armors</h1>
      <div>{filteredArmors.length} résultats</div>
      <section className="armors__filters">
        <select
          className="filter__skill"
          onChange={event => handleSkillChange(event.target)}
          value={s_skill}
        >
          <option defaultValue value=''>----------------</option>
          {skills.map(skill => {
            return (
              <option key={`skill_${skill.id}`} value={skill.id}>
                {skill.name}
              </option>
            )
          })}
        </select>
        <div>
          {Object.keys(s_ranks).map(rank => {
            return(
              <label key={`rank_${rank}`} htmlFor={rank}>
                <input
                  type="checkbox"
                  id={rank}
                  name={rank}
                  defaultChecked={s_ranks[rank]}
                  onChange={clickOnRank}
                />
                <span>{capitalize(rank)} Rank</span>
              </label>
            )
          })}
        </div>
      </section>
      <ul className="armors__list">
        {filteredArmors.map(armor => {
          return(
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
          )
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

function filterArmors(armors, filters) {
  let filteredArmors = armors
  filteredArmors = filteredArmors.filter(armor => {
    let hasArmorConcernedSkill = true
    if (filters.skill !== '') {
      if (armor.skills.length > 0) {
        armor.skills.forEach(skill => {
          if (parseInt(skill.skill) !== parseInt(filters.skill)) {
            hasArmorConcernedSkill = false
          }
        })
      }
    }

    let isArmorInCheckedRanks = false
    Object.keys(filters.ranks).forEach(rank => {
      if (rank === armor.rank && filters.ranks[rank]) {
        isArmorInCheckedRanks = true
      }
    })
    
    if (hasArmorConcernedSkill && isArmorInCheckedRanks) {
      return true
    }
  })
  return filteredArmors
}

Armors.getInitialProps = async function() {
// // // // // // // // // // // // // // // // // // // // //
  const resArmors = await fetch('https://mhw-db.com/armor');
  const armors = await resArmors.json()
  const resSkills = await fetch('https://mhw-db.com/skills');
  const skills = await resSkills.json()
// // // // // // // // // // // // // // // // // // // // //
  let ranks = {}
  await armors.forEach(armor => {
    if (!(armor.rank in ranks)) {
      ranks = Object.assign({}, ranks, {[armor.rank]: false})
    }
  })
// // // // // // // // // // // // // // // // // // // // //
  return {
    armors: armors,
    skills: skills,
    ranks: ranks
  };
};

export default Armors;
