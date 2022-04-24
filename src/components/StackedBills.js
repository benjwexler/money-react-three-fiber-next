
import { useRef, Suspense, useEffect } from 'react'

import DollarBillStacked from './DollarBillStacked';
import { bills } from '../constants'

const StackedBills = ({ isVisible }) => {
  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, bills.length);
  }, []);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count + 1 >= bills.length) clearInterval(interval)
      itemsRef ?.current[count] ?.visible = isVisible
      // itemsRef?.current[count]?.isVisible = true
      count++

    }, 50)
    return () => clearInterval(interval)
  }, [isVisible])

  useEffect(() => {

    itemsRef.current.map((item) => {
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
            _ref={el => itemsRef.current[i] = el}
            {...item}
          />
        )
      })}
    </Suspense>
  )
}

export default StackedBills;
