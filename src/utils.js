export function getRandomInt(max) {
  return Math.round(Math.random() * max);
}

export function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

export const getPercentInViewport = (boundingRect) => {
  if (!boundingRect) return 0;
  const { height, top, bottom } = boundingRect;
  const offsetAmount = 100;
  let amountInViewportTop = 1 - -1 * ((top - offsetAmount) / height);
  amountInViewportTop =
    amountInViewportTop > 1
      ? 1
      : amountInViewportTop < 0
      ? 0
      : amountInViewportTop;
  let amountInViewPortBottom =
    1 - (bottom + offsetAmount - window.innerHeight) / height;
  amountInViewPortBottom =
    amountInViewPortBottom > 1
      ? 1
      : amountInViewPortBottom < 0
      ? 0
      : amountInViewPortBottom;
  const finalVal = Math.min(amountInViewportTop, amountInViewPortBottom) * 1;
  return (finalVal < 0.8 ? 0.8 : finalVal).toFixed(1);
};

export const checkIfElemHasPastViewport = (elem) => {
  if (!elem) return;

  //get the distance scrolled on body (by default can be changed)
  var distanceScrolled = document.body.scrollTop;
  //create viewport offset object
  var elemRect = elem.getBoundingClientRect();
  elem.style.opacity = getPercentInViewport(elemRect);
  //get the offset from the element to the viewport
  var elemViewportOffset = elemRect.top;
  //add them together
  var totalOffset = distanceScrolled + elemViewportOffset;

  let _scrollPercentage;
  _scrollPercentage = totalOffset / window.innerHeight;
  _scrollPercentage = _scrollPercentage < 0 ? 0 : _scrollPercentage;
  _scrollPercentage = _scrollPercentage > 1 ? 0 : 1 - _scrollPercentage;

  return _scrollPercentage;
};

export const createBillsArr = ({ cols }) => {
  const arr = [];
  const rows = 4;
  const numBills = 10;
  let num = (numBills / 2) * -1;
  let row = (rows / 2) * -1;
  let col = (cols / 2) * -1;

  while (col < cols / 2) {
    arr.push({
      index: num,
      numRow: row,
      numCol: col,
    });

    num += 1;

    if (num > numBills / 2) {
      num = (numBills / 2) * -1;
      row += 1;
    }

    if (row >= rows / 2) {
      col += 1;
      row = (rows / 2) * -1;
    }
  }

  return arr;
};
