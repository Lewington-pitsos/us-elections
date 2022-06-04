import { Group, Mesh, BufferGeometry, Vector3 } from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { Election, Year } from './Election/Election.js'
import Parties from '../us-parties.json'
import ElectionData from '../us-elections.json'

function connectingLine(e1, e2) {
  const points = [
    new Vector3(
      e1.pos.x, 
      e1.pos.y, 
      e1.pos.z,
    ), 
    new Vector3(
      e2.pos.x, 
      e2.pos.y, 
      e2.pos.z, 
    )
  ];
  const line = new MeshLine();

  const geometry = new BufferGeometry().setFromPoints(points);
  line.setGeometry(geometry, p => 0.1);
  
  const lineMaterial = new MeshLineMaterial({});
  
  return new Mesh(line, lineMaterial);
}

const PartyLocations = new Map()

class Seat {
  name;
  currentElection = null;

  constructor(name) {
    this.name = name;
  }

  newElection(year, winner) {
    const xjitter = (Math.random() - 0.5) * 6
    const zjitter = (Math.random() - 0.5) * 6
    const [x, z] = PartyLocations.get(winner.Name);
    const e = new Election(x + xjitter, year, z + zjitter, winner.Color);
    
    this.currentElection = e;
    return e;
  }
}


const radius = 10;
const partyCount = 4;
const partyDegrees = 360 / partyCount

let index = 0
for (let degrees = 0; degrees < 360; degrees += partyDegrees) {
  const x = radius * Math.cos(degrees); 
  const y = radius * Math.sin(degrees);
  
  const location = [x, y];
  PartyLocations.set(Object.values(Parties)[index].Name, location);
  index += 1
}

export default class SeedScene extends Group {
  constructor() {
    super();

    const allStates = new Map();

    var firstYear = false;
    for(const year in ElectionData) {


      const states = ElectionData[year];
      for (const state in states) {

        const results = states[state];

        var winner = null;
        var maxVotes = 0;
        
        for (const party in results['parties']) {
          const votes = results['parties'][party];

          if (votes > maxVotes) {
            winner = party;
            maxVotes = votes;
          }
        }

        if (allStates.get(state) == undefined) {
          allStates.set(state, new Seat(state));
        }

        this.addElection(year, allStates.get(state), Parties[winner]);
      }

      this.addYear(year);

      firstYear = false;
    }
  }
  
  addYear(year) {
    const yearText = new Year(year);
    this.add(yearText);
  }

  addElection(year, seat, nextWinner) {
    const previousElection = seat.currentElection;
    const nextElection = seat.newElection(year, nextWinner);
    this.add(nextElection)

    if (previousElection != null) {
      const mesh = connectingLine(previousElection, nextElection);
      this.add(mesh);
    }
  }

  update(timeStamp) {}
}