import { DoorQrCard, type DoorQrCardProps } from "./DoorQrCard";

const CARDS_PER_PAGE = 4;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * Tiles door QR cards four to an A4 page (spec/screens/print/P-03-door-qr-card.md),
 * 2 columns x 2 rows of exactly A4/2 x A4/2 each. Each group of 4 is its
 * own page-sized grid container so `break-after` reliably starts a new
 * page for a 5th+ card — CSS fragmentation rules inside a single
 * multi-row grid are unreliable across print engines.
 */
export function DoorQrGrid({ cards }: { cards: DoorQrCardProps[] }) {
  const pages = chunk(cards, CARDS_PER_PAGE);

  return (
    <>
      {pages.map((page, pageIndex) => (
        <div
          key={page[0]?.unitLabel ?? pageIndex}
          className="grid h-[297mm] w-[210mm] grid-cols-2 grid-rows-2"
          style={pageIndex !== pages.length - 1 ? { breakAfter: "page" } : undefined}
        >
          {page.map((card) => (
            <DoorQrCard key={card.unitLabel} {...card} />
          ))}
        </div>
      ))}
    </>
  );
}
