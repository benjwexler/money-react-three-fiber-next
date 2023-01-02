import { createBillsArr } from "./utils";

export const length = 2.61 / 6.14;
export const height = 0.008;
export const width = 1;

export const cameraInfo = { position: [-2, 4, 5], fov: 30, near: 3, far: 15 };

export const billsWideViewport = createBillsArr({ cols: 4 });
export const billsNarrowViewport = createBillsArr({ cols: 2 });

export const maxNumBills = billsWideViewport.length;
