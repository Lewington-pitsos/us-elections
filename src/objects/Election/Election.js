import { Group, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import {Font} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import fontJson from "../../fonts/helvetiker_bold.typeface.json";

const font = new Font(fontJson);

function y_from_year(year) {
  return (year - 1976) * 4
}

export class Election extends Group {
  pos;
  winner;

  constructor(x, year, z, winner, stateCode, yoffset) {    
    super();

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

    const textGeo = new TextGeometry(stateCode, {
      font: font,
      size: 0.4,
      height: 0.5
    });
    const text = new Mesh( textGeo, textMaterial);
    console.log(cube.position.x)
    text.position.x = x - 0.4
    text.position.y = cube.position.y - 0.2
    text.position.z = z
    this.add(text)

    this.pos = cube.position;
  }
}


export class Year extends Group {
  constructor(year) {    
    super();
    this.name = 'year';

    const material = new MeshBasicMaterial( { color: "#ffffff" } );

    const textGeo = new TextGeometry(year.toString(), {
      font: font,
      size: 4,
      height: 1
    });

    const text = new Mesh( textGeo, material);
    text.position.x = -7;
    text.position.y = y_from_year(year) - 5;
    text.position.z = -5;
    this.add(text);

  }
}
