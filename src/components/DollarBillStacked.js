import DollarBill from "./DollarBill";
import { height, length, width } from "../constants";
import { degrees_to_radians } from "../utils";

export default function DollarBillStacked({
  index,
  numRow,
  numCol,
  ...restProps,
}) {

  const position = { x: 0, y: 0, z: 0 }
  position.y += ((index * height) * 3);
  position.z += (numRow * length * 1.1) + (length / 2);
  position.x += ((numCol) * 1.1) + width / 2;

  return (
    <DollarBill
      {...restProps}
      position={[position.x, position.y, position.z]}
      rotation={[degrees_to_radians(270), 0, 0]}
    />
  )

}

