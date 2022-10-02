import { useRef, Suspense, useEffect } from "react";
import DollarBillStacked from "./DollarBillStacked";

const StackedBills = ({ isVisible, bills, breakpoint }) => {
  const billsRef = useRef([]);

  useEffect(() => {
    billsRef.current = billsRef.current.slice(0, bills.length);
  }, [bills.length]);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count + 1 >= bills.length) clearInterval(interval);
      if (billsRef?.current[count]) {
        billsRef.current[count].visible = isVisible;
      }

      count++;
    }, 50);
    return () => clearInterval(interval);
  }, [isVisible, bills.length]);

  useEffect(() => {
    billsRef.current.map((item) => {
      item.visible = isVisible;
    });
  }, [isVisible]);

  return (
    <Suspense fallback={null}>
      {bills.map((item, i) => {
        return (
          <DollarBillStacked
            isVisible={false}
            key={i}
            _ref={(el) => (billsRef.current[i] = el)}
            breakpoint={breakpoint}
            {...item}
          />
        );
      })}
    </Suspense>
  );
};

export default StackedBills;
