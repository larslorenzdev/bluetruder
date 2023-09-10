import {Box3, Object3D, Vector3} from "three";

export function getCenter(object: Object3D) {
  const meshABoundingBox = new Box3().setFromObject(object);

  return meshABoundingBox.getCenter(new Vector3());
}

export function getSize(object: Object3D) {
  const meshABoundingBox = new Box3().setFromObject(object);

  return meshABoundingBox.getSize(new Vector3());
}

