import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen } from 'lucide-react';

export const StudentClassroom: React.FC = () => {
  const { classroomItems, course } = useApp();

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Classroom</h1>
        <p className="text-xs text-muted mt-1 font-mono">
          Weekly learning items, tasks, lab manuals and announcements posted by your faculty in-charge.
        </p>
      </div>

      {classroomItems.length === 0 ? (
        <div className="p-12 bg-surface rounded-[6px] border border-border text-center space-y-3">
          <BookOpen className="w-8 h-8 text-muted mx-auto" />
          <div className="font-semibold text-sm text-ink">No classroom items posted yet</div>
          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            Your faculty in-charge for {course.title || 'this course'} has not published any learning tasks or lab manuals yet. Check back during scheduled lab hours.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {classroomItems.map((item) => (
            <div key={item.id} className="p-4 bg-surface rounded-[6px] border border-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-ink">{item.title}</div>
                <div className="text-[11px] text-muted mt-0.5">{item.description}</div>
              </div>
              <span className="px-2 py-0.5 bg-surface-alt text-muted rounded text-xs font-mono">
                {item.kind}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
