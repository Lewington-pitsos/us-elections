import { Group, Mesh, BufferGeometry, Vector3 } from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import Election from './Election/Election.js'
import Parties from '../us-parties.json'
import ElectionData from '../us-elections.json'


function connectingLine(e1, e2) {
  const points = [
    new Vector3(
      e1.position.x * 2, 
      e1.position.y * 2, 
      e1.position.z * 2,
    ), 
    new Vector3(
      e2.position.x * 2, 
      e2.position.y * 2, 
      e2.position.z * 2, 
    )
  ];
  const line = new MeshLine();

  const geometry = new BufferGeometry().setFromPoints(points);
  line.setGeometry(geometry, p => 0.1);
  
  const lineMaterial = new MeshLineMaterial({});
  
  return new Mesh(line, lineMaterial);
}

const PartyLocations = new Map([
])

class Seat {
  ELECTION_DISTANCE = 5
  name;
  elections = 0;
  currentElection = null;

  constructor(name) {
    this.name = name;
  }

  newElection(winner) {
    const xjitter = (Math.random() - 0.5) * 4
    const zjitter = (Math.random() - 0.5) * 4
    const [x, z] = PartyLocations.get(winner.Name);
    const e = new Election(x + xjitter, this.elections * this.ELECTION_DISTANCE, z + zjitter, winner.Color);
    
    this.elections += 1;
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

        this.addElection(allStates.get(state), Parties[winner]);
      }


      firstYear = false;
    }


    // const hawthorn = new Seat("hawthorn")
    // const bayswater = new Seat("bayswater")
    // const auburn = new Seat("auburn")
    // const frankston = new Seat("frankston")

    // this.addElection(hawthorn, Parties.ALP);
    // this.addElection(hawthorn, Parties.ALP);
    // this.addElection(hawthorn, Parties.ALP);
    // this.addElection(hawthorn, Parties.LNP);
    // this.addElection(hawthorn, Parties.ALP);
    // this.addElection(hawthorn, Parties.GRN);

    // this.addElection(bayswater, Parties.NP);
    // this.addElection(bayswater, Parties.NP);
    // this.addElection(bayswater, Parties.NP);
    // this.addElection(bayswater, Parties.NP);
    // this.addElection(bayswater, Parties.GRN);
    // this.addElection(bayswater, Parties.ALP);
    // this.addElection(bayswater, Parties.ALP);
    // this.addElection(bayswater, Parties.ALP);
    // this.addElection(bayswater, Parties.ALP);

    // this.addElection(auburn, Parties.GRN)
    // this.addElection(auburn, Parties.GRN)
    // this.addElection(auburn, Parties.GRN)
    // this.addElection(auburn, Parties.ALP)
    // this.addElection(auburn, Parties.GRN)
    // this.addElection(auburn, Parties.GRN)
    // this.addElection(auburn, Parties.ALP)
    // this.addElection(auburn, Parties.ALP)
    // this.addElection(auburn, Parties.GRN)

    // this.addElection(frankston, Parties.ACL)
    // this.addElection(frankston, Parties.ACL)
    // this.addElection(frankston, Parties.ALP)
    // this.addElection(frankston, Parties.ALP)
    // this.addElection(frankston, Parties.ALP)
    // this.addElection(frankston, Parties.LNP)
    // this.addElection(frankston, Parties.LNP)
    // this.addElection(frankston, Parties.LNP)
    // this.addElection(frankston, Parties.LNP)
    // this.addElection(frankston, Parties.LNP)
  }

  addElection(seat, nextWinner) {
    const previousElection = seat.currentElection;
    const nextElection = seat.newElection(nextWinner);
    this.add(nextElection)

    if (previousElection != null) {
      const mesh = connectingLine(previousElection, nextElection);
      this.add(mesh);
    }
  }
  

  update(timeStamp) {}
}