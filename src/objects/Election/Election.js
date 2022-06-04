import { Group, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import {Font} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import fontJson from "../../fonts/helvetiker_bold.typeface.json";
import { Vector3 } from 'three';

const font = new Font(fontJson);

function y_from_year(year) {
  return (year - 1976) * 1.5
}

export class Election extends Group {
  pos;

  constructor(x, year, z, color) {    
    super();

    this.name = 'election';

    const geometry = new BoxGeometry( 1, 1, 1 );
    const material = new MeshBasicMaterial( { color: color } );
    const cube = new Mesh( geometry, material );
    cube.position.x = x;
    cube.position.y = y_from_year(year);
    cube.position.z = z;
    this.add( cube );
    this.pos = cube.position;
    console.log('election position', cube.position.y)
  }
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

    const text = new Mesh( textGeo, material);
    text.position.x = 15;
    text.position.y = y_from_year(year);
    text.position.z = -6;
    text.rotateOnAxis(new Vector3(0, 1, 0), 0.4)
    this.add(text);

  }
}
