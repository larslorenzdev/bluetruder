import {Box3, Object3D, Vector3} from "three";

export function getCenter(object: Object3D){
  const meshABoundingBox = new Box3().setFromObject(object);

  return meshABoundingBox.getCenter(new Vector3());
}

export function getSize(object: Object3D){
  const meshABoundingBox = new Box3().setFromObject(object);

  return meshABoundingBox.getSize(new Vector3());
}

export function applyScale2d(objectA: Object3D, objectB: Object3D, offset = 1)  {
  const meshASize = getSize(objectA)
  const meshBSize = getSize(objectB)

  const meshAMaxDimension = Math.max(meshASize.x, meshASize.y, meshASize.z);
  const meshBMaxDimension = Math.max(meshBSize.x, meshBSize.y, meshBSize.z);

  const defaultScale = meshAMaxDimension / meshBMaxDimension;
  const offsetScale = defaultScale * offset;

  objectB.scale.set(offsetScale, offsetScale, 1);
}

export function moveToCenter (object: Object3D) {
  const center = getCenter(object)

  object.translateX(-center.x);
  object.translateY(-center.y);
  object.translateZ(-center.z);
}