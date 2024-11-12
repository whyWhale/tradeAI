import { useState, useEffect, useRef } from 'react';
import Particle from './js/Particle';
import Tail from './js/Tail';
import Spark from './js/Spark';
import { hypotenuse, randomNumBetween } from './js/utils';

const FireworkButton = () => {
  const [showFirework, setShowFirework] = useState(false);
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const tails = useRef([]);
  const sparks = useRef([]);
  const requestRef = useRef();
  const thenRef = useRef(Date.now());
  const fps = 60;
  const interval = 1000 / fps;

  const startFirework = () => {
    setShowFirework(true);
  };

  useEffect(() => {
    let timer;
    if (showFirework) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;

      const initCanvas = () => {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
      };

      const createTail = () => {
        const x = randomNumBetween(
          window.innerWidth * 0.2,
          window.innerWidth * 0.8
        );
        const vy = window.innerHeight * randomNumBetween(0.01, 0.015) * -1;
        const colorDeg = randomNumBetween(0, 360);
        tails.current.push(new Tail(ctx, x, vy, colorDeg));
      };

      const createParticles = (x, y, colorDeg) => {
        const PARTICLE_NUM = 400;
        for (let i = 0; i < PARTICLE_NUM; i++) {
          const r =
            randomNumBetween(2, 100) *
            hypotenuse(window.innerWidth, window.innerHeight) *
            0.0001;
          const angle = (Math.PI / 180) * randomNumBetween(0, 360);
          const vx = r * Math.cos(angle);
          const vy = r * Math.sin(angle);
          const opacity = randomNumBetween(0.6, 0.9);
          const _colorDeg = randomNumBetween(-20, 20) + colorDeg;
          particles.current.push(
            new Particle(ctx, x, y, vx, vy, opacity, _colorDeg)
          );
        }
      };

      const render = () => {
        requestRef.current = requestAnimationFrame(render);
        const now = Date.now();
        const delta = now - thenRef.current;

        if (delta > interval) {
          ctx.fillStyle = '#00000030';
          ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

          if (Math.random() < 0.03) createTail();

          tails.current.forEach((tail, index) => {
            tail.update();
            tail.draw();

            for (let i = 0; i < Math.round(-tail.vy * 0.5); i++) {
              const vx = randomNumBetween(-5, 5) * 0.05;
              const vy = randomNumBetween(-5, 5) * 0.05;
              const opacity = Math.min(-tail.vy, 0.5);
              sparks.current.push(
                new Spark(ctx, tail.x, tail.y, vx, vy, opacity, tail.colorDeg)
              );
            }

            if (tail.vy > -0.7) {
              tails.current.splice(index, 1);
              createParticles(tail.x, tail.y, tail.colorDeg);
            }
          });

          particles.current.forEach((particle, index) => {
            particle.update();
            particle.draw();

            if (Math.random() < 0.1) {
              sparks.current.push(
                new Spark(ctx, particle.x, particle.y, 0, 0, 0.3, 45)
              );
            }

            if (particle.opacity < 0) particles.current.splice(index, 1);
          });

          sparks.current.forEach((spark, index) => {
            spark.update();
            spark.draw();

            if (spark.opacity < 0) sparks.current.splice(index, 1);
          });

          thenRef.current = now - (delta % interval);
        }
      };

      initCanvas();
      render();

      window.addEventListener('resize', initCanvas);

      // 10초 후에 불꽃놀이 종료
      timer = setTimeout(() => {
        setShowFirework(false);
      }, 20000);

      return () => {
        cancelAnimationFrame(requestRef.current);
        window.removeEventListener('resize', initCanvas);
        clearTimeout(timer);
        // 상태 초기화
        particles.current = [];
        tails.current = [];
        sparks.current = [];
      };
    }
  }, [showFirework]);

  return (
    <>
    {/* 🎆 */}
      <button onClick={startFirework}>🎇</button>
      {showFirework && (
        <canvas
          ref={canvasRef}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        ></canvas>
      )}
    </>
  );
};

export default FireworkButton;
