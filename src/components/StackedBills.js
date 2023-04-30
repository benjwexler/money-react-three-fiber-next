import { Suspense, useEffect, useState } from "react";
import { maxNumBills } from "../constants";
import { createBillsArr } from "../utils";
import DollarBillStacked from "./DollarBillStacked";

const getBillsLayout = (breakpoint) => {
  const colsToBreakPointMap = {
    L: 4,
    M: 3,
    S: 2,
  };

  const cols = colsToBreakPointMap[breakpoint];
  return createBillsArr({ cols });
};

const useBillRenderCounter = () => {
  const [count, setCount] = useState(0);
  const shouldClearInterval = count >= maxNumBills;
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => count + 1);
    }, 50);

    if (shouldClearInterval) clearInterval(interval);
    return () => clearInterval(interval);
  }, [shouldClearInterval]);

  return count;
};

const StackedBills = ({ breakpoint, shouldDisplay }) => {
  const count = useBillRenderCounter();
  const bills = getBillsLayout(breakpoint);

  if (!shouldDisplay) return;

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
