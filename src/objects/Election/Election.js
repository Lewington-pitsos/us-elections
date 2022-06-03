import { Group, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

export default class Election extends Group {
  position;

  constructor(x, y, z, color) {    
    super();

    this.name = 'election';

    const geometry = new BoxGeometry( 1, 1, 1 );
    const material = new MeshBasicMaterial( { color: color } );
    const cube = new Mesh( geometry, material );
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    this.add( cube );
    this.position = cube.position;
  }
}
