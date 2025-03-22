import { CloseOutlined } from "@ant-design/icons";
import classNames from "classnames";
interface MapPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  
}

const Panel: React.FC<MapPanelProps> = ({ onClose:propsOnClose,children, title, className }) => {
  const onClose = () => {
    propsOnClose?.();
  }
  return (
    <div className={classNames("absolute z-10 right-4 top-20", className)}>
      <div
        className="bg-neutral-800/90 rounded-sm min-w-60">
        {title && (
          <h3 className="font-bold text-base leading-10 px-4 flex items-center justify-between">
            <span className="w-0  flex-1 text-ellipsis overflow-hidden whitespace-nowrap">{title}</span>
            <span className="text-sm flex items-center justify-end text-gray-400 w-5 h-5 cursor-pointer" onClick={onClose}>
              <CloseOutlined />
            </span>
          </h3>
        )}
        <div className={classNames("px-4 pb-4 pt-1", {
          'pt-4': !title,
        })}>{children}</div>
      </div>
    </div>
  );
};

export default Panel;
