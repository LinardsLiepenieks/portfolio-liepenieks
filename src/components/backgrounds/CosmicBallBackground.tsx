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

  // Add refs to track animation state
  const lineSequenceTimeoutRef = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);
  const lineTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isAnimatingRef = useRef(false);

  // Use the ballPosition prop directly
  const ballPositionRef = useRef(ballPosition);

  const [balls, setBalls] = useState<BallInstance[]>([
    { id: 0, x: ballPosition.x, y: ballPosition.y, isOriginal: true },
  ]);

  // Function to get accurate viewport dimensions for mobile
  const getViewportDimensions = () => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        offsetX: rect.left,
        offsetY: rect.top,
      };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      offsetX: 0,
      offsetY: 0,
    };
  };

  // Function to get ball position in screen coordinates
  const getBallScreenPosition = (ball: BallInstance) => {
    const { width, height, offsetX, offsetY } = getViewportDimensions();
    return {
      x: offsetX + (width * ball.x) / 100,
      y: offsetY + (height * ball.y) / 100,
    };
  };

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

  // Cleanup function to stop all animations and clear lines
  const cleanupAnimations = () => {
    // Clear all timeouts
    if (lineSequenceTimeoutRef.current) {
      clearTimeout(lineSequenceTimeoutRef.current);
      lineSequenceTimeoutRef.current = undefined;
    }

    lineTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    lineTimeoutsRef.current = [];

    // Remove all existing lines from DOM
    const container = containerRef.current;
    if (container) {
      const lines = container.querySelectorAll('div:not(.cosmic-ball)');
      lines.forEach((line) => {
        if (container.contains(line)) {
          container.removeChild(line);
        }
      });
    }

    // Clear touching lines reference
    touchingLinesRef.current = [];

    // Reset animation flag
    isAnimatingRef.current = false;
  };

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
      line.className = 'absolute bg-white/90 pointer-events-none cosmic-line';
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
      // Don't start new animations if we're not supposed to be animating
      if (!isAnimatingRef.current) return;

      // Get current container dimensions (mobile-safe)
      const {
        width: screenWidth,
        height: screenHeight,
        offsetX,
        offsetY,
      } = getViewportDimensions();

      // Use current ball position relative to container
      const centerX = (screenWidth * ballPositionRef.current.x) / 100;
      const centerY = (screenHeight * ballPositionRef.current.y) / 100;

      const side = Math.floor(Math.random() * 3);
      let startX, startY;

      if (side === 0) {
        // Left side
        startX = 0;
        startY = screenHeight * (0.2 + Math.random() * 0.4);
      } else if (side === 1) {
        // Right side
        startX = screenWidth;
        startY = screenHeight * (0.2 + Math.random() * 0.4);
      } else {
        // Top side
        startX = screenWidth * (0.2 + Math.random() * 0.6);
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

      // Position relative to container, not window
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
        // Stop animation if we're not supposed to be animating
        if (!isAnimatingRef.current) {
          if (container.contains(line)) {
            container.removeChild(line);
          }
          return;
        }

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

    const startLineSequence = () => {
      // Don't start if we're not supposed to be animating
      if (!isAnimatingRef.current) return;

      animateLine();

      // Clear existing timeouts
      lineTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      lineTimeoutsRef.current = [];

      // Only set new timeouts if we're still supposed to be animating
      if (isAnimatingRef.current) {
        lineTimeoutsRef.current.push(
          setTimeout(() => {
            if (isAnimatingRef.current) animateLine();
          }, 2000 + Math.random() * 3000)
        );
        lineTimeoutsRef.current.push(
          setTimeout(() => {
            if (isAnimatingRef.current) animateLine();
          }, 4500 + Math.random() * 3000)
        );

        lineSequenceTimeoutRef.current = setTimeout(() => {
          if (isAnimatingRef.current) startLineSequence();
        }, 10000 + Math.random() * 2000);
      }
    };

    // Start animations
    isAnimatingRef.current = true;
    startLineSequence();

    // Handle resize events
    const handleResize = () => {
      // Stop current animations
      cleanupAnimations();

      // Wait a brief moment for things to settle, then restart
      setTimeout(() => {
        if (containerRef.current && dotRef.current) {
          isAnimatingRef.current = true;
          startLineSequence();
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanupAnimations();

      const existingStyle = document.getElementById('constantPulseStyle');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [ballPosition]);

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
    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      let clickX, clickY;

      if (e instanceof TouchEvent) {
        // Handle touch events
        if (e.touches.length > 0) {
          clickX = e.touches[0].clientX;
          clickY = e.touches[0].clientY;
        } else if (e.changedTouches.length > 0) {
          clickX = e.changedTouches[0].clientX;
          clickY = e.changedTouches[0].clientY;
        } else {
          return;
        }
      } else {
        // Handle mouse events
        clickX = e.clientX;
        clickY = e.clientY;
      }

      for (const ball of balls) {
        const ballScreenPos = getBallScreenPosition(ball);

        const distance = Math.sqrt(
          Math.pow(clickX - ballScreenPos.x, 2) +
            Math.pow(clickY - ballScreenPos.y, 2)
        );

        if (distance <= 20) {
          handleBallClick(ball);
          break;
        }
      }
    };

    // Add both mouse and touch event listeners
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('touchend', handleGlobalClick);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('touchend', handleGlobalClick);
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
          onTouchStart={(e) => {
            e.preventDefault();
            handleBallClick(ball);
          }}
          ref={ball.isOriginal ? dotRef : undefined}
        />
      ))}
    </div>
  );
}
