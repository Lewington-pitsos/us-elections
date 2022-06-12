import { Group, BoxGeometry, MeshBasicMaterial, Mesh, MeshLambertMaterial, TextureLoader, PlaneGeometry } from 'three';
import {Font} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import fontJson from "../../fonts/helvetiker_bold.typeface.json";
import Presidents from "../../presidents.json"

var loader = new TextureLoader();
const font = new Font(fontJson);

function y_from_year(year) {
  return (year - 1976) * 4
}

export class Election extends Group {
  pos;
  winner;
  cube;
  line;
  seat;

  constructor(seat, x, year, z, winner, stateCode, yoffset) {    
    super();
    this.seat = seat;

    this.name = 'election';
    this.winner = winner;

    const geometry = new BoxGeometry( 0.9, 0.9, 0.9 );
    const material = new MeshBasicMaterial( { color: winner.Color } );
    const textMaterial = new MeshBasicMaterial( { color: "#ffffff" } );

    const cube = new Mesh( geometry, material );
    cube.position.x = x;
    cube.position.y = y_from_year(year) + yoffset;
    cube.position.z = z;
    this.add( cube );
    this.cube = cube;

    const textGeo = new TextGeometry(stateCode, {
      font: font,
      size: 0.4,
      height: 0.5
    });
    const text = new Mesh( textGeo, textMaterial);
    text.position.x = x - 0.4
    text.position.y = cube.position.y - 0.2
    text.position.z = z
    this.add(text)

    this.pos = cube.position;
  }

  highlightSeat() {
    this.seat.highlightAll();
  } 

  unfocusSeat() {
    this.seat.unfocusAll();
  }

  highlight() {
    this.cube.material.color.set("#00cc99");
    if (this.line) {
      this.line.material.color.set("#00cc99");
      this.line.geometry.setGeometry(this.line.geometry, p => 0.2);
    }
  }

  unfocus() {
    this.cube.material.color.set(this.winner.Color);
    if (this.line) {
      this.line.material.color.set("#ffffff");
      this.line.geometry.setGeometry(this.line.geometry, p => 0.05);
    }
  }

  addLine(line) {
    this.line = line;
    this.add(line);
  }
}

function getXPos(president) {
  if (president.Party == "Democrat") {
    return 100
  }

  return -100
}

export class Year extends Group {
  constructor(year) {    
    super();
    this.name = 'year';

    const material = new MeshBasicMaterial( { color: "#ffffff" } );

    const textGeo = new TextGeometry(year.toString(), {
      font: font,
      size: 2,
      height: 1
    });

    const president = Presidents[year.toString()]


    const text = new Mesh( textGeo, material);
    text.position.x = getXPos(president) - 3.5;
    text.position.y = y_from_year(year) - 2;
    text.position.z = -5;
    this.add(text);


    const downsize = 45
    const imageGeo = new PlaneGeometry(268 / downsize, 340 / downsize);
    const imageMat = new MeshLambertMaterial({
      map: loader.load(president.Link)
    });
    
    const cube = new Mesh( imageGeo, imageMat );
    cube.position.x = getXPos(president)
    cube.position.y = y_from_year(year) + 6;
    cube.position.z = -5;
    this.add( cube );


  }
}
