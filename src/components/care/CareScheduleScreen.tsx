import { DetailActionCard } from "@/components/common/card/DetailActionCard";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { dummyCareCalendar, dummyCareGuide } from "@/data/closetCare";

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];
const visibleDays = Array.from({ length: 28 }, (_, index) => index + 1);

function differenceInDays(from: string, to: string | null) {
  if (!to) {
    return null;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.max(
    0,
    Math.round((new Date(to).getTime() - new Date(from).getTime()) / millisecondsPerDay),
  );
}

export function CareScheduleScreen() {
  const daysUntilCare = differenceInDays(
    dummyCareCalendar.referenceDate,
    dummyCareGuide.schedule.recommendedNextCareAt,
  );

  return (
    <MobileScreenLayout
      figmaNodeId="96:536"
      contentClassName="bg-white px-6 pt-[47px] pb-[102px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      bottomNavigation={<BottomNavigation activeItem="home" />}
    >
      <LuxuryReveal>
        <ScreenHeader
          eyebrow="REMINDER"
          title="관리 캘린더"
          description={
            daysUntilCare === null
              ? "다음 클리닝 일정을 계산 중이에요"
              : `다음 클리닝까지 D-${daysUntilCare}`
          }
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-[31px]" delay={70}>
        <section
          aria-labelledby="care-calendar-title"
          className="h-[308px] rounded-[20px] border border-[#dedee2] bg-[#f8f8f9] px-5 pt-6"
        >
          <h2
            id="care-calendar-title"
            className="text-center text-[14px] leading-[17px] font-bold text-[#15151a]"
          >
            {dummyCareCalendar.monthLabel}
          </h2>

          <div
            aria-hidden="true"
            className="mt-[19px] grid grid-cols-7 text-center text-[11px] leading-[13px] font-bold text-[#9999a1]"
          >
            {weekdayLabels.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>

          <ol
            aria-label={`${dummyCareCalendar.monthLabel} 관리 일정`}
            className="mt-[12px] grid grid-cols-7 gap-y-3"
          >
            {visibleDays.map((day) => {
              const isHighlighted = day === dummyCareCalendar.highlightedDay;

              return (
                <li
                  key={day}
                  aria-label={isHighlighted ? `${day}일 관리 일정 있음` : `${day}일`}
                  className="flex h-[34px] items-center justify-center text-[12px] text-[#55555d]"
                >
                  <span
                    className={
                      isHighlighted
                        ? "flex size-[34px] items-center justify-center rounded-full bg-[#bdbdbd] text-transparent"
                        : undefined
                    }
                  >
                    {day}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-[34px]" delay={130}>
        <section aria-label="관리 일정 목록" className="space-y-5">
          {dummyCareCalendar.reminders.map((reminder) => (
            <DetailActionCard
              key={reminder.id}
              title={`${reminder.dateLabel} ${reminder.title}`}
            />
          ))}
        </section>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
