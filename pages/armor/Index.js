import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";

class Armors extends Component {
  constructor(props) {
    super(props)

    let ranks = {}
    props.armors.forEach(armor => {
      if (!(armor.rank in ranks)) {
        console.log(armor.rank)
        ranks = Object.assign({}, ranks, {[armor.rank]: false})
      }
    })
    // Activer par défaut le High Rank
    // for (var [rankName, rankValue] in ranks) {
    //   if (rankName === 'high') {
    //     rankValue = true
    //   }
    // }

    this.state = {
      value: '',
      ranks: ranks,
      armors: props.armors
    }

    console.log(this.state)
  }

  filterBySkill(event) {
    let value = ''
    let newListOfArmors = this.props.armors
    if (event.target.value !== '') {
      value = event.target.value
      newListOfArmors = this.props.armors.filter(armor => {
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
    this.setState({
      value: value,
      armors: newListOfArmors
    })
  }

  render() {
    const { skills } = this.props;
    return (
      <div>
        <h1>MHW Armors</h1>
        <section className="armors__filters">
          <select className="filter__skill" onChange={this.filterBySkill.bind(this)} value={this.state.value}>
            <option defaultValue value=''>----------------</option>
            {skills.map(skill => {
              return (
                <option key={`skill_${skill.id}`} value={skill.id}>
                  {skill.name}
                </option>
              )
            })}
          </select>
          {(this.state.value !== '') ? (
            <span> {this.state.armors.length} résultats</span>
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
          {this.state.armors.map(armor => {
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
    );
  }
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
