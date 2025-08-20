'use client';

import { useEffect, useRef, useState } from 'react';

interface CosmicBallBackgroundProps {
  ballPosition?: {
    x: number; // 0-100 percentage
    y: number; // 0-100 percentage
  };
  className?: string;
}

interface BallInstance {
  id: number;
  x: number;
  y: number;
  isOriginal: boolean;
  isTransitioning?: boolean;
  isDisappearing?: boolean;
  createdAt?: number;
}

export default function CosmicBallBackground({
  ballPosition = { x: 50, y: 50 },
  className = '',
}: CosmicBallBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const touchingLinesRef = useRef<
    Array<{ element: HTMLDivElement; isRed: boolean }>
  >([]);
  const nextBallId = useRef(1);
  const disappearTimeouts = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Use the ballPosition prop directly
  const ballPositionRef = useRef(ballPosition);

  const [balls, setBalls] = useState<BallInstance[]>([
    { id: 0, x: ballPosition.x, y: ballPosition.y, isOriginal: true },
  ]);

  // Update position when prop changes
  useEffect(() => {
    ballPositionRef.current = ballPosition;

    // Update the original ball position
    setBalls((prev) =>
      prev.map((ball) =>
        ball.isOriginal
          ? { ...ball, x: ballPosition.x, y: ballPosition.y }
          : ball
      )
    );
  }, [ballPosition]);

  // Auto-disappear effect for non-original balls
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setBalls((prev) => {
        let hasChanges = false;
        const updatedBalls = prev.map((ball) => {
          if (
            !ball.isOriginal &&
            !ball.isDisappearing &&
            ball.createdAt &&
            now - ball.createdAt >= 5000
          ) {
            hasChanges = true;

            const timeoutId = setTimeout(() => {
              setBalls((current) => current.filter((b) => b.id !== ball.id));
              disappearTimeouts.current.delete(ball.id);
            }, 500);

            disappearTimeouts.current.set(ball.id, timeoutId);

            return { ...ball, isDisappearing: true };
          }
          return ball;
        });

        return hasChanges ? updatedBalls : prev;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      const timeouts = disappearTimeouts.current;
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const dot = dotRef.current;
    if (!container || !dot) return;

    // Set up constant pulse animation independent of lines
    const setupPulseAnimation = () => {
      const existingStyle = document.getElementById('constantPulseStyle');
      if (existingStyle) {
        existingStyle.remove();
      }

      const pulseKeyframes = `
        @keyframes constantPulse {
          from {
            box-shadow: 0 0 8px rgba(229, 229, 229, 0.4);
          }
          to {
            box-shadow: 0 0 16px rgba(229, 229, 229, 0.7);
          }
        }
      `;

      const style = document.createElement('style');
      style.id = 'constantPulseStyle';
      style.textContent = pulseKeyframes;
      document.head.appendChild(style);

      const allBallElements = container.querySelectorAll('.cosmic-ball');
      allBallElements.forEach((ballElement) => {
        (ballElement as HTMLElement).style.animation =
          'constantPulse 0.9s ease-in-out infinite alternate';
      });
    };

    setupPulseAnimation();

    const updateBallColor = () => {
      const touchingLines = touchingLinesRef.current;
      const totalLines = touchingLines.length;
      const redLines = touchingLines.filter((line) => line.isRed).length;
      const redPercentage = totalLines > 0 ? redLines / totalLines : 0;

      let red, green, blue;

      if (redPercentage === 0 || totalLines === 0) {
        red = 229;
        green = 229;
        blue = 229;
      } else {
        red = Math.round(229 - (229 - 180) * redPercentage);
        green = Math.round(229 - (229 - 40) * redPercentage);
        blue = Math.round(229 - (229 - 40) * redPercentage);
      }

      if (dot) {
        dot.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
      }
    };

    const createLine = () => {
      const line = document.createElement('div');
      line.className = 'absolute bg-white/90 pointer-events-none';
      line.style.transformOrigin = 'top center';
      line.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
      line.style.boxShadow = `
        0 0 4px rgba(255, 255, 255, 0.6),
        0 0 8px rgba(255, 255, 255, 0.4),
        0 0 12px rgba(255, 255, 255, 0.2)
      `;
      container.appendChild(line);
      return line;
    };

    const animateLine = () => {
      // Use current ball position instead of prop
      const centerX = (window.innerWidth * ballPositionRef.current.x) / 100;
      const centerY = (window.innerHeight * ballPositionRef.current.y) / 100;

      const side = Math.floor(Math.random() * 3);
      let startX, startY;

      if (side === 0) {
        startX = 0;
        startY = window.innerHeight * (0.2 + Math.random() * 0.4);
      } else if (side === 1) {
        startX = window.innerWidth;
        startY = window.innerHeight * (0.2 + Math.random() * 0.4);
      } else {
        startX = window.innerWidth * (0.2 + Math.random() * 0.6);
        startY = 0;
      }

      const targetX = centerX;
      const targetY = centerY;

      const deltaX = targetX - startX;
      const deltaY = targetY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

      const line = createLine();
      const isRedLine = Math.random() < 0.2;

      const lineData = {
        element: line,
        isRed: isRedLine,
      };

      let addedToTouching = false;

      const initialWidth = 2;
      const phase1Duration = 900;
      const phase2Duration = 1600;

      line.style.left = startX + 'px';
      line.style.top = startY + 'px';
      line.style.width = initialWidth + 'px';
      line.style.height = '0px';
      line.style.opacity = '1';
      line.style.transformOrigin = 'top center';
      line.style.transform = `translate(-50%, 0) rotate(${angle - 90}deg)`;

      if (isRedLine) {
        line.style.backgroundColor = '#b43333';
        line.style.filter = 'drop-shadow(0 2px 4px rgba(180, 51, 51, 0.4))';
        line.style.boxShadow = `
          0 0 4px rgba(180, 51, 51, 0.8),
          0 0 8px rgba(180, 51, 51, 0.6),
          0 0 12px rgba(180, 51, 51, 0.4),
          0 0 16px rgba(180, 51, 51, 0.2)
        `;
      }

      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const totalProgress = Math.min(
          elapsed / (phase1Duration + phase2Duration),
          1
        );

        if (elapsed < phase1Duration) {
          const phase1Progress = elapsed / phase1Duration;
          const easedProgress = 1 - Math.pow(1 - phase1Progress, 3);
          const currentHeight = distance * easedProgress;

          line.style.height = currentHeight + 'px';
          line.style.width = initialWidth + 'px';

          if (easedProgress >= 0.95 && !addedToTouching) {
            touchingLinesRef.current.push(lineData);
            updateBallColor();
            addedToTouching = true;
          }
        } else {
          if (!addedToTouching) {
            touchingLinesRef.current.push(lineData);
            updateBallColor();
            addedToTouching = true;
          }

          const phase2Progress = (elapsed - phase1Duration) / phase2Duration;
          const easedProgress = 1 - Math.pow(1 - phase2Progress, 3);
          const currentHeight = distance * (1 - easedProgress);

          const currentX = startX + (targetX - startX) * easedProgress;
          const currentY = startY + (targetY - startY) * easedProgress;

          line.style.left = currentX + 'px';
          line.style.top = currentY + 'px';
          line.style.height = currentHeight + 'px';
          line.style.width = initialWidth + 'px';
        }

        if (totalProgress < 1) {
          requestAnimationFrame(animate);
        } else {
          if (container.contains(line)) {
            container.removeChild(line);
          }

          const index = touchingLinesRef.current.findIndex(
            (l) => l.element === line
          );
          if (index > -1) {
            touchingLinesRef.current.splice(index, 1);
            updateBallColor();
          }
        }
      };

      animate();
    };

    let lineSequenceTimeout: NodeJS.Timeout;
    let lineTimeouts: NodeJS.Timeout[] = [];

    const startLineSequence = () => {
      animateLine();

      lineTimeouts.forEach((timeout) => clearTimeout(timeout));
      lineTimeouts = [];

      lineTimeouts.push(
        setTimeout(() => animateLine(), 2000 + Math.random() * 3000)
      );
      lineTimeouts.push(
        setTimeout(() => animateLine(), 4500 + Math.random() * 3000)
      );

      lineSequenceTimeout = setTimeout(
        startLineSequence,
        10000 + Math.random() * 2000
      );
    };

    startLineSequence();

    return () => {
      const existingStyle = document.getElementById('constantPulseStyle');
      if (existingStyle) {
        existingStyle.remove();
      }

      clearTimeout(lineSequenceTimeout);
      lineTimeouts.forEach((timeout) => clearTimeout(timeout));
      touchingLinesRef.current = [];
    };
  }, [balls, ballPosition]); // Use ballPosition instead of currentBallPosition

  const handleBallClick = (clickedBall: BallInstance) => {
    if (balls.length >= 10) {
      setBalls((prev) => {
        const nonOriginalBalls = prev.filter((ball) => !ball.isOriginal);
        if (nonOriginalBalls.length > 0) {
          const oldestBall = nonOriginalBalls[0];
          const updatedBalls = prev.map((ball) =>
            ball.id === oldestBall.id ? { ...ball, isDisappearing: true } : ball
          );

          const timeoutId = setTimeout(() => {
            setBalls((current) =>
              current.filter((ball) => ball.id !== oldestBall.id)
            );
            disappearTimeouts.current.delete(oldestBall.id);
          }, 500);

          disappearTimeouts.current.set(oldestBall.id, timeoutId);

          return updatedBalls;
        }
        return prev;
      });
    }

    const finalX = 15 + Math.random() * 70;
    const finalY = 15 + Math.random() * 70;

    const spawnX = clickedBall.x;
    const spawnY = clickedBall.y;

    const newBall: BallInstance = {
      id: nextBallId.current++,
      x: spawnX,
      y: spawnY,
      isOriginal: false,
      isTransitioning: false,
      createdAt: Date.now(),
    };

    setBalls((prev) => [...prev, newBall]);

    setTimeout(() => {
      setBalls((prev) =>
        prev.map((ball) =>
          ball.id === newBall.id
            ? { ...ball, x: finalX, y: finalY, isTransitioning: true }
            : ball
        )
      );
    }, 50);
  };

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      for (const ball of balls) {
        const ballScreenX = (window.innerWidth * ball.x) / 100;
        const ballScreenY = (window.innerHeight * ball.y) / 100;

        const distance = Math.sqrt(
          Math.pow(clickX - ballScreenX, 2) + Math.pow(clickY - ballScreenY, 2)
        );

        if (distance <= 20) {
          handleBallClick(ball);
          break;
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [balls, handleBallClick]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {balls.map((ball) => (
        <div
          key={ball.id}
          className={`cosmic-ball absolute w-8 h-8 rounded-full z-[100] ease-out hover:scale-110 cursor-pointer ${
            ball.isTransitioning
              ? 'transition-all duration-1000'
              : 'transition-all duration-300'
          } ${ball.isDisappearing ? 'transition-all duration-500' : ''}`}
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgb(229, 229, 229)',
            width: ball.isDisappearing ? '0px' : '32px',
            height: ball.isDisappearing ? '0px' : '32px',
            opacity: ball.isDisappearing ? '0' : '1',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleBallClick(ball);
          }}
          ref={ball.isOriginal ? dotRef : undefined}
        />
      ))}
    </div>
  );
}
