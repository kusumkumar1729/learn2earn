'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface ConfettiProps {
    isActive: boolean;
    onComplete?: () => void;
    duration?: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
}

const COLORS = [
    '#10B981', // success/accent
    '#6366F1', // primary
    '#8B5CF6', // secondary
    '#F59E0B', // warning
    '#EC4899', // pink
    '#06B6D4', // cyan
];

const Confetti: React.FC<ConfettiProps> = ({
    isActive,
    onComplete,
    duration = 3000,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    const createParticles = useCallback(() => {
        const particles: Particle[] = [];
        const particleCount = 150;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: -20 - Math.random() * 100,
                vx: (Math.random() - 0.5) * 8,
                vy: Math.random() * 3 + 2,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                opacity: 1,
            });
        }

        return particles;
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((particle) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.rotation += particle.rotationSpeed;
            particle.opacity = 1 - progress * 0.5;

            // Draw particle
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate((particle.rotation * Math.PI) / 180);
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = particle.color;
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size / 2);
            ctx.restore();
        });

        if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            if (onComplete) onComplete();
        }
    }, [duration, onComplete]);

    useEffect(() => {
        if (isActive) {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            particlesRef.current = createParticles();
            startTimeRef.current = Date.now();
            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isActive, createParticles, animate]);

    if (!isActive) return null;

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[9999]"
            style={{ background: 'transparent' }}
        />
    );
};

export default Confetti;
