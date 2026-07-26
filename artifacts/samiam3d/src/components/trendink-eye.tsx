type TrendInkEyeProps = {
  compact?: boolean;
};

export function TrendInkEye({ compact = false }: TrendInkEyeProps) {
  return (
    <span
      className={`trendink-eye${compact ? " trendink-eye--compact" : ""}`}
      aria-hidden="true"
    >
      <img
        src="/assets/images/creations/trendink-aperture.webp"
        alt=""
        width="2400"
        height="2400"
        loading="lazy"
        decoding="async"
      />
      <span className="trendink-eye__eye">
        <span className="trendink-eye__iris-track">
          <span className="trendink-eye__iris" />
        </span>
      </span>
      <span className="trendink-eye__sheen" />
    </span>
  );
}
