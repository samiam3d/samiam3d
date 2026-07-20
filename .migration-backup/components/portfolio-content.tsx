import { portfolioHtml } from "@/lib/portfolio-content";

export function PortfolioContent() {
  return (
    <div
      className="portfolio-content"
      dangerouslySetInnerHTML={{ __html: portfolioHtml }}
    />
  );
}
