import DollarBill from "./DollarBill";
import { height, length, width } from "../constants";
import { degrees_to_radians } from "../utils";

const getScale = (breakpoint) => {
  if (breakpoint === "L") return 1;

  if (breakpoint === "M") return 0.75;

  return 0.7;
};

export default function DollarBillStacked({
  index,
  numRow,
  numCol,
  breakpoint,
  ...restProps
}) {
  const isMobile = breakpoint === "S";
  const spaceInBetween = isMobile ? 0.08 : 0.1;
  const scale = width * getScale(breakpoint);
  const widthWithSpace = scale + spaceInBetween;

  const position = { x: 0, y: 0, z: 0 };
  position.y += index * height * (isMobile ? 2.25 : 3);
  position.z += numRow * length * widthWithSpace + length / 2;
  const x = numCol * widthWithSpace + widthWithSpace / 2;
  position.x += x;

  return (
    <DollarBill
      {...restProps}
      position={[position.x, position.y, position.z]}
      rotation={[degrees_to_radians(270), 0, 0]}
      scale={scale}
    />
  );
}
