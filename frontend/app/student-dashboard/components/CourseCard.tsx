import React from 'react';

interface Course {
    id: number;
    title: string;
    description: string;
    image: string;
    alt: string;
    progress: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    tokenReward: number;
    duration: string;
    enrolled: boolean;
}

interface CourseCardProps {
    course: Course;
    onEnroll: (courseId: number) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
    return (
        <div className="overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-glow-md transition-all duration-300">
            <div className="aspect-video relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={course.image}
                    alt={course.alt}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-medium text-white backdrop-blur-sm">
                    {course.difficulty}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-heading text-lg font-bold text-foreground mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                        <span>⏱️</span> {course.duration}
                    </span>
                    <span className="flex items-center gap-1 text-secondary">
                        <span>🪙</span> {course.tokenReward} Tokens
                    </span>
                </div>

                {course.enrolled ? (
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => onEnroll(course.id)}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Enroll Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default CourseCard;
