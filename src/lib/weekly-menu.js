import WeeklyMenu from "@/models/WeeklyMenu";

const MAX_DISHES = 20;

/**
 * Upserts the weekly menu entries for a mess and removes slots that are no
 * longer part of the submitted plan.
 */
export async function saveWeeklyMenu(messId, entries) {
  if (!Array.isArray(entries)) return [];

  const saved = [];

  for (const entry of entries) {
    const dishes = Array.isArray(entry.dishes)
      ? entry.dishes.map((dish) => String(dish).trim()).filter(Boolean).slice(0, MAX_DISHES)
      : [];

    const doc = await WeeklyMenu.findOneAndUpdate(
      { messId, dayOfWeek: entry.dayOfWeek, mealSlot: entry.mealSlot },
      {
        $set: {
          dishes,
          time: entry.time || "",
          foodType: entry.foodType || "both",
          isAvailable: entry.isAvailable !== false,
          isDeleted: false,
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    saved.push(doc);
  }

  const keep = new Set(entries.map((entry) => `${entry.dayOfWeek}:${entry.mealSlot}`));
  const planned = new Set(saved.map((doc) => `${doc.dayOfWeek}:${doc.mealSlot}`));
  const stale = await WeeklyMenu.find({ messId, isDeleted: false }).select("dayOfWeek mealSlot").lean();
  const staleIds = stale
    .filter((doc) => !keep.has(`${doc.dayOfWeek}:${doc.mealSlot}`) && !planned.has(`${doc.dayOfWeek}:${doc.mealSlot}`))
    .map((doc) => doc._id);

  if (staleIds.length) {
    await WeeklyMenu.updateMany({ _id: { $in: staleIds } }, { $set: { isDeleted: true, isAvailable: false } });
  }

  return saved;
}
