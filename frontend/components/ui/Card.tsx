import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
};

export default function Card({ children, className = "", title, description, action }: CardProps) {
  return (
    <section className={`ui-card ${className}`.trim()}>
      {(title || description || action) && (
        <div className="ui-card__head">
          <div>
            {title ? <h2 className="ui-card__title">{title}</h2> : null}
            {description ? <p className="ui-card__desc">{description}</p> : null}
          </div>
          {action ? <div className="ui-card__action">{action}</div> : null}
        </div>
      )}
      <div className="ui-card__body">{children}</div>
    </section>
  );
}
