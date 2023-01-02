import { Suspense } from "react";
import DollarBillStacked from "./DollarBillStacked";

const StackedBills = ({ bills, breakpoint, count }) => {
  return (
    <Suspense fallback={null}>
      {bills.map((item, i) => {
        return (
          <DollarBillStacked
            isVisible={count >= i}
            key={i}
            breakpoint={breakpoint}
            {...item}
          />
        );
      })}
    </Suspense>
  );
};

export default StackedBills;
