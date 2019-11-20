import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";

class Armors extends Component {
  constructor(props) {
    super(props)

    console.log(props.skills)

    this.state = {
      value: '',
      armors: props.armors
    }
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
        <section className="armors__filter">
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
        </section>
        <ul className="armors__list">
          {this.state.armors.map(armor => {
            return (
              <li key={`armor_${armor.id}`} className={`list__armor armor--${armor.rank}`}>
                <Link href="/armor/[id]" as={`/armor/${armor.id}`}>
                  <a>
                    <span className="armor__id">
                      [{armor.id}]
                    </span>
                    <span className="armor__name">
                    {armor.name}
                    </span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
        <style jsx>{`
          ul {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            list-style-type: none;
            gap: 10px;
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
            justify-content: center;
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
