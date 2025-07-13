type ErroruiType = {
  title: string;
  btnLabel?: string;
  fontSize?: string;
  className?: string;
  onClick: () => void;
};

const Errorui: React.FC<ErroruiType> = ({ title, btnLabel = "تلاش مجدد", fontSize = "h5", className = "", onClick }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-start gap-y-5 ${className}`}>
      <p className={`${fontSize}`}>{title}</p>

      <button type="button" onClick={onClick} className="border rounded-xl border-black py-2 px-5">
        {btnLabel}
      </button>
    </div>
  );
};

export default Errorui;
