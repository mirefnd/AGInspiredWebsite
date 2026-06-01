import { getSearchString, type SearchParams } from "@/lib/route-utils";
import { RouteRedirect } from "@/components/route-redirect";

type PageProps = {
  searchParams?: SearchParams;
};

export default function MailCatchAllPage({ searchParams }: PageProps) {
  return <RouteRedirect basePath="/mail" search={getSearchString(searchParams)} />;
}
