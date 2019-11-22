import React, { Component, useState, useEffect } from "react";
// import Header from "../components/Header/Header";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { capitalize } from '../../utils/utils'

const Armors = ({ armors, sets, skills, ranks }) => {
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
        {filteredArmors.map((armor, index) => {
          return(
            <li key={`armor_${armor.id}`} className={`list__armor armor--${armor.rank}`}>
              <Link href="/armor/[id]" as={`/armor/${armor.id}`}>
                <a>
                  <div className="armor__img-container">
                  {armor.assets ? (
                    <img src={armor.assets.imageMale} />
                  ) : null }
                  </div>
                  <div className="armor__infos">
                    <span className="armor__id">
                      [{armor.id}]
                    </span>
                    <span className="armor__name">
                    {armor.name}
                    </span>
                    <div className="armor__defenses">
                      <div>base<br/>{armor.defense.base}</div>
                      <div>maxi<br/>{armor.defense.max}</div>
                      <div>augm<br/>{armor.defense.augmented}</div>
                    </div>
                    {armor.resistances ? (
                      <div className="armor__resistances">
                      {Object.keys(armor.resistances).map(res => {
                      return(
                        <div className={`armor__res armor__res--${res}`}>{armor.resistances[res] ? armor.resistances[res] : '0'}</div>
                      )
                      })}
                      </div>
                    ) : null}
                    {armor.skills.length > 0 ? (
                      <div className="armor__skills">
                      {armor.skills.map(skill => {
                      return(
                        <div className="armor__skill">
                          {skill.skillName} {skill.level}
                        </div>
                      )
                      })}
                      </div>
                    ) : (
                      <div className="armor__no-skill">No Skill</div>
                    )}
                    {armor.slots.length > 0 ? (
                      <div className="armor__slots">
                        {armor.slots.map(slot => {
                          return(
                            <div className="armor__slot">
                              ({slot.rank})
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="armor__no-slot">No slots</div>
                    )}
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
        .armors__list {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          list-style-type: none;
          gap: 10px;
          padding: 0;
        }
        .armors__list > li {
          display: block;
          grid-column-end: span 1;
        }
        .armors__list > li > a {
          min-height: 200px;
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
        .armor__infos {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 25px 75px 50px 30px 100px 50px;
          gap: 10px;
        }
        .armor__id,
        .armor__name {
          display: block;
          text-align: center;
        }
        .armor__id {
          margin-bottom: 10px;
        }
        .armor__name {
          display: flex;
          align-items: center;
        }
        .armor__defenses {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          text-align: center;
        }
        .armor__resistances {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          color: white;
          font-weight: bold;
        }
        .armor__res {
          padding: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .armor__skills {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .armor__skill {
          width: 100%;

        }
        .armor__slots {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .armor__slot {
          color: white;
          background-color: grey;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 5px;
          border-radius: 5px;
        }
        .armor__no-skill,
        .armor__no-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0.25;
          padding: 10px;
          font-weight: bold;
        }
        .armor__res--fire {
          background-color: red;
        }
        .armor__res--water {
          background-color: blue;
        }
        .armor__res--ice {
          background-color: lightblue;
        }
        .armor__res--thunder {
          background-color: yellow;
        }
        .armor__res--dragon {
          background-color: purple;
        }
        .armor--low {
          background-color: rgb(100%, 85.9%, 77.3%, 0.5);
        }
        .armor--high {
          background-color: rgb(100%, 61.6%, 46.3%, 0.5);
        }
        .armor--master {
          background-color: rgb(93.7%, 26.3%, 22.4%, 0.5);
        }
      `}</style>
    </div>
  )
}

function filterArmors(armors, filters) {
  let filteredArmors = armors
  filteredArmors = filteredArmors.filter(armor => {
    let hasArmorConcernedSkill = false
    if (filters.skill !== '') {
      if (armor.skills.length > 0) {
        armor.skills.forEach(skill => {
          if (parseInt(skill.skill) === parseInt(filters.skill)) {
            hasArmorConcernedSkill = true
          }
        })
      }
    } else {
      hasArmorConcernedSkill = true
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
  console.log(filteredArmors)
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
  let sets = {}
  await armors.forEach((armor, index) => {
    if (!(armor.rank in ranks)) {
      ranks = Object.assign({}, ranks, {[armor.rank]: false})
    }
    if (armor.armorSet) {
      if (!(armor.armorSet.name in sets)) {
        sets = Object.assign({}, sets, {[armor.armorSet.id]: armor.armorSet})
      }
    }
  })
// // // // // // // // // // // // // // // // // // // // //
  return {
    armors: armors,
    sets: sets,
    skills: skills,
    ranks: ranks,
  };
};

export default Armors;
