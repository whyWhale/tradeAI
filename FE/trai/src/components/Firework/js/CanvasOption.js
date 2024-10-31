import { useRef, useEffect } from 'react';

const CanvasOption = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    return { canvas, ctx, dpr };
  }, []);

  return canvasRef;
};

export default CanvasOption;
