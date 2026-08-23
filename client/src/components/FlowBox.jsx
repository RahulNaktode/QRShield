function FlowBox({
  Icon,
  title,
  sub,
  accent = false,
}) {
  return (
    <div
      className={`bg-[#141A26] rounded-[10px] px-4 py-[14px] min-w-[140px] flex items-center gap-[10px] border ${
        accent
          ? "border-[#4C7CF3]/35"
          : "border-[#242D40]"
      }`}
    >
      <Icon
        size={18}
        strokeWidth={1.8}
        className={accent ? "text-[#4C7CF3]" : "text-[#8A94AA]"}
      />

      <div>
        <div className="text-[13px] font-semibold text-[#EAEEF6]">
          {title}
        </div>

        <div className="text-[11px] text-[#5B6479] mt-[1px]">
          {sub}
        </div>
      </div>
    </div>
  );
}

export default FlowBox;