import { Group, Mesh, BufferGeometry, Vector3, BoxGeometry, MeshBasicMaterial, AmbientLight } from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import {Font} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import { Election, Year } from './Election/Election.js'
import Parties from '../us-parties.json'
import ElectionData from '../us-elections.json'
import USPS from '../usps.json'
import fontJson from "../fonts/helvetiker_bold.typeface.json";
const font = new Font(fontJson);

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
  
  const color = "#ffffff";
  line.setGeometry(geometry);
  
  const lineMaterial = new MeshLineMaterial({
    color: color, 
    lineWidth: 0.05
  });
  
  return new Mesh(line, lineMaterial);
}

function formatState(state) {
  const final = []

  const stateWords = state.split(' ')

  for (let index = 0; index < stateWords.length; index++) {
    const word = stateWords[index]
    final.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
  }

  return final.join(' ')
}

function getUSP(state) {
  return USPS[formatState(state)];
}


class Seat {
  name;
  elections = [];
  currentElection = null;

  constructor(name) {
    this.name = name;
  }

  newElection(year, winner, x, z, yoffset) {
    const e = new Election(this, x, year, z, winner, getUSP(this.name), yoffset);

    if (this.currentElection != null) {
      const mesh = connectingLine(this.currentElection, e);
      e.addLine(mesh);
    }

    this.elections.push(e);

    this.currentElection = e;
    return e;
  }

  highlightAll() {
    for (let index = 0; index < this.elections.length; index++) {
      const election = this.elections[index];
      election.highlight();
    }
  }

  unfocusAll() {
    for (let index = 0; index < this.elections.length; index++) {
      const election = this.elections[index];
      election.unfocus();
    }
  }
}


function quantize(val, candidates) {
  let currentDiff = 1;
  let currentCandidate = null
  for (let index = 0; index < candidates.length; index++) {
    const candidate = candidates[index];
    const candidateDiff = Math.abs(val - candidate);
    if (candidateDiff < currentDiff) {
      currentDiff = candidateDiff;
      currentCandidate = candidate
    }
  }

  return currentCandidate
}
  
const wingspan = 250
const PartyLocations = new Map([
  ["DEMOCRAT", wingspan],
  ["REPUBLICAN", -wingspan]
])
const candidates = [];

for (let index = -wingspan; index < wingspan; index += 1) {
  if (index !== 0) {
    candidates.push(index);
  }
}

export default class SeedScene extends Group {
  constructor() {
    super();

    const allStates = new Map();

    var firstYear = false;
    for(const year in ElectionData) {

      const xvals = new Map();


      const states = ElectionData[year];
      for (const state in states) {

        const results = states[state];

        var winner = null;
        var maxVotes = 0;
        var xpos = 0
        var x

        const totalVotes = results['parties']['DEMOCRAT'] + results['parties']['REPUBLICAN']

        for (const party in results['parties']) {
          if (party === "DEMOCRAT" || party === "REPUBLICAN") {

            const votes = results['parties'][party];
            const voteProp =  votes/totalVotes;
            
            x = PartyLocations.get(party);
            
            xpos += x * voteProp
            
            if (votes > maxVotes) {
              winner = party;
              maxVotes = votes;
            }
          }
        }

        if (allStates.get(state) == undefined) {
          allStates.set(state, new Seat(state));
        }


        xpos = quantize(xpos, candidates)
        
        if (!xvals.has(xpos)) {
          xvals.set(xpos, 0);
        } else {
          xvals.set(xpos, xvals.get(xpos) + 1)
        }

        this.addElection(year, allStates.get(state), Parties[winner], xpos, 0, xvals.get(xpos));
      }

      this.addYear(year);

      firstYear = false;
    }

    const backTickHeight = 190
    for (let index = -wingspan; index < wingspan; index += 25) {
      if (index != 0) {

        const geometry = new BoxGeometry( 0.01, backTickHeight, 0.3 );
        const material = new MeshBasicMaterial({color: "#555555"});
        const divider = new Mesh( geometry, material );
        divider.position.x = index;
        divider.position.y = backTickHeight / 2 - 8;
        divider.position.z = -5
        this.add(divider)


        const textGeo = new TextGeometry((Math.abs(index) * 100 / 250).toString() + "%", {
          font: font,
          size: 2,
          height: 0.5
        });
        const textMaterial = new MeshBasicMaterial( {color: "#555555"} );
        const text = new Mesh( textGeo, textMaterial);
        text.position.x = index - 2.5;
        text.position.y = backTickHeight;
        text.position.z = -6
        this.add(text)


        const lowerTextGeo = new TextGeometry((Math.abs(index) * 100 / 250).toString() + "%", {
          font: font,
          size: 2,
          height: 0.5
        });
        const lowerTextMaterial = new MeshBasicMaterial( {color: "#555555"} );
        const lowertext = new Mesh( lowerTextGeo, lowerTextMaterial);
        lowertext.position.x = index - 2.5;
        lowertext.position.y = - 20
        lowertext.position.z = -6
        this.add(lowertext)
      }

      var light = new AmbientLight(0xf0f0f0, 0.07)

      // Specify the light's position
      light.position.set(1, 1, 1000 );

      // Add the light to the scene
      this.add(light)
    }
    

    const geometry = new BoxGeometry( 0.1, backTickHeight + 30, 3 );
    const material = new MeshBasicMaterial();
    const divider = new Mesh( geometry, material );
    divider.position.y = backTickHeight / 2 - 8;
    this.add(divider)
  }
  
  addYear(year) {
    const yearText = new Year(year);
    this.add(yearText);
  }

  addElection(year, seat, nextWinner, xpos, zpos, yoffest) {
    const nextElection = seat.newElection(year, nextWinner, xpos, zpos, yoffest);
    this.add(nextElection)
  }

  update(timeStamp) {}
}