type ChoiceOption<T extends string> = {
  value: T;
  label: string;
};

type ChoiceChipGroupProps<T extends string> = {
  legend: string;
  options: readonly ChoiceOption<T>[];
  selectedValues: readonly T[];
  onToggle: (value: T) => void;
  description?: string;
  required?: boolean;
};

export function ChoiceChipGroup<T extends string>({
  legend,
  options,
  selectedValues,
  onToggle,
  description,
  required = false,
}: ChoiceChipGroupProps<T>) {
  return (
    <fieldset>
      <legend className="text-[13px] font-bold text-[#25252a]">
        {legend}
        {required ? <span className="ml-1 text-[#9a4545]">*</span> : null}
      </legend>
      {description ? (
        <p className="mt-1 text-[11px] leading-4 text-[#888890]">{description}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(option.value)}
              className={`min-h-[38px] rounded-full border px-4 py-2 text-[12px] font-bold transition-colors ${
                isSelected
                  ? "border-[#15151a] bg-[#15151a] text-white"
                  : "border-[#d6d3cf] bg-white text-[#5f5f68] hover:border-[#a9a39b]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
