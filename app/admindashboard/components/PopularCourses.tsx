import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Course {
  id: string;
  title: string;
  enrollments: number;
  completionRate: number;
  category: string;
}

interface PopularCoursesProps {
  courses: Course[];
}

const PopularCourses = ({ courses }: PopularCoursesProps) => {
  return (
    <div className="rounded-xl bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">Popular Courses</h3>
          <p className="mt-1 font-caption text-sm text-muted-foreground">Top performing courses this month</p>
        </div>
        <Icon name="AcademicCapIcon" size={24} className="text-primary" />
      </div>
      
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={course.id} className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-smooth hover:border-primary/50 hover:bg-muted/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 font-heading text-lg font-bold text-primary">
              {index + 1}
            </div>
            
            <div className="flex-1">
              <h4 className="font-caption text-sm font-medium text-foreground">{course.title}</h4>
              <div className="mt-1 flex items-center gap-4">
                <span className="font-caption text-xs text-muted-foreground">
                  {course.enrollments.toLocaleString()} students
                </span>
                <span className="font-caption text-xs text-muted-foreground">
                  {course.category}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-sm font-medium text-success">{course.completionRate}%</span>
              <span className="font-caption text-xs text-muted-foreground">completion</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCourses;