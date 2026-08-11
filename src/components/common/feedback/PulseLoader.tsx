type PulseLoaderProps = {
  label?: string;
};

const CIRCLE_COUNT = 4;

export function PulseLoader({
  label = "콘텐츠를 불러오는 중입니다.",
}: PulseLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="pulse-loader"
    >
      {Array.from({ length: CIRCLE_COUNT }, (_, index) => {
        const circleDelay = `${index * 0.3}s`;
        const outlineDelay = `${0.9 + index * 0.3}s`;

        return (
          <span
            key={index}
            aria-hidden="true"
            className="pulse-loader__circle"
            style={{ animationDelay: circleDelay }}
          >
            <span
              className="pulse-loader__dot"
              style={{ animationDelay: circleDelay }}
            />
            <span
              className="pulse-loader__outline"
              style={{ animationDelay: outlineDelay }}
            />
          </span>
        );
      })}
    </div>
  );
}
