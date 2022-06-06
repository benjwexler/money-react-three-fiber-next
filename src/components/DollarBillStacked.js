import DollarBill from "./DollarBill";
import { height, length, width } from "../constants";
import { degrees_to_radians } from "../utils";

export default function DollarBillStacked({
  index,
  numRow,
  numCol,
  isMobile,
  ...restProps,
}) {
  const spaceInBetween = isMobile ? 0.07 : 0.1;
  const scale = isMobile ? (width / 2) : width;
  const widthWithSpace = (scale + spaceInBetween);
  
  const position = { x: 0, y: 0, z: 0 }
  position.y += ((index * height) * (isMobile ? 1.6 : 3));
  position.z += (numRow * length * widthWithSpace) + (length / 2);
  const x = (numCol * widthWithSpace) + (((widthWithSpace / 2) ) * (isMobile ? 1 : 1));
  position.x += x;

  return (
    <DollarBill
      {...restProps}
      position={[position.x, position.y, position.z]}
      rotation={[degrees_to_radians(270), 0, 0]}
      scale={scale}
    />
  )

}

