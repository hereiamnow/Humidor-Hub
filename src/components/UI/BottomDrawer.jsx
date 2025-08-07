import React from 'react';

/**
 * BottomDrawer Component
 * @param {React.ReactNode} icon - Optional icon component
 * @param {string} title - Panel title
 * @param {string} bgColor - Tailwind bg color class (e.g. 'bg-base-100/80')
 * @param {string} borderRadius - Tailwind border radius class (e.g. 'rounded-md')
 * @param {React.ReactNode} children - Panel content
 * @param {React.ReactNode} actions - Panel actions (footer)
 * @param {string} className - Additional classes for the panel
 * @param {function} onClose - Optional close handler
 */
const BottomDrawer = ({
  icon,
  title,
  bgColor = 'bg-base-100/80',
  children,
  actions,
  className = '',
  onClose
}) => (
  <div className={`fixed bottom-20 left-0 right-0 ${bgColor} backdrop-blur-sm p-4 z-20 border-t border-base-content/10  ${className}`}>
    <div className="max-w-md mx-auto">
      {/* Panel Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-primary flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h3>
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost">Done</button>
        )}
      </div>
      {/* Panel Content */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {children}
      </div>
      {/* Panel Actions */}
      {actions && (
        <div className="flex gap-3 pt-4 mt-4 border-t border-base-content/10">
          {actions}
        </div>
      )}
    </div>
  </div>
);

export default BottomDrawer;