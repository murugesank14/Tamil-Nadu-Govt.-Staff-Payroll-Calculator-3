
import React, { createContext, useContext, useState, useRef } from 'react';

// Main context for the accordion group
type AccordionContextType = {
  openItem: string | null;
  setOpenItem: (value: string | null) => void;
  collapsible: boolean;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion component');
  }
  return context;
};

// Context for each individual item to pass its value down
type AccordionItemContextType = {
  value: string;
};

const AccordionItemContext = createContext<AccordionItemContextType | null>(null);

const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used within an AccordionItem component');
  }
  return context;
};

export const Accordion: React.FC<{
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  className?: string;
  collapsible?: boolean;
}> = ({ children, type = 'single', className, collapsible = false }) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const value = {
    openItem,
    setOpenItem,
    collapsible,
  };

  return (
    <AccordionContext.Provider value={value}>
      <div className={`border rounded-md ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem: React.FC<{ children: React.ReactNode; value: string; className?: string }> = ({
  children,
  value,
  className,
}) => {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={`border-b last:border-b-0 ${className}`}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

export const AccordionTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const { openItem, setOpenItem, collapsible } = useAccordion();
  const { value } = useAccordionItem();
  const isOpen = openItem === value;

  const handleToggle = () => {
    if (isOpen && collapsible) {
      setOpenItem(null);
    } else {
      setOpenItem(value);
    }
  };

  return (
    <h3 className="font-medium text-lg">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${value}`}
        className={`flex flex-1 items-center justify-between p-4 transition-all hover:underline w-full [&[data-state=open]>svg]:rotate-180 ${className}`}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {children}
        <svg
          className="h-4 w-4 shrink-0 transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </h3>
  );
};

export const AccordionContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const { openItem } = useAccordion();
  const { value } = useAccordionItem();
  const contentRef = useRef<HTMLDivElement>(null);
  const isOpen = openItem === value;

  return (
    <div
      ref={contentRef}
      id={`accordion-content-${value}`}
      aria-labelledby={`accordion-trigger-${value}`}
      hidden={!isOpen}
      style={{
        maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
        transition: 'max-height 0.3s ease-out',
        overflow: 'hidden'
      }}
    >
      <div className={`pt-0 p-4 ${className}`}>
        {children}
      </div>
    </div>
  );
};
