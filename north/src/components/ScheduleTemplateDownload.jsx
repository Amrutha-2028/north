import "./ScheduleTemplateDownload.css";

export default function ScheduleTemplateDownload({
  children = "Download the schedule template",
  className = "",
}) {
  return (
    <a
      className={`schedule-template-download ${className}`.trim()}
      href="/scheduletemplate.xlsx"
      download="NORTH-Schedule-Template.xlsx"
    >
      {children} <span aria-hidden="true">↓</span>
    </a>
  );
}
