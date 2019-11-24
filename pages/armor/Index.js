import React, { useState, useEffect } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { capitalize } from '../../utils/utils'
import Deco1 from '../../assets/deco1.svg'
import Deco2 from '../../assets/deco2.svg'
import Deco3 from '../../assets/deco3.svg'

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

  let loadedSet = []
  const checkIfSetLoaded = (loadedSet, armor) => {
    if (armor.armorSet) {
      if (loadedSet.includes(armor.armorSet.id)) {
        return true
      } else {
        loadedSet.push(armor.armorSet.id)
        return false
      }
    }
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
            <>
            {(!checkIfSetLoaded(loadedSet, armor) && armor.armorSet) ? (
              <div key={`set--${armor.armorSet.id}`} className="armor__set">{sets[armor.armorSet.id].name}</div>
            ) : null }
            <li key={`armor_${armor.id}`} className={`list__armor armor--${armor.type} armor--${armor.rank}`}>
              <div className="armor__img-container">
              {armor.assets ? (
                <img src={armor.assets.imageMale} />
              ) : null }
              </div>
              <div className="armor__infos">
                <div className="armor__name">
                  <span className="armor__id">
                    [{armor.id}]
                  </span>
                  {armor.name}
                </div>
                <div className="armor__defenses">
                  <div>base<br/>{armor.defense.base}</div>
                  <div>maxi<br/>{armor.defense.max}</div>
                  <div>augm<br/>{armor.defense.augmented}</div>
                </div>
                {armor.skills.length > 0 ? (
                  <div className="armor__skills">
                  {armor.skills.map(skill => {
                  return(
                    <div className="armor__skill">
                      <div className="hexagon"></div>
                      <div className="skill__name">{skill.skillName} {skill.level}</div>
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
                          <div className="slot__svg-container">
                            {slot.rank === 1 ? <Deco1 /> : null }
                            {slot.rank === 2 ? <Deco2 /> : null }
                            {slot.rank === 3 ? <Deco3 /> : null }
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="armor__no-slot">No slots</div>
                )}
                {armor.resistances ? (
                  <div className="armor__resistances">
                  {Object.keys(armor.resistances).map(res => {
                  return(
                    <div key={`${armor.id}__${res}--res`} className={`armor__res armor__res--${res}`}>{armor.resistances[res] ? armor.resistances[res] : '0'}</div>
                  )
                  })}
                  </div>
                ) : null}
              </div>
            </li>
            </>
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
          position: relative;
          display: block;
          grid-column-end: span 1;
          min-height: 200px;
          text-decoration: none;
          color: black;
          font-family: arial;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }
        .armor--head {
          grid-column-start: 1;
        }
        .armor--chest {
          grid-column-start: 2
        }
        .armor--gloves {
          grid-column-start: 3
        }
        .armor--waist {
          grid-column-start: 4
        }
        .armor--legs {
          grid-column-start: 5
        }
        .armors__list > .armor__set {
          grid-column-end: span 5;
          padding: 10px;
          background-color: black;
          color: white;
          font-weight: bold;
        }
        .armor__img-container {
          position: absolute;
          height: 150px;
          width: 100%;
          z-index: 0;
          opacity: 0.25;
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .armor__img-container img {
          object-fit: cover;
          width: 100%; height: 100%;
        }
        .armor__infos {
          display: grid;
          width: 100%;
          grid-template-columns: 1fr;
          grid-template-rows: 75px 50px 30px 50px 50px;
          gap: 10px;
        }
        .armor__name {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .armor__name .armor__id {
          display: inline-block;
          margin-right: 5px;
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
          color: black;
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
          height: 25px;
          width: 100%;
          display: grid;
          grid-template-columns: 30px 1fr;
          gap: 5px;
        }
        .skill__name {
          align-self: center;
        }
        .hexagon {
          width: 20px;
          height: 11px;
          background: rgba(0,0,0,0.5);
          position: relative;
          align-self: center;
        }
        .hexagon:before {
          content: "";
          position: absolute;
          top: -5px;
          left: 0;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 5px solid rgba(0,0,0,0.5);
        }
        .hexagon:after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 5px solid rgba(0,0,0,0.5);
        }
        .armor__slots {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .armor__slot {
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 5px;
        }
        .slot__svg-container {
          width: 50px;
          height: 50px;
        }
        .slot__svg-container svg {
          width: 100%;
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
          background-color: rgba(255,0,0,0.25);
        }
        .armor__res--water {
          background-color: rgba(0,0,255,0.25);
        }
        .armor__res--ice {
          background-color: rgba(100, 100, 255, 0.25);
        }
        .armor__res--thunder {
          background-color: rgba(255, 255, 0, 0.25);
        }
        .armor__res--dragon {
          background-color: rgba(150, 0, 150, 0.25);
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
