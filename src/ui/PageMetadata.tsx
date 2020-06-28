import Head from "next/head";
import React from "react";
import { useTranslation } from "react-i18next";

export const PageMetadata: React.FunctionComponent<{
  title?: string;
  description?: string;
}> = ({ title, description }) => {
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
      {/* <meta
        property="og:image"
        content={`${process.env.siteUrl}/og-image.png`}
      />
      <meta
        property="twitter:image"
        content={`${process.env.siteUrl}/og-image.png`}
      />
      <meta
        property="vk:image"
        content={`${process.env.siteUrl}/og-image.png`}
      /> */}
    </Head>
  );
};
