'use client';

import React, { useEffect, useRef } from 'react';

// Line types - only straight lines
const lineTypes = ['horizontal', 'vertical', 'diagonal'] as const;
type LineType = (typeof lineTypes)[number];

class MovingLine {
  type: LineType;
  length: number;
  opacity: number;
  maxOpacity: number;
  fadeSpeed: number;
  life: number;
  maxLife: number;
  speed: number;
  thickness: number;
  x: number;
  y: number;
  endX: number;
  endY: number;
  vx: number;
  vy: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  maxOpacityBase: number;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    maxOpacityBase: number
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.maxOpacityBase = maxOpacityBase;
    this.type = lineTypes[Math.floor(Math.random() * lineTypes.length)];
    this.length = Math.random() * 150 + 50;
    this.opacity = 0;
    this.maxOpacity = Math.random() * maxOpacityBase + 0.1;
    this.fadeSpeed = Math.random() * 0.015 + 0.005;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
    this.speed = Math.random() * 2 + 0.5;
    this.thickness = Math.random() * 2 + 1;
    this.x = 0;
    this.y = 0;
    this.endX = 0;
    this.endY = 0;
    this.vx = 0;
    this.vy = 0;

    this.setupMovement();
  }

  setupMovement() {
    switch (this.type) {
      case 'horizontal':
        // Always horizontal - left to right or right to left
        if (Math.random() < 0.5) {
          this.x = -this.length;
          this.vx = this.speed;
        } else {
          this.x = this.canvas.width + this.length;
          this.vx = -this.speed;
        }
        this.y = Math.random() * this.canvas.height;
        this.vy = 0;
        this.endX = this.x + this.length * (this.vx > 0 ? 1 : -1);
        this.endY = this.y;
        break;

      case 'vertical':
        // Always vertical - top to bottom or bottom to top
        if (Math.random() < 0.5) {
          this.y = -this.length;
          this.vy = this.speed;
        } else {
          this.y = this.canvas.height + this.length;
          this.vy = -this.speed;
        }
        this.x = Math.random() * this.canvas.width;
        this.vx = 0;
        this.endX = this.x;
        this.endY = this.y + this.length * (this.vy > 0 ? 1 : -1);
        break;

      case 'diagonal':
        // Fixed diagonal directions - 45 degrees
        const direction = Math.floor(Math.random() * 4);
        const diagonalSpeed = this.speed * 0.707; // cos(45°) = sin(45°) = 0.707

        if (direction === 0) {
          // Top-left to bottom-right
          this.x = -this.length;
          this.y = -this.length;
          this.vx = diagonalSpeed;
          this.vy = diagonalSpeed;
        } else if (direction === 1) {
          // Top-right to bottom-left
          this.x = this.canvas.width + this.length;
          this.y = -this.length;
          this.vx = -diagonalSpeed;
          this.vy = diagonalSpeed;
        } else if (direction === 2) {
          // Bottom-left to top-right
          this.x = -this.length;
          this.y = this.canvas.height + this.length;
          this.vx = diagonalSpeed;
          this.vy = -diagonalSpeed;
        } else {
          // Bottom-right to top-left
          this.x = this.canvas.width + this.length;
          this.y = this.canvas.height + this.length;
          this.vx = -diagonalSpeed;
          this.vy = -diagonalSpeed;
        }

        this.endX = this.x + this.length * (this.vx > 0 ? 1 : -1);
        this.endY = this.y + this.length * (this.vy > 0 ? 1 : -1);
        break;
    }
  }

  updateEndPoints() {
    // End points are already set in setupMovement for straight lines
    this.endX = this.x + this.length * (this.vx > 0 ? 1 : this.vx < 0 ? -1 : 0);
    this.endY = this.y + this.length * (this.vy > 0 ? 1 : this.vy < 0 ? -1 : 0);
  }

  update() {
    this.life++;

    // Move the line - keep direction constant
    this.x += this.vx;
    this.y += this.vy;

    // Update end points to follow the line
    this.updateEndPoints();

    // Fade in and out
    if (this.life < this.maxLife * 0.2) {
      this.opacity = Math.min(this.opacity + this.fadeSpeed, this.maxOpacity);
    } else if (this.life > this.maxLife * 0.8) {
      this.opacity = Math.max(this.opacity - this.fadeSpeed, 0);
    }

    // Reset if dead or completely out of bounds
    if (
      this.life >= this.maxLife ||
      this.opacity <= 0 ||
      (this.x < -200 && this.endX < -200) ||
      (this.x > this.canvas.width + 200 &&
        this.endX > this.canvas.width + 200) ||
      (this.y < -200 && this.endY < -200) ||
      (this.y > this.canvas.height + 200 &&
        this.endY > this.canvas.height + 200)
    ) {
      this.reset();
    }
  }

  reset() {
    this.type = lineTypes[Math.floor(Math.random() * lineTypes.length)];
    this.length = Math.random() * 150 + 50;
    this.opacity = 0;
    this.maxOpacity = Math.random() * this.maxOpacityBase + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
    this.speed = Math.random() * 2 + 0.5;
    this.thickness = Math.random() * 2 + 1;
    this.setupMovement();
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = this.thickness;
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.endX, this.endY);
    this.ctx.stroke();

    this.ctx.restore();
  }
}

const MovingLinesBackground = ({
  className = '',
  lineCount = 20,
  opacity = 0.3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const linesRef = useRef<MovingLine[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize lines
    linesRef.current = [];
    for (let i = 0; i < lineCount; i++) {
      linesRef.current.push(new MovingLine(canvas, ctx, opacity));
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      linesRef.current.forEach((line) => {
        line.update();
        line.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [lineCount, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: 'transparent',
      }}
    />
  );
};

export default MovingLinesBackground;
