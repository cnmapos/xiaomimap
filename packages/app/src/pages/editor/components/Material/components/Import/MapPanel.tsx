

const Panel: React.FC<{ children: React.ReactNode, title?: string }> = ({ children, title }) => {
  return (
    <div className="bg-neutral-800/90 rounded-sm p-4 min-w-60">
      {title && <h3 className="font-bold text-base mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Panel;
