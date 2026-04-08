import type { NewsItem } from "../../types";

interface NewsCardProps {
  item: NewsItem;
  isRead?: boolean;
  onClick?: () => void;
}

export default function NewsCard({ item, isRead, onClick }: NewsCardProps) {
  const read = isRead ?? item.isRead;
  return (
    <button className={`ui-news-card ${read ? "ui-news-card--read" : ""}`} onClick={onClick}>
      {!read && <span className="ui-news-card-unread-dot" />}
      <div className="ui-news-card-top">
        <span className={`ui-news-card-badge ui-news-card-badge--${item.urgency}`}>
          {item.category}
        </span>
        <span className="ui-news-card-date">{item.date}</span>
      </div>
      <h4 className="ui-news-card-title">{item.title}</h4>
      <p className="ui-news-card-summary">{item.summary}</p>
      {item.author && (
        <span className="ui-news-card-author">{item.author}</span>
      )}
    </button>
  );
}
