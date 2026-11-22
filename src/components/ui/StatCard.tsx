import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  variant?: "default" | "accent" | "success" | "warning" | "danger";
  badgeText?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  badgeText,
}: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-icon-wrap">{icon}</div>
      </div>
      <div className="stat-card-value-wrap">
        <span className="stat-card-value">{value}</span>
        {badgeText && <span className="stat-card-badge">{badgeText}</span>}
      </div>
      {(subtitle || trend) && (
        <div className="stat-card-footer">
          {trend && (
            <span
              className={`stat-trend ${trend.isPositive ? "trend-up" : "trend-down"}`}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
