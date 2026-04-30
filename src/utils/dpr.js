export const DPR = window.devicePixelRatio || 1;
export const px  = n => Math.round(n * DPR) + 'px';
