
import { useRef, Suspense, useEffect } from 'react'

import DollarBillStacked from './DollarBillStacked';

const StackedBills = ({ isVisible, isMobile, bills }) => {
  const billsRef = useRef([]);


  useEffect(() => {
    billsRef.current = billsRef.current.slice(0, bills.length);
  }, []);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count + 1 >= bills.length) clearInterval(interval)
      billsRef?.current[count]?.visible = isVisible
      // billsRef?.current[count]?.isVisible = true
      count++

    }, 50)
    return () => clearInterval(interval)
  }, [isVisible])

  useEffect(() => {

    billsRef.current.map((item) => {
      item.visible = isVisible
    })

  }, [isVisible])

  return (
    <Suspense fallback={null}>
      {bills.map((item, i) => {
        return (
          <DollarBillStacked
            isVisible={false}
            key={i}
            _ref={el => billsRef.current[i] = el}
            isMobile={isMobile}
            {...item}
          />
        )
      })}
    </Suspense>
  )
}

export default StackedBills;
