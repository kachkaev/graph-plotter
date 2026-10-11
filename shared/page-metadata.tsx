import Head from "next/head";
import { useTranslation } from "react-i18next";

export function PageMetadata({
  title,
  description,
}: {
  title?: string | undefined;
  description?: string | undefined;
}) {
  const { t } = useTranslation();

  const resolvedTitle =
    title ?? `${t("ui.l_app_title_1")} ${t("ui.l_app_title_2")}`;
  const resolvedDescription = title ?? t("ui.l_info_1");

  return (
    <Head>
      <title>{resolvedTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:title" content={resolvedTitle} />
      <meta property="twitter:description" content={resolvedDescription} />
    </Head>
  );
}
