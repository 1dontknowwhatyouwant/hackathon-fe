type PlaceMatchedProductCardProps = {
  name: string;
  matchScore: number;
  priceLabel: string;
  thumbnailColor: string;
  favorite: boolean;
  onFavoriteChange: () => void;
};

export function PlaceMatchedProductCard({
  name,
  matchScore,
  priceLabel,
  thumbnailColor,
  favorite,
  onFavoriteChange,
}: PlaceMatchedProductCardProps) {
  return (
    <article className="flex h-[74px] items-center rounded-[15px] border border-[#dbdee3] bg-[#f6f6f8] px-3">
      <span
        aria-hidden="true"
        className="size-[46px] shrink-0 rounded-[11px]"
        style={{ backgroundColor: thumbnailColor }}
      />
      <span className="ml-4 min-w-0 flex-1">
        <span className="block truncate text-[14px] leading-[17px] font-bold text-[#0e0e12]">
          {name}
        </span>
        <span className="mt-2 block truncate text-[11px] leading-[13px] text-[#6e707a]">
          장소 매치 {matchScore}% · {priceLabel}
        </span>
      </span>
      <button
        type="button"
        aria-label={favorite ? `${name} 찜 해제` : `${name} 찜하기`}
        aria-pressed={favorite}
        className="ml-3 flex size-10 shrink-0 items-center justify-center text-[21px] leading-none text-[#6e707a]"
        onClick={onFavoriteChange}
      >
        {favorite ? "♥" : "♡"}
      </button>
    </article>
  );
}
