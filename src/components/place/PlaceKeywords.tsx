type PlaceKeywordsProps = {
  keywords: string[];
};

export function PlaceKeywords({ keywords }: PlaceKeywordsProps) {
  return (
    <p aria-label={`추천 키워드: ${keywords.join(", ")}`}>
      {keywords.map((keyword, index) => (
        <span key={`${keyword}-${index}`}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {keyword}
        </span>
      ))}
    </p>
  );
}
