import { redirect } from "next/navigation";

export default async function MessListingRedirect({ searchParams }) {
  const params = await searchParams;

  const query = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else if (value != null) {
      query.append(key, value);
    }
  });

  const search = query.toString();

  redirect(search ? `/?${search}` : "/");
}
