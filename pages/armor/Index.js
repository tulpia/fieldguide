import React, { useState, useEffect } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { capitalize } from '../../utils/utils'

import "./armors.scss"

import Deco1 from '../../assets/deco1.svg'
import Deco2 from '../../assets/deco2.svg'
import Deco3 from '../../assets/deco3.svg'
import Star from '../../assets/star.svg'

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
    <div className="armors__container">
      <h1>MHW Armors</h1>
      <div className="armors__guide">
        <div>Head</div>
        <div>Chest</div>
        <div>Gloves</div>
        <div>Waist</div>
        <div>Legs</div>
      </div>
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
              <div key={`set--${armor.armorSet.id}`} className="armor__set">
                {sets[armor.armorSet.id].name}
                <Star />
              </div>
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
