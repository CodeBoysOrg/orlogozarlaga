import React from "react";

type StatCardProps = {
  title: string;
  value: string;
  className?: string; // background/text өнгө зэрэг
  valueClassName?: string; // value font size / align
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  className = "",
  valueClassName = "text-xl text-end font-semibold",
}) => {
  return (
    <div
      className={`theme-card-default flex flex-col rounded-2xl p-3 ${className} `}>
      <p className="text-xs uppercase tracking-[0.14em] opacity-80">{title}</p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
};

export default StatCard;
