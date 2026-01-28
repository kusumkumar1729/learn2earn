import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Deadline {
  id: number;
  title: string;
  courseName: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'Assignment' | 'Quiz' | 'Project' | 'Exam';
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

const UpcomingDeadlines = ({ deadlines }: UpcomingDeadlinesProps) => {
  const priorityColors = {
    High: 'text-error bg-error/20',
    Medium: 'text-warning bg-warning/20',
    Low: 'text-accent bg-accent/20',
  };

  const typeIcons = {
    Assignment: 'DocumentTextIcon',
    Quiz: 'QuestionMarkCircleIcon',
    Project: 'BriefcaseIcon',
    Exam: 'AcademicCapIcon',
  };

  return (
    <div
      className="overflow-hidden rounded-xl bg-card p-6 shadow-glow-sm backdrop-blur-sm"
    >
      <h3 className="mb-6 font-heading text-xl font-bold text-foreground">
        Upcoming Deadlines
      </h3>
      <div className="space-y-4">
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="group rounded-lg border border-border p-4 transition-smooth hover:border-primary hover:shadow-glow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  name={typeIcons[deadline.type]}
                  size={20}
                  className="text-primary"
                />
                <h4 className="font-caption text-sm font-medium text-foreground line-clamp-1">
                  {deadline.title}
                </h4>
              </div>
              <span
                className={`rounded-md px-2 py-0.5 font-caption text-xs font-medium ${priorityColors[deadline.priority]
                  }`}
              >
                {deadline.priority}
              </span>
            </div>
            <p className="mb-2 font-caption text-xs text-muted-foreground">
              {deadline.courseName}
            </p>
            <div className="flex items-center gap-2">
              <Icon name="CalendarIcon" size={16} className="text-muted-foreground" />
              <span className="font-caption text-xs text-muted-foreground">
                Due {deadline.dueDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;